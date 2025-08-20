import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Rating,
  Divider,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { Email, Phone } from "@mui/icons-material";
import Sidebar from "../../../components/Sidebar";

const MotionCard = motion(Card);

const DashboardO = () => {
  const builders = [
    {
      name: "Ramesh Kumar",
      skills: ["Residential", "Interior Design", "2BHK"],
      rating: 4.5,
      avatar: "https://i.pravatar.cc/100?img=1",
      email: "ramesh@example.com",
      phone: "+91 98765 43210",
    },
    {
      name: "Sita Verma",
      skills: ["Commercial", "Renovation", "Luxury"],
      rating: 4.2,
      avatar: "https://i.pravatar.cc/100?img=2",
      email: "sita@example.com",
      phone: "+91 91234 56789",
    },
    {
      name: "Amit Sharma",
      skills: ["Villas", "Modern Design", "Eco Homes"],
      rating: 4.8,
      avatar: "https://i.pravatar.cc/100?img=3",
      email: "amit@example.com",
      phone: "+91 99887 66554",
    },
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
     <Sidebar role="owner" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Container maxWidth="xl">
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 3, color: "#FF7A5A" }}
          >
            Builders Directory
          </Typography>

          {/* Grid ensures equal-height cards */}
          <Grid container spacing={3} alignItems="stretch">
            {builders.map((builder, i) => (
              <Grid item xs={12} sm={6} md={4} key={i} sx={{ display: "flex" }}>
                <MotionCard
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                  sx={{
                    borderRadius: 3,
                    background: "#eed9d9ff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    p: 1,
                    flex: 1, // 🔥 ensures equal stretch
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    {/* Avatar + Name */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={builder.avatar}
                        alt={builder.name}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          sx={{ color: "#333" }}
                        >
                          {builder.name}
                        </Typography>
                        <Rating
                          value={builder.rating}
                          precision={0.1}
                          readOnly
                          size="small"
                        />
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Skills */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {builder.skills.map((skill, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            bgcolor: "#fafafa",
                            border: "1px solid #ddd",
                            px: 1.2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.8rem",
                            color: "#555",
                          }}
                        >
                          {skill}
                        </Box>
                      ))}
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Contact */}
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="primary"
                        href={`mailto:${builder.email}`}
                      >
                        <Email />
                      </IconButton>
                      <IconButton color="secondary" href={`tel:${builder.phone}`}>
                        <Phone />
                      </IconButton>
                    </Stack>

                    {/* Button always at bottom */}
                    <Button
                      fullWidth
                      size="small"
                      sx={{
                        mt: "auto", // pushes button down
                        bgcolor: "#FF7A5A",
                        color: "#fff",
                        "&:hover": { bgcolor: "#e7643f" },
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardO;
