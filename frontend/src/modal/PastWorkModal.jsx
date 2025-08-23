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
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Close, Delete } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;
const MotionBox = motion(Box);

// Reusable Field component
const Field = React.memo(function Field({ label, name, type = "text", multiline = false, rows, value, onChange }) {
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

// Image preview grid
const ImagePreviewGrid = React.memo(function ImagePreviewGrid({ urls, onRemove }) {
  if (!urls.length) return null;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {urls.map((url, i) => (
        <Box
          key={url + i}
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
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
            decoding="async"
          />
          <IconButton
            size="small"
            onClick={() => onRemove(i)}
            sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
});

const PastWorkModal = ({ open, onClose, onAdd }) => {
  const [workData, setWorkData] = useState({ title: "", description: "", price: "", specialties: "", images: [] });
  const [loading, setLoading] = useState(false);
  const objectUrlsRef = useRef([]);

  // Generate preview URLs
  const previewUrls = useMemo(() => {
    // Clean up old object URLs
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current = workData.images
      .filter((img) => img instanceof File)
      .map((file) => URL.createObjectURL(file));
    // Combine uploaded URLs and local previews
    return workData.images.map((img) => (typeof img === "string" ? img : URL.createObjectURL(img)));
  }, [workData.images]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setWorkData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setWorkData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    e.target.value = "";
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setWorkData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!workData.title || !workData.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", workData.title);
      fd.append("description", workData.description);
      fd.append("price", workData.price || 0);
      fd.append("specialties", workData.specialties.split(",").map((s) => s.trim()).join(","));
      workData.images.forEach((file) => {
        // Only append File objects to FormData, skip already uploaded URLs
        if (file instanceof File) fd.append("images", file);
      });

      const res = await axios.post(`${API}/builder/add-pastwork`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Past work added successfully!");
        onAdd(res.data.pastWork);
        // Update local images array to include uploaded URLs
        setWorkData({ title: "", description: "", price: "", specialties: "", images: [] });
        onClose?.();
      } else {
        toast.error(res.data.error || "Failed to add past work");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [workData, onAdd, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 120, sx: { backgroundColor: "rgba(0,0,0,0.45)" } }}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <MotionBox
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            sx={{ bgcolor: "#eed9d9ff", borderRadius: 4, width: "100%", maxWidth: 500, mx: "auto", p: 3, maxHeight: "85vh", overflowY: "auto", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#FF7A5A">Add Past Work</Typography>
              <IconButton onClick={onClose}><Close /></IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Field label="Title" name="title" value={workData.title} onChange={handleChange} />
              <Field label="Description" name="description" multiline rows={3} value={workData.description} onChange={handleChange} />
              <Field label="Price" name="price" type="number" value={workData.price} onChange={handleChange} />
              <Field label="Specialties (comma separated)" name="specialties" value={workData.specialties} onChange={handleChange} />

              <Button variant="outlined" component="label">
                Upload Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>
              <ImagePreviewGrid urls={previewUrls} onRemove={handleRemoveImage} />

              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ bgcolor: "#FF7A5A", "&:hover": { bgcolor: "#e7643f" } }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Add Past Work"}
              </Button>
            </Stack>
          </MotionBox>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PastWorkModal;
