// PortfolioModal.jsx
import React, { useCallback, useState, useEffect } from "react";
import {
  Modal, Box, Typography, Button, Stack, IconButton, Divider,
  Backdrop, TextField, CircularProgress, Avatar
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Close, Delete, Upload } from "@mui/icons-material";
import PastWorkModal from "./PastWorkModal";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;
const MotionBox = motion(Box);

// Centralized Field component with consistent styling
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
      InputProps={{ style: { color: "#fff" } }}
      InputLabelProps={{ style: { color: "#ccc" } }}
      sx={{
        bgcolor: "#2c2c2c",
        borderRadius: 1.5,
        
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF7A5A" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF7A5A" },
        "& input": { color: "white" },
        "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px #2c2c2c inset",
          WebkitTextFillColor: "white",
          caretColor: "white",
        },
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": { borderColor: "#FF7A5A" },
        }
      }}
    />
  );
});

const PortfolioModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    company: "", experience: "", address: "", description: "", pastWorks: [], logo: null
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pastWorkModalOpen, setPastWorkModalOpen] = useState(false);
  const [portfolioExists, setPortfolioExists] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/builder/get-portfolio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success && res.data.portfolio) {
        setFormData({
          company: res.data.portfolio.company || "",
          experience: res.data.portfolio.experience || "",
          address: res.data.portfolio.address || "",
          description: res.data.portfolio.description || "",
          pastWorks: res.data.portfolio.pastWorks || [],
          logo: res.data.portfolio.logo || null,
        });
        setLogoPreview(res.data.portfolio.logo?.url || null);
        setPortfolioExists(true);
      } else {
        setFormData({ company: "", experience: "", address: "", description: "", pastWorks: [], logo: null });
        setLogoPreview(null);
        setPortfolioExists(false);
      }
    } catch (err) {
      console.error("Fetch portfolio failed:", err);
      toast.error("Failed to fetch portfolio");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (open) fetchPortfolio(); }, [open, fetchPortfolio]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddPastWork = useCallback((work) => {
    setFormData((prev) => ({ ...prev, pastWorks: [...prev.pastWorks, work] }));
  }, []);

  const handleDeletePastWork = useCallback(async () => {
    if (!selectedWorkId) return;
    try {
      setLoading(true);
      const res = await axios.delete(`${API}/builder/delete-pastwork/${selectedWorkId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        toast.success("Past work deleted!");
        setFormData((prev) => ({
          ...prev,
          pastWorks: prev.pastWorks.filter((w) => w._id !== selectedWorkId),
        }));
      } else {
        toast.error(res.data.error || "Failed to delete past work");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); setConfirmOpen(false); setSelectedWorkId(null); }
  }, [selectedWorkId]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDeleteLogo = async () => {
    try {
      setLoading(true);
      if (formData.logo && !logoFile) {
        const res = await axios.delete(`${API}/builder/delete-logo`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.data.success) {
          toast.success("Logo deleted");
          setFormData((prev) => ({ ...prev, logo: null }));
          setLogoPreview(null);
        } else {
          toast.error(res.data.error || "Failed to delete logo");
        }
      } else {
        setLogoFile(null);
        setLogoPreview(formData.logo?.url || null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("company", formData.company);
      data.append("experience", formData.experience);
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("pastWorks", JSON.stringify(formData.pastWorks));
      if (logoFile) data.append("logo", logoFile);

      if (portfolioExists) {
        await axios.put(`${API}/builder/update-portfolio`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Portfolio updated!");
      } else {
        await axios.post(`${API}/builder/add-portfolio`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Portfolio added!");
      }
      setTimeout(() => onClose?.(), 300);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose} closeAfterTransition
          BackdropComponent={Backdrop} BackdropProps={{ timeout: 120, sx: { backgroundColor: "rgba(0,0,0,0.45)" } }}
          sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <MotionBox
            component="form" onSubmit={handleSubmit}
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            sx={{
              bgcolor: "#1e1e1e",
              color: "#fff",
              borderTopLeftRadius: 16, borderTopRightRadius: 16,
              width: "100%", maxWidth: 640, mx: "auto", p: { xs: 2, sm: 3 },
              maxHeight: "90vh", overflowY: "auto", position: "relative",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#FF7A5A">
                {portfolioExists ? "Edit Portfolio" : "Add Portfolio"}
              </Typography>
              <IconButton onClick={onClose} aria-label="Close" sx={{ color: "#fff" }}><Close /></IconButton>
            </Box>
            <Divider sx={{ mb: 2, borderColor: "#555" }} />

            <Stack spacing={2}>
              {/* Logo Upload */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {logoPreview ? (
                  <>
                    <Avatar src={logoPreview} alt="Logo" sx={{ width: 64, height: 64, border: "2px solid #555" }} />
                    <IconButton onClick={handleDeleteLogo} aria-label="Delete Logo" sx={{ color: "#fff" }}>
                      <Delete />
                    </IconButton>
                  </>
                ) : (
                  <Button component="label" variant="outlined" startIcon={<Upload />} sx={{ color: "#FF7A5A", borderColor: "#FF7A5A" }}>
                    Upload Logo
                    <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                  </Button>
                )}
              </Box>

              {/* All fields with same styling */}
              <Field label="Company Name" name="company" value={formData.company} onChange={handleChange} />
              <Field label="Years of Experience" name="experience" type="number" value={formData.experience} onChange={handleChange} />
              <Field label="Company Address" name="address" multiline rows={2} value={formData.address} onChange={handleChange} />
              <Field label="Description / Skills" name="description" multiline rows={3} value={formData.description} onChange={handleChange} />

              <Button variant="outlined" onClick={() => setPastWorkModalOpen(true)} sx={{ color: "#FF7A5A", borderColor: "#FF7A5A" }}>Add Past Work</Button>

              {/* Past Works List */}
              <Stack spacing={1} mt={1}>
                {formData.pastWorks.map((work) => (
                  <Box key={work._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: "#2a2a2a", borderRadius: 1, border: "1px solid #555" }}>
                    <Typography variant="body2" color="#FF7A5A">{work.title}</Typography>
                    <IconButton size="small" onClick={() => { setSelectedWorkId(work._id); setConfirmOpen(true); }} sx={{ color: "#fff" }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              <Button type="submit" variant="contained" disabled={loading}
                sx={{ bgcolor: "#FF7A5A", "&:hover": { bgcolor: "#e7643f" }, display: "flex", alignItems: "center", gap: 1 }}
              >
                {loading && <CircularProgress size={20} color="inherit" />}
                {portfolioExists ? "Update Portfolio" : "Save Portfolio"}
              </Button>
            </Stack>

            <PastWorkModal open={pastWorkModalOpen} onClose={() => setPastWorkModalOpen(false)} onAdd={handleAddPastWork} />
            <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDeletePastWork} message="Are you sure you want to delete this past work?" />
          </MotionBox>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PortfolioModal;
