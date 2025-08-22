import React from "react";
import { Box } from "@mui/material";
import pjLogo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: "center",
        fontSize: { xs: "7px", sm: "10px" },
        backgroundColor: isLoggedIn ? "transparent" : "#1f1f1f",
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <img
          src={pjLogo}
          alt="PJ Logo"
          width="18"
          height="18"
          style={{ borderRadius: "10px" }}
        />
      </Box>
    </Box>
  );
};

export default Footer;
