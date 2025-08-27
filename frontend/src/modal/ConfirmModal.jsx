// ConfirmModal.jsx
import React from "react";
import { Modal, Box, Typography, Button, Stack, Backdrop } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const ConfirmModal = ({ open, onClose, onConfirm, message = "Are you sure?" }) => {
  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.45)" } }}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <MotionBox
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            sx={{
              bgcolor: "#1e1e1e",
              borderRadius: 4,
              width: "100%",
              maxWidth: 420,
              p: 4,
              textAlign: "center",
              boxShadow: "0 -4px 25px rgba(0,0,0,0.5)",
              color: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2} color="#FF7A5A">
              Confirm Action
            </Typography>
            <Typography variant="body2" mb={4} color="#ccc">
              {message}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                  color: "#ccc",
                  borderColor: "#555",
                  "&:hover": { borderColor: "#FF7A5A", bgcolor: "rgba(255,122,90,0.1)" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={onConfirm}
                sx={{
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                  bgcolor: "#FF7A5A",
                  "&:hover": { bgcolor: "#e7643f" },
                }}
              >
                Confirm
              </Button>
            </Stack>
          </MotionBox>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
