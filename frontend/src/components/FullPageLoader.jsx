import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

const dotVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const FullPageLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#1e1e1e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#FF7A5A",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FullPageLoader;
