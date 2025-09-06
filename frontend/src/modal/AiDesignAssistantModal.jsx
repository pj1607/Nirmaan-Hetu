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
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";
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

  // refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/assistant`, {
        userId,
        message: input,
      });
      const botMessage = { sender: "assistant", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus(); // keep focus after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
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
        justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
        gap: "8px",
      }}
    >
      {/* Show avatar on left for assistant */}
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

      {/* Show avatar on right for user */}
      {msg.sender === "user" && (
        <Avatar sx={{ bgcolor: "#FF7A5A", fontSize: 14 }}> <PersonIcon sx={{ fontSize: 20, color: "#fff" }} /></Avatar>
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
        <IconButton
          onClick={sendMessage}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          sx={{
            position: "absolute",
            right: 24,
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
