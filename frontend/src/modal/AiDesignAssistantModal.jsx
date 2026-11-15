import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  TextField,
  IconButton,
  Box,
  Stack,
  Avatar,
  Slide,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import PersonIcon from "@mui/icons-material/Person";
import { useAnimation, motion } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

const AiDesignAssistantModal = ({ open, handleClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hello, I'm Nirmaan,\nan AI assistant who is ready to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

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
  }, [listening, micControls]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Unlock speech synthesis after a user interaction (needed by some browsers).
  const initSpeech = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  };

  const getVoices = () =>
    new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
        return;
      }

      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    });

  const speak = async (text, lang) => {
    if (!window.speechSynthesis) return;

    const isHindi = lang === "hi";
    const voices = await getVoices();
    const preferredVoices = isHindi
      ? ["Google हिन्दी", "com.apple.ttsbundle.sangeeta-compact"]
      : ["Google US English", "Siri Female (en-US)", "Siri Male (en-US)"];

    let voice = voices.find((item) => preferredVoices.includes(item.name));
    if (!voice) {
      voice =
        voices.find((item) =>
          item.lang.toLowerCase().includes(isHindi ? "hi" : "en")
        ) || voices[0];
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = isHindi ? "hi-IN" : "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (overrideText, shouldSpeak = false) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/ai/agent/query`, {
        question: textToSend,
        top_k: 4,
      }, { headers: getAuthHeaders() });

      const answer = res.data.answer || "I couldn't generate an answer.";
      const sources = Array.isArray(res.data.sources) ? res.data.sources : [];

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: answer, sources },
      ]);

      // The agent responds in the language of the question; use the matching
      // browser speech voice when the user submitted a Hindi-script question.
      const responseLang = /[\\u0900-\\u097F]/.test(textToSend) ? "hi" : "en";
      if (shouldSpeak) {
        speak(answer, responseLang);
      }
    } catch (err) {
      console.error("Agentic AI request failed:", err);
      const message =
        err.response?.data?.detail ||
        "I couldn't connect to the AI assistant. Please check that the AI service is running and try again.";
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: message },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handlePdfSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Please select a PDF file." },
      ]);
      return;
    }

    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "This PDF exceeds the 15 MB upload limit." },
      ]);
      return;
    }

    setSelectedFile(file);
  };

  const uploadPdf = async () => {
    if (!selectedFile || uploading) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    setUploading(true);

    try {
      const response = await axios.post(
        `${API_URL}/ai/documents/upload`,
        formData,
        { headers: getAuthHeaders() }
      );
      const filename = response.data.filename || selectedFile.name;
      const chunks = response.data.chunks_stored;
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: `PDF "${filename}" uploaded successfully${Number.isFinite(chunks) ? ` and ${chunks} text chunks were indexed` : ""}. You can now ask questions about this document.`,
        },
      ]);
      setSelectedFile(null);
    } catch (err) {
      console.error("PDF upload failed:", err);
      const message =
        err.response?.data?.detail ||
        "The PDF could not be uploaded. Please check the AI service and try again.";
      setMessages((prev) => [...prev, { sender: "assistant", text: message }]);
    } finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
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
      sendMessage(spokenText, true);
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
          <Box>
            <Box sx={{ fontWeight: 600 }}>Nirmaan AI</Box>
            <Box sx={{ color: "#aaa", fontSize: 12 }}>
              RAG-powered construction assistant
            </Box>
          </Box>
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
              {msg.sources?.length > 0 && (
                <Stack spacing={0.5} sx={{ mt: 1.2 }}>
                  {msg.sources.map((source, sourceIndex) => (
                    <Box
                      key={`${source.document_id || source.source}-${source.page}-${sourceIndex}`}
                      sx={{
                        color: "#ffbd9f",
                        fontSize: 11,
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                        pt: 0.5,
                      }}
                    >
                      Source: {source.source || "Uploaded document"} · Page{" "}
                      {source.page}
                    </Box>
                  ))}
                </Stack>
              )}
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
          flexDirection: "column",
          flexShrink: 0,
          position: "relative",
          gap: 1,
        }}
      >
        {selectedFile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: "#333",
            }}
          >
            <Box sx={{ color: "#ddd", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedFile.name}
            </Box>
            <Button
              size="small"
              variant="contained"
              onClick={uploadPdf}
              disabled={uploading}
              sx={{ bgcolor: "#FF7A5A", color: "#fff", flexShrink: 0, "&:hover": { bgcolor: "#ff6b4d" } }}
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </Box>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={handlePdfSelection}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || uploading}
            aria-label="Attach PDF"
            title="Upload a PDF"
            sx={{
              bgcolor: "#444",
              color: "#fff",
              "&:hover": { bgcolor: "#555" },
            }}
          >
            <AttachFileIcon />
          </IconButton>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Ask about construction or your uploaded documents..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={handleKeyPress}
          inputRef={inputRef}
          disabled={loading || uploading}
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
          disabled={loading || uploading}
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
          disabled={loading || uploading || !input.trim()}
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
      </Box>
    </Dialog>
  );
};

export default AiDesignAssistantModal;
