import React, { useState } from "react";
import { Modal, Box, Typography, Stack, Avatar, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Email } from "@mui/icons-material";
import PastWorkViewModal from "./PastWorkViewModal";

const MotionBox = motion(Box);

const ViewBuilderModal = ({ open, handleClose, portfolio }) => {
  const [selectedWork, setSelectedWork] = useState(null);
  const [pastWorkModalOpen, setPastWorkModalOpen] = useState(false);

  const handleOpenPastWork = (work) => {
    setSelectedWork(work);
    setPastWorkModalOpen(true);
  };

  const handleClosePastWork = () => setPastWorkModalOpen(false);

  return (
    <>
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
                bgcolor: "#1e1e1e", // dark background
                color: "#fff",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                width: { xs: "95%", sm: "80%", md: "60%" },
                p: 3,
                boxShadow: "0 -6px 30px rgba(0,0,0,0.25)",
                overflowY: "auto",
                maxHeight: "90vh",
              }}
            >
              {/* Header: Logo + Company */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar
                  src={portfolio.logo?.url || undefined}
                  alt={portfolio.company}
                  sx={{ width: 56, height: 56, bgcolor: "#343333", color: "#fff", fontWeight: 600 }}
                >
                  {!portfolio.logo?.url && portfolio.company?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ color: "#FF7A5A" }}>
                    {portfolio.company}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    {portfolio.createdBy?.username}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    {portfolio.experience} yrs experience
                  </Typography>
                </Box>
              </Stack>

              {/* Description */}
              <Typography variant="body2" sx={{ mb: 2, color: "#ccc" }}>
                {portfolio.description || "No description provided."}
              </Typography>

              {/* Past Works */}
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {portfolio.pastWorks?.map((work, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      mb: 0.5,
                      borderColor: "#FF7A5A",
                      color: "#FF7A5A",
                      "&:hover": { bgcolor: "#FF7A5A", color: "#fff" },
                    }}
                    onClick={() => handleOpenPastWork(work)}
                  >
                    {work.title}
                  </Button>
                ))}
              </Stack>

              {/* Footer: Email */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: "#ccc" }}>
                  {portfolio.createdBy?.email}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#FF7A5A", "&:hover": { bgcolor: "#e7643f" } }}
                  startIcon={<Email />}
                  component="a"
                  href={`https://mail.google.com/mail/?view=cm&to=${portfolio.createdBy?.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email
                </Button>
              </Stack>
            </MotionBox>
          </Modal>
        )}
      </AnimatePresence>

      {/* Past Work Modal */}
      {selectedWork && (
        <PastWorkViewModal
          open={pastWorkModalOpen}
          handleClose={handleClosePastWork}
          work={selectedWork}
          portfolio={portfolio}
        />
      )}
    </>
  );
};

export default ViewBuilderModal;
