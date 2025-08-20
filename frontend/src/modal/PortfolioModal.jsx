import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Close, Delete } from "@mui/icons-material";

const MotionBox = motion(Box);


const Field = React.memo(function Field({
  label,
  name,
  type = "text",
  multiline = false,
  rows,
  value,
  onChange,
}) {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      fullWidth
      multiline={multiline}
      rows={rows}
      value={value}
      onChange={onChange}
      variant="outlined"
      size="medium"
    />
  );
});


const ImagePreviewGrid = React.memo(function ImagePreviewGrid({ urls, onRemove }) {
  if (!urls.length) return null;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {urls.map((url, i) => (
        <Box
          key={url}
          sx={{
            position: "relative",
            width: 72,
            height: 72,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <Box
            component="img"
            src={url}
            alt={`work-${i}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
            decoding="async"
          />
          <IconButton
            size="small"
            onClick={() => onRemove(i)}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
});

const PortfolioModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    experience: "",
    address: "",
    pastWork: "",
    description: "",
    images: [], // File[]
  });

  const objectUrlsRef = useRef([]); 


  const previewUrls = useMemo(() => {
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current = formData.images.map((f) => URL.createObjectURL(f));
    return objectUrlsRef.current;
  }, [formData.images]);

 
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    e.target.value = "";
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Portfolio Data:", formData);
    onClose?.();
  }, [formData, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 120,
            sx: { backgroundColor: "rgba(0,0,0,0.45)" },
          }}
          sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
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
              maxWidth: 640,
              mx: "auto",
              p: { xs: 2, sm: 3 },
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
                mb: 1,
                top: 0,
                zIndex: 1,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="black">
                Add Portfolio
              </Typography>
              <IconButton onClick={onClose} aria-label="Close">
                <Close />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Form */}
            <Stack spacing={2}>
              <Field label="Builder Name" name="name" value={formData.name} onChange={handleChange} />
              <Field label="Company Name" name="company" value={formData.company} onChange={handleChange} />
              <Field label="Years of Experience" name="experience" type="number" value={formData.experience} onChange={handleChange} />
              <Field label="Company Address" name="address" multiline rows={2} value={formData.address} onChange={handleChange} />
              <Field label="List of Past Work" name="pastWork" multiline rows={3} value={formData.pastWork} onChange={handleChange} />
              <Field label="Description / Skills" name="description" multiline rows={3} value={formData.description} onChange={handleChange} />

              {/* Upload Images */}
              <Button variant="outlined" component="label">
                Upload Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>

              {/* Preview with remove option */}
              <ImagePreviewGrid urls={previewUrls} onRemove={handleRemoveImage} />

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
