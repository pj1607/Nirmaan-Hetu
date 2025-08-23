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
          sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <MotionBox
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            sx={{
              bgcolor: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: "100%",
              maxWidth: 420,
              p: 4,
              textAlign: "center",
              boxShadow: "0 -4px 25px rgba(0,0,0,0.25)",
              border: "1px solid #f0f0f0",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2} color="#333">
              Confirm Action
            </Typography>
            <Typography variant="body2" mb={4} color="#555">
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
                  color: "#555",
                  borderColor: "#ddd",
                  "&:hover": { borderColor: "#bbb", bgcolor: "#f5f5f5" },
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
