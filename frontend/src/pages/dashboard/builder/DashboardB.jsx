import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Toolbar,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../../../components/Sidebar";
import PortfolioModal from "../../../modal/PortfolioModal";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Decorative cityscape SVG background (dark mode friendly)
const DecorativeSVG = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
      opacity: 0.1,
    }}
  >
    <svg viewBox="0 0 1440 360" width="100%" height="100%" style={{ display: "block" }}>
      {/* Replace with your SVG code, optionally recolor for dark mode */}
    </svg>
  </Box>
);

const DashboardB = () => {
  const [open, setOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/builder/get-portfolio`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPortfolio(data.portfolio);
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const firstThreeImages = portfolio?.pastWorks?.[0]?.images?.slice(0, 3) || [];

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", position: "relative", bgcolor: "#121212", color: "#fff" }}>
      <Sidebar role="builder" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, position: "relative" }}>
        <DecorativeSVG />
        <Toolbar />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} sm={6}>
            <MotionCard
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
              sx={{
                maxWidth: 700,
                borderRadius: 3,
                bgcolor: "#1e1e1e",
                border: "1px solid #333",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                color: "#fff",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: "#FF7A5A",
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  Portfolio
                </Typography>
                <Divider sx={{ mb: 2, borderColor: "#555" }} />

                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
                    <CircularProgress color="inherit" />
                  </Box>
                ) : (
                  <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                  >
                    {firstThreeImages.length > 0
                      ? firstThreeImages.map((img, idx) => (
                          <MotionBox
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            sx={{
                              width: { xs: 70, sm: 100 },
                              height: { xs: 90, sm: 80 },
                              borderRadius: 2,
                              backgroundImage: `url(${img})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: "1px solid #555",
                            }}
                          />
                        ))
                      : [1, 2, 3].map((i) => (
                          <MotionBox
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            sx={{
                              width: { xs: 70, sm: 100 },
                              height: { xs: 90, sm: 80 },
                              borderRadius: 2,
                              bgcolor: "#2a2a2a",
                              border: "1px solid #555",
                            }}
                          />
                        ))}
                  </Stack>
                )}

                <Button
                  fullWidth
                  onClick={() => setOpen(true)}
                  sx={{
                    mt: 2,
                    bgcolor: "#FF7A5A",
                    color: "#fff",
                    "&:hover": { bgcolor: "#e7643f" },
                  }}
                >
                  Manage Portfolio
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        </motion.div>
      </Box>

      <PortfolioModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default DashboardB;
