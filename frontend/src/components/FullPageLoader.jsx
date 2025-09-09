import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

// Brick animation (drop effect)
const brickVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "rgba(30, 30, 30, 1)",
        zIndex: 2000,
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "200px" }}>
        {/* Road strip */}
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            left: 0,
            width: "100%",
            height: "6px",
            bgcolor: "#333",
          }}
        />

       
        {/* Bricks dropping */}
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            left: "25%",
            display: "flex",
            gap: 1,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={brickVariants}
              style={{
                width: "6vw",
                minWidth: "30px",
                maxWidth: "50px",
                height: "3vw",
                minHeight: "18px",
                maxHeight: "25px",
                backgroundColor: "#ff5555ff",
                borderRadius: "3px",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FullPageLoader;
