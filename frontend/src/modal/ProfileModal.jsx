import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Close } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const MotionBox = motion(Box);

const ProfileModal = ({ open, handleClose }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (open) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API}/auth/get-profile`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setUserName(data.username || "");
          setEmail(data.email || "");
        } catch (err) {
          console.error("Failed to fetch profile", err);
          toast.error("Failed to fetch profile");
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [open]);

  useEffect(() => { if (isNameEditable && usernameRef.current) usernameRef.current.focus(); }, [isNameEditable]);
  useEffect(() => { if (isEmailEditable && emailRef.current) emailRef.current.focus(); }, [isEmailEditable]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${API}/auth/update-profile`,
        { username: userName, email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Profile updated successfully!");
      setIsNameEditable(false);
      setIsEmailEditable(false);
      handleClose();
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <MotionBox
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            sx={{
              bgcolor: "#1e1e1e",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: "95%",
              maxWidth: 450,
              p: 4,
              boxShadow: "0 -6px 30px rgba(0,0,0,0.25)",
              textAlign: "center",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <IconButton
              onClick={handleClose}
              aria-label="Close"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                color: "#fff",
              }}
            >
              <Close />
            </IconButton>

            <Stack spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: "#343333" }}>
                {userName[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight={600} sx={{ color: "#FF7A5A" }}>
                Profile Settings
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", px: 2 }}>
                Your current profile information
              </Typography>
            </Stack>

            <TextField
              fullWidth
              label="Name"
              value={userName}
              inputRef={usernameRef}
              onChange={(e) => setUserName(e.target.value)}
              InputProps={{
                readOnly: !isNameEditable,
                style: { color: "#fff", cursor: isNameEditable ? "text" : "default" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setIsNameEditable(!isNameEditable)} sx={{ color: "#FF7A5A" }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                mb: 2,
                bgcolor: "#2a2a2a",
                borderRadius: 1.5,
                 "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#444" },
      "&:hover fieldset": { borderColor: "#FF7A5A" },
      "&.Mui-focused fieldset": { borderColor: "#FF7A5A" }, 
    },

                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF7A5A" },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              value={email}
              inputRef={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                readOnly: !isEmailEditable,
                style: { color: "#fff", cursor: isEmailEditable ? "text" : "default" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setIsEmailEditable(!isEmailEditable)} sx={{ color: "#FF7A5A" }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                mb: 3,
                bgcolor: "#2a2a2a",
                borderRadius: 1.5,
                "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#444" },
      "&:hover fieldset": { borderColor: "#FF7A5A" },
      "&.Mui-focused fieldset": { borderColor: "#FF7A5A" },
    },

                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF7A5A" },
                
              }}
            />

            <Button
              fullWidth
              onClick={handleSave}
              disabled={loading}
              sx={{
                mb: 1,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#FF7A5A",
                color: "#fff",
                "&:hover": { bgcolor: "#e7643f" },
              }}
            >
              {loading ? <CircularProgress size={26} sx={{ color: "#fff" }} /> : "Save Changes"}
            </Button>
          </MotionBox>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
