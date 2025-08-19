import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Divider,
  Backdrop,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";

const MotionBox = motion.create(Box);

const PortfolioModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    experience: "",
    address: "",
    pastWork: "",
    description: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleSubmit = () => {
    console.log("Portfolio Data:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 200,
            sx: {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.4)",
            },
          }}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <MotionBox
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            sx={{
              bgcolor: "#eed9d9ff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: "100%",
              maxWidth: 600,
              mx: "auto",
              p: 3,
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="600" color="black">
                Add Portfolio
              </Typography>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Form */}
            <Stack spacing={2}>
              <TextField
                label="Builder Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                label="Company Name"
                name="company"
                fullWidth
                value={formData.company}
                onChange={handleChange}
              />
              <TextField
                label="Years of Experience"
                name="experience"
                type="number"
                fullWidth
                value={formData.experience}
                onChange={handleChange}
              />
              <TextField
                label="Company Address"
                name="address"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
              <TextField
                label="List of Past Work"
                name="pastWork"
                fullWidth
                multiline
                rows={3}
                value={formData.pastWork}
                onChange={handleChange}
              />
              <TextField
                label="Description / Skills"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />

              {/* Upload Images */}
              <Button variant="outlined" component="label">
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {/* Preview */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.images.map((img, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={URL.createObjectURL(img)}
                    alt="work"
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "1px solid #eee",
                    }}
                  />
                ))}
              </Stack>

              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ bgcolor: "#FF7A5A", "&:hover": { bgcolor: "#e7643f" } }}
              >
                Save Portfolio
              </Button>
            </Stack>
          </MotionBox>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PortfolioModal;
