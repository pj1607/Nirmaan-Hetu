import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Email } from "@mui/icons-material";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import ViewBuilderModal from "../../../modal/ViewBuilderModal";

const MotionCard = motion(Card);
const API = import.meta.env.VITE_API_URL;

const DashboardO = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await axios.get(`${API}/builder/all-portfolios`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPortfolios(res.data.portfolios);
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
      }
    };
    fetchPortfolios();
  }, []);

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
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "#FF7A5A" }}>
            Builders Directory
          </Typography>

          <Grid container spacing={3} alignItems="stretch">
            {portfolios.map((portfolio, i) => (
              <Grid item xs={12} sm={6} md={4} key={portfolio._id} sx={{ display: "flex" }}>
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
                    p: 2,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar
                      src={portfolio.logo?.url || `https://i.pravatar.cc/100?u=${portfolio._id}`}
                      alt={portfolio.company}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ color: "#333" }}>
                        {portfolio.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {portfolio.createdBy?.username} {/* Builder Name */}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {portfolio.experience} yrs experience
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                    {portfolio.pastWorks?.map((work, idx) => (
                      <Button
                        key={idx}
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          mb: 0.5,
                          borderColor: "#ddd",
                          color: "#555",
                          "&:hover": { borderColor: "#FF7A5A" },
                        }}
                      >
                        {work.title}
                      </Button>
                    ))}
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
                    <Box>
                      <Typography variant="body2">{portfolio.createdBy?.email}</Typography>
                    </Box>
                  <IconButton
  color="primary"
  component="a"
  href={`https://mail.google.com/mail/?view=cm&to=${portfolio.createdBy?.email}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <Email sx={{ color: "#FF7A5A" }} />
</IconButton>

                  </Stack>

                  <Button
                    fullWidth
                    size="small"
                    sx={{ mt: 1, bgcolor: "#FF7A5A", color: "#fff", "&:hover": { bgcolor: "#e7643f" } }}
                    onClick={() => handleOpen(portfolio)}
                  >
                    View More
                  </Button>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          {selectedPortfolio && (
            <ViewBuilderModal
              open={open}
              handleClose={handleClose}
              portfolio={selectedPortfolio}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardO;
