import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Stack, Avatar, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const PastWorkViewModal = ({ open, handleClose, work, portfolio }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Reset selected image when modal opens
  useEffect(() => {
    if (open) setSelectedImage(null);
  }, [open, work]);

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.5)" } }}
          sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <MotionBox
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            sx={{
              bgcolor: "#eed9d9ff",
              color: "#333",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: { xs: "95%", sm: 600, md: 700 },
              maxHeight: "90vh",
              overflowY: "auto",
              p: 3,
              boxShadow: 24,
            }}
          >
            {/* Header: Logo + Company */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar
                src={portfolio.logo?.url || `https://i.pravatar.cc/100?u=${portfolio._id}`}
                alt={portfolio.company}
                sx={{ width: 64, height: 64 }}
              />
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: "#FF7A5A" }}>
                  {portfolio.company}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {portfolio.createdBy?.username}
                </Typography>
              </Box>
            </Stack>

            {/* Work Details */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              {work.title}
            </Typography>
            {work.description && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {work.description}
              </Typography>
            )}
            {work.price && (
              <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                Price: ₹{work.price}
              </Typography>
            )}

            {/* Images */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              {work.images?.map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={img}
                  alt={work.title}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 2,
                    cursor: "pointer",
                    border: selectedImage === img ? "2px solid #FF7A5A" : "1px solid #ddd",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </Stack>

            {/* Large image preview */}
            {selectedImage && (
              <Box
                component="img"
                src={selectedImage}
                alt={work.title}
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "contain",
                  mb: 2,
                  borderRadius: 2,
                }}
              />
            )}

            <Button
              fullWidth
              sx={{ mt: 1, bgcolor: "#FF7A5A", color: "white", "&:hover": { bgcolor: "#e7643f" } }}
              onClick={handleClose}
            >
              Close
            </Button>
          </MotionBox>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PastWorkViewModal;
