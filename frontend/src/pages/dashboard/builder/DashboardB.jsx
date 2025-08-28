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
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../../../components/Sidebar";
import PortfolioModal from "../../../modal/PortfolioModal";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Decorative cityscape SVG background
const DecorativeSVG = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        opacity: 0.2,
      }}
    >
      <svg viewBox="0 0 1600 360" width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <style>{`
            .stroke { stroke: #5b5b5b; stroke-width: 2.1; stroke-linejoin: round; stroke-linecap: round; }
            .fillNone { fill: none; }
            .fillWhite { fill: #ffffff; }
            .winFill { fill: #8ED3FF; opacity: .75; }
          `}</style>
          <linearGradient id="fadeGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="35%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g mask="url(#fadeMask)">
          <line className="stroke" x1="0" y1="320" x2="1440" y2="320" />
          <line className="stroke" x1="0" y1="338" x2="1440" y2="338" />
          <g transform="translate(80,0)">
            {/* Left short building */}
            <g transform="translate(0,80)">
              <rect className="fillWhite stroke" x="0" y="60" width="120" height="200" />
              {[20, 50, 80, 110].map((y, i) => (
                <g key={i}>
                  <rect className="winFill stroke" x="24" y={y + 70} width="22" height="22" />
                  <rect className="winFill stroke" x="74" y={y + 70} width="22" height="22" />
                </g>
              ))}
              <line className="stroke" x1="0" y1="60" x2="120" y2="60" />
            </g>
            {/* Tall center-left tower */}
            <g transform="translate(160,10)">
              <rect className="fillWhite stroke" x="0" y="10" width="160" height="300" />
              {[40, 90, 140, 190, 240].map((y, r) =>
                [20, 80, 120].map((x, c) => (
                  <g key={`${r}-${c}`}>
                    <rect className="fillNone stroke" x={x} y={y} width="30" height="30" />
                    <line className="stroke" x1={x + 6} y1={y + 8} x2={x + 14} y2={y + 16} />
                  </g>
                ))
              )}
              <rect className="fillNone stroke" x="60" y="260" width="40" height="50" />
            </g>
            {/* Mid building with roof slab */}
            <g transform="translate(360,70)">
              <rect className="fillWhite stroke" x="0" y="40" width="220" height="22" />
              <rect className="fillWhite stroke" x="12" y="60" width="196" height="240" />
              <g transform="translate(40,90)">
                <rect className="fillNone stroke" x="0" y="0" width="60" height="60" />
                <line className="stroke" x1="30" y1="0" x2="30" y2="60" />
                <line className="stroke" x1="0" y1="30" x2="60" y2="30" />
              </g>
              <g transform="translate(130,90)">
                <rect className="fillNone stroke" x="0" y="0" width="60" height="60" />
                <line className="stroke" x1="30" y1="0" x2="30" y2="60" />
                <line className="stroke" x1="0" y1="30" x2="60" y2="30" />
              </g>
              <rect className="fillNone stroke" x="90" y="220" width="40" height="60" />
            </g>
            {/* Small back building */}
            <g transform="translate(310,20)">
              <rect className="fillNone stroke" x="0" y="60" width="90" height="110" />
              {[0, 24, 48, 72].map((x, i) => (
                <rect key={i} className="winFill stroke" x={8 + x} y="72" width="14" height="14" />
              ))}
              {[0, 24, 48, 72].map((x, i) => (
                <rect key={`b-${i}`} className="winFill stroke" x={8 + x} y="96" width="14" height="14" />
              ))}
            </g>
            {/* Right buildings */}
            <g transform="translate(610,0)">
              <rect className="fillNone stroke" x="0" y="60" width="100" height="220" />
              {[20, 70, 120, 170].map((y, r) => (
                <rect key={r} className="fillNone stroke" x="32" y={y} width="36" height="36" />
              ))}
            </g>
            <g transform="translate(740,30)">
              <rect className="fillNone stroke" x="0" y="30" width="80" height="250" />
              {[60, 120, 180].map((y, r) => (
                <rect key={r} className="fillNone stroke" x="26" y={y} width="28" height="28" />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </Box>
  </Box>
);

const DashboardB = () => {
  const [open, setOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  // Fetch portfolio once on mount
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
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  return (
    <Box sx={{ display: "flex", minHeight: "90vh", position: "relative"}}>
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
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <MotionCard
                variants={cardVariant}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                sx={{
                  borderRadius: 3,
                  background: "#1e1e1e",
                  border: "1px solid #333",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                  overflow: "hidden",
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
                  <Divider sx={{ mb: 2, borderColor: "#444" }} />

                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
                      <CircularProgress color="#fff" />
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
                                border: "1px solid #333",
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
                                border: "1px solid #333",
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
          </Grid>
        </motion.div>
      </Box>

      <PortfolioModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default DashboardB;
