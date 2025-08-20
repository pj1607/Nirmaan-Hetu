import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Toolbar,
  Divider, useTheme, useMediaQuery
} from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../../../components/Sidebar";
import { Work, People } from "@mui/icons-material";
import PortfolioModal from "../../../modal/PortfolioModal";



const MotionCard = motion(Card);
const MotionBox = motion.create(Box);

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
      <svg
        viewBox="0 0 1440 360"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
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

            {/* Small back building with blue windows */}
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
  const [open, setOpen] = React.useState(false);
  
    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const stats = [
    { label: "Projects Completed", value: 12, icon: <Work />, color: "#FF7A5A" },
    { label: "Clients", value: 8, icon: <People />, color: "#6FCF97" },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", position: "relative" }}>
     <Sidebar role="builder" />


      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          position: "relative",
        
        }}
      >
        <DecorativeSVG />

        <Toolbar />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Container maxWidth="xl" sx={{ mt: 2 }}>
            {/* Top Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {stats.map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <MotionCard
                    custom={i}
                    variants={cardVariant}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.03 }}
                    sx={{
                      borderRadius: 3,
                      background: "#eed9d9ff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      height: "100%",
                      p: 1,
                    }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          bgcolor: stat.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff4f4ff",
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: "#090909ff", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#393736ff", fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>

            {/* Content */}
            <Grid container spacing={3} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
              {/* Incoming Requests */}
              <Grid item xs={12} sm={6}>
                <MotionCard
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.01 }}
                  sx={{
                    borderRadius: 3,
                    background: "#eed9d9ff",
                    border: "1px solid #eee",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "#FF7A5A",
                        fontWeight: "600",
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      Incoming Requests
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {[
                      { owner: "Ramesh", project: "2BHK Flat", budget: "₹25L" },
                      { owner: "Sita", project: "Renovation", budget: "₹8L" },
                    ].map((req, i) => (
                      <MotionBox
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#fafafa",
                          border: "1px solid #eee",
                        }}
                      >
                        <Typography fontWeight="bold" sx={{ color: "#333", fontSize: { xs: "0.95rem" } }}>
                          {req.owner}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555", fontSize: { xs: "0.8rem" } }}>
                          {req.project} – {req.budget}
                        </Typography>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1.5}
                          mt={1}
                          alignItems={{ xs: "stretch", sm: "center" }}
                        >
                          <Button
                            size="small"
                            fullWidth
                            variant="contained"
                            sx={{ bgcolor: "#FF7A5A", "&:hover": { bgcolor: "#e7643f" } }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{
                              borderColor: "#FF7A5A",
                              color: "#FF7A5A",
                              "&:hover": { borderColor: "#e7643f", color: "#e7643f" },
                            }}
                          >
                            Decline
                          </Button>
                        </Stack>
                      </MotionBox>
                    ))}
                    <Button
                      fullWidth
                      sx={{
                        mt: 2,
                        bgcolor: "#FF7A5A",
                        color: "#fff",
                        "&:hover": { bgcolor: "#e7643f" },
                      }}
                    >
                      View All Requests
                    </Button>
                  </CardContent>
                </MotionCard>
              </Grid>

              {/* Portfolio */}
              <Grid item xs={12} sm={6}>
                <MotionCard
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.01 }}
                  sx={{
                    borderRadius: 3,
                    background: "#eed9d9ff",
                    border: "1px solid #eee",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "#FF7A5A",
                        fontWeight: "600",
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      Portfolio
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack
                      direction="row"
                      spacing={2}
                      flexWrap="wrap"
                      justifyContent={{ xs: "center", sm: "flex-start" }}
                    >
                      {[1, 2, 3].map((i) => (
                        <MotionBox
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          sx={{
                            width: { xs: 70, sm: 100 },
                            height: { xs: 90, sm: 80 },
                            borderRadius: 2,
                            bgcolor: "#fafafa",
                            border: "1px solid #eee",
                          }}
                        />
                      ))}
                    </Stack>
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
          </Container>
        </motion.div>
      </Box>
        <PortfolioModal open={open} onClose={() => setOpen(false)}  />
    </Box>
  );
};

export default DashboardB;
