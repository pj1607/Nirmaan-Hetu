import React, { useState, useRef, useEffect } from "react";
import {
  Dashboard,
  Work,
  Folder,
  Person,
  Settings,
  People,
  Payments,
  Assignment,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Modal, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import PortfolioModal from "../modal/PortfolioModal";

const Sidebar = ({ role = "builder" }) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const sidebarRef = useRef(null);

  const ownerMenu = [
    { text: "Settings", icon: <Settings />, route: "settings", modal: true },
  ];

  const builderMenu = [
    { text: "Portfolio", icon: <Folder />, route: "portfolio", modal: true },
    { text: "Profile", icon: <Person />, route: "profile", modal: true },
  ];

  const menuItems = role === "owner" ? ownerMenu : builderMenu;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  const handleClick = (item) => {
    if (item.route === "portfolio") {
      setModalOpen(true);
    }
    setOpen(false);
  };

  return (
    <>
      <Box
        ref={sidebarRef}
        sx={{
          position: "fixed",
          bottom: { xs: 15, sm: 25, md: 30 },
          left: { xs: 10, sm: 15, md: 20 },
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 0.8, md: 1 },
          zIndex: 2000,
          flexWrap: "wrap",
        }}
      >
        {/* Toggle button */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              width: { xs: 45, sm: 55, md: 60 },
              height: { xs: 45, sm: 55, md: 60 },
              borderRadius: "50%",
              background: "#FF7A5A",
              color: "#fff",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              "&:hover": { background: "#e0674c" },
            }}
          >
            ☰
          </IconButton>
        </motion.div>

        {/* Expanding Menu */}
        <AnimatePresence>
          {open &&
            menuItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.6, opacity: 0, x: -15 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.6, opacity: 0, x: -15 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                  delay: i * 0.02,
                }}
              >
                <Tooltip title={item.text} placement="top">
                  <IconButton
                    onClick={() => handleClick(item)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "#1b1b1b",
                      color: "#FF7A5A",
                      transition: "all 0.3s ease",
                      "&:hover": { background: "#2a1f1f" },
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              </motion.div>
            ))}
        </AnimatePresence>
      </Box>

      {/* Portfolio Modal */}
      <PortfolioModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Sidebar;
