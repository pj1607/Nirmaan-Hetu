import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  TextField,
  IconButton,
  Box,
  Stack,
  Avatar,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import PersonIcon from "@mui/icons-material/Person";
import { useAnimation, motion } from "framer-motion";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Slide-in transition from right
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

// Modern typing loader (3 bouncing dots)
const TypingLoader = () => (
  <Box
    sx={{
      display: "flex",
      gap: 0.5,
      px: 2,
      py: 1.2,
      bgcolor: "#444",
      borderRadius: "16px",
      maxWidth: "80%",
      alignSelf: "flex-start",
    }}
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.2,
        }}
        style={{
          display: "block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#ddd",
        }}
      />
    ))}
  </Box>
);

const AiDesignAssistantModal = ({ open, handleClose, userId }) => {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hello, I'm Nirmaan,\nan AI assistant who is ready to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [fromMic, setFromMic] = useState(false);
  const [lastLang, setLastLang] = useState("en"); // <- store lang from backend

  const micControls = useAnimation();

  useEffect(() => {
    if (listening) {
      micControls.start({
        scale: [1, 1.3, 1],
        rotate: [0, 10, -10, 0],
        boxShadow: [
          "0 0 10px 2px rgba(255,0,0,0.6)",
          "0 0 20px 6px rgba(255,0,0,0.8)",
          "0 0 10px 2px rgba(255,0,0,0.6)",
        ],
        transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" },
      });
    } else {
      micControls.start({
        scale: 1,
        rotate: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        transition: { duration: 0.2 },
      });
    }
  }, [listening]);

  // refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // ---- Unlock Speech on iOS (must run once after first user tap) ----
  const initSpeech = () => {
    if (!window.speechSynthesis) return;
    const dummy = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(dummy);
  };

  // ---- Get Voices with Retry (handles iOS empty voices bug) ----
  const getVoices = () =>
    new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length) return resolve(voices);

      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    });

  // ---- Speak Function (Desktop + iOS safe) ----
  const speak = async (text, lang) => {
    if (!window.speechSynthesis) return;

    const isHindi = lang === "hi";
    const voices = await getVoices();

    const preferredVoices = isHindi
      ? ["Google हिन्दी", "com.apple.ttsbundle.sangeeta-compact"]
      : [
          "Google US English",
        "Siri Female (en-US)", "Siri Male (en-US)"
        ];

    let voice = voices.find((v) => preferredVoices.includes(v.name));
    if (!voice) {
      voice =
        voices.find((v) =>
          v.lang.toLowerCase().includes(isHindi ? "hi" : "en")
        ) || voices[0];
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = isHindi ? "hi-IN" : "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (overrideText) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMessage = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/assistant`, {
        userId,
        message: textToSend,
      });
      const botMessage = { sender: "assistant", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);

      setLastLang(res.data.lang);

      if (fromMic) {
        speak(res.data.reply, res.data.lang); 
        setFromMic(false);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Speech-to-Text (Mic Input)
  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    initSpeech();

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      setFromMic(true);
      sendMessage(spokenText);
    };

    recognition.start();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        component: motion.div,
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 300, opacity: 0 },
        transition: { duration: 0.25, ease: "easeOut" },
        sx: {
          width: 700,
          height: 600,
          maxWidth: "90vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg, rgba(25, 25, 25, 1), rgba(40, 40, 40, 1))",
          color: "#fff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          position: "fixed",
          right: 16,
          bottom: 40,
          m: 0,
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: "#333", fontWeight: "bold" }}>N</Avatar>
        </Stack>
        <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* CHAT BODY */}
      <Box
        sx={{
          flexGrow: 1,
          px: 2,
          pb: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
              gap: "8px",
            }}
          >
            {msg.sender === "assistant" && (
              <Avatar sx={{ bgcolor: "#333", fontSize: 14 }}>N</Avatar>
            )}
            <Box
              sx={{
                bgcolor: msg.sender === "user" ? "#FF7A5A" : "#444",
                color: msg.sender === "user" ? "#fff" : "#ddd",
                px: 2,
                py: 1.2,
                borderRadius: "16px",
                maxWidth: "70%",
                whiteSpace: "pre-line",
              }}
            >
              {msg.text}
            </Box>
            {msg.sender === "user" && (
              <Avatar sx={{ bgcolor: "#FF7A5A", fontSize: 14 }}>
                <PersonIcon sx={{ fontSize: 20, color: "#fff" }} />
              </Avatar>
            )}
          </motion.div>
        ))}
        {loading && <TypingLoader />}
        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          position: "relative",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          inputRef={inputRef}
          disabled={false}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              background: "#333",
              color: "#fff",
              "& fieldset": { border: "none" },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 100px #333 inset !important",
                WebkitTextFillColor: "#fff",
                caretColor: "#fff",
              },
            },
            "& input": {
              color: "white",
              backgroundColor: "#2c2c2c",
            },
          }}
        />

        {/* Mic Button */}
        <IconButton
          onClick={toggleListening}
          component={motion.button}
          animate={micControls}
          whileTap={{ scale: 1.2, rotate: 15 }}
          sx={{
            bgcolor: listening ? "red" : "#444",
            color: "#fff",
            width: 60,
            height: 60,
            borderRadius: "50%",
            "&:hover": {
              bgcolor: listening ? "darkred" : "#555",
              transform: "scale(1.1)",
              transition: "0.2s ease-in-out",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: listening ? "2px solid #ff4d4d" : "2px solid transparent",
          }}
        >
          <MicIcon sx={{ fontSize: 28, color: listening ? "#fff" : "#ddd" }} />
        </IconButton>

        {/* Send Button */}
        <IconButton
          onClick={() => sendMessage()}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          sx={{
            bgcolor: "#FF7A5A",
            color: "#fff",
            "&:hover": { bgcolor: "#ff6b4d" },
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Dialog>
  );
};

export default AiDesignAssistantModal;
