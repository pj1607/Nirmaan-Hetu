import { Box, Button, Typography, Modal } from "@mui/material";

export default function RoleSelectModal({ onSelect, onClose }) {
  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#1e1e1e",
          color: "#fff",
          borderRadius: "12px",
          p: 4,
          width: 300,
          textAlign: "center",
          boxShadow: 24
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select your role
        </Typography>
        <Button
          variant="contained"
          sx={{ mb: 1, bgcolor: "#ff6b4a", "&:hover": { bgcolor: "#ff5a36" } }}
          onClick={() => onSelect("owner")}
        >
          Owner
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#4a90e2", "&:hover": { bgcolor: "#3b7ec4" } }}
          onClick={() => onSelect("builder")}
        >
          Builder
        </Button>
      </Box>
    </Modal>
  );
}
