import React, { useState, useEffect, useRef } from "react";
import { Tooltip,Box, Typography, Stack, Avatar, Button, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import { Email, LocationOn, NearMe } from "@mui/icons-material";
import axios from "axios";
import { motion } from "framer-motion";
import PastWorkViewModal from "../modal/PastWorkViewModal";
import BuilderMap from "../components/BuilderMap";
import FullPageLoader from "../components/FullPageLoader"

const API = import.meta.env.VITE_API_URL;

const ViewBuilderPage = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [pastWorkModalOpen, setPastWorkModalOpen] = useState(false);
  const mapRef = useRef(null);

  const handleOpenPastWork = (work) => {
    setSelectedWork(work);
    setPastWorkModalOpen(true);
  };
  const handleClosePastWork = () => setPastWorkModalOpen(false);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getDirections = () => {
    if (portfolio?.location?.coordinates) {
      const [lng, lat] = portfolio.location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/builder/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPortfolio(res.data.portfolio);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  return (
     <>
      {loading && <FullPageLoader />} 
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        color: "#fff",
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
        overflow: "hidden",
      }}
    >
     {/* Background SVG Shapes with Decorative Elements */}
<motion.svg
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.15 }}
  style={{
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "200px",
    height: "200px",
    zIndex: 0,
  }}
  viewBox="0 0 200 200"
>
  {/* Filled Circle Background */}
  <circle cx="100" cy="100" r="100" fill="#FF7A5A" />

  {/* Decorative Line Shapes */}
  <circle
    cx="100"
    cy="100"
    r="70"
    stroke="#fff"
    strokeWidth="4"
    fill="none"
  />
  <rect
    x="40"
    y="40"
    width="120"
    height="120"
    stroke="#fff"
    strokeWidth="4"
    fill="none"
    rx="20"
  />
</motion.svg>

<motion.svg
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.12 }}
  style={{
    position: "absolute",
    bottom: "-80px",
    left: "-80px",
    width: "250px",
    height: "250px",
    zIndex: 0,
  }}
  viewBox="0 0 250 250"
>
  {/* Filled Rounded Rectangle Background */}
  <rect x="0" y="0" width="250" height="250" fill="#FFB56A" rx="125" />

  {/* Decorative Line Shapes */}
  <polygon
    points="125,20 230,230 20,230"
    stroke="#fff"
    strokeWidth="4"
    fill="none"
  />
  <circle
    cx="125"
    cy="125"
    r="90"
    stroke="#FF7A5A"
    strokeWidth="3"
    fill="none"
  />
</motion.svg>


      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ position: "relative", zIndex: 1,mt:7 }}>
        {loading ? (
          <Skeleton variant="circular" width={80} height={80} />
        ) : (
          <Avatar
            src={portfolio.logo?.url || undefined}
            alt={portfolio.company}
            sx={{ width: 80, height: 80, bgcolor: "#343333", fontWeight: 700, fontSize: 28 }}
          >
            {!portfolio.logo?.url && portfolio.company?.charAt(0)?.toUpperCase()}
          </Avatar>
        )}

        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: "#FF7A5A" }}>
            {loading ? <Skeleton width={180} /> : portfolio.company}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#ccc", mt: 0.5 }}>
            {loading ? <Skeleton width={120} /> : `${portfolio.createdBy?.username} • ${portfolio.experience} yrs`}
          </Typography>

          {loading ? (
            <Skeleton width={200} height={20} sx={{ mt: 1 }} />
          ) : (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <LocationOn sx={{ color: "#FF7A5A", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                {portfolio.address}
              </Typography>
            <Tooltip title="Get Directions" arrow placement="top">
  <Button
    variant="contained"
    sx={{
      minWidth: 40,
      height: 35,
      borderRadius: "16px",
      bgcolor: "rgba(255, 122, 90, 0.85)",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      "&:hover": { bgcolor: "rgba(211, 90, 56, 0.95)" },
    }}
    onClick={getDirections}
  >
    <NearMe sx={{ fontSize: 22 }} />
  </Button>
</Tooltip>
            </Stack>
          )}
        </Box>
      </Stack>

      {/* Description */}
      <Box sx={{ mt: 3, position: "relative", zIndex: 1 }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
          </>
        ) : (
          <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Typography variant="body2" sx={{ color: "#ddd", lineHeight: 1.6 }}>
              {portfolio.description || "No description provided."}
            </Typography>
          </motion.div>
        )}
      </Box>

      {/* Map */}
      <Box ref={mapRef} sx={{ mt: 4, position: "relative", zIndex: 1 }}>
        <Typography variant="h6" sx={{ color: "#FF7A5A", mb: 1.5 }}>
          Builder Location
        </Typography>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
        ) : portfolio?.location ? (
          <BuilderMap location={portfolio.location} company={portfolio.company} />
        ) : (
          <Typography sx={{ color: "#ccc" }}>Location not available.</Typography>
        )}
      </Box>

      {/* Past Works */}
      <Box sx={{ mt: 4, position: "relative", zIndex: 1 }}>
        <Typography variant="h6" sx={{ color: "#FF7A5A", mb: 1.5 }}>
          Past Works
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          {loading
            ? [1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" width={100} height={30} sx={{ borderRadius: 1, mb: 1 }} />
              ))
            : portfolio.pastWorks?.map((work, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.03 }} >
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                       bgcolor: "#FF7A5A",
                      textTransform: "none",
                      borderColor: "#FF7A5A",
                     color: "#fff" ,
                      "&:hover": { bgcolor: "#db6c51fe" },
                      mb: 1,
                    }}
                    onClick={() => handleOpenPastWork(work)}
                  >
                    {work.title}
                  </Button>
                </motion.div>
              ))}
        </Stack>
      </Box>

      {/* Contact */}
      <Box sx={{ mt: 4, position: "relative", zIndex: 1 }}>
        <Typography variant="subtitle1" sx={{ color: "#FF7A5A", mb: 1 }}>
          Contact Builder
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
          {loading ? (
            <Skeleton variant="text" width={180} height={20} />
          ) : (
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              {portfolio.createdBy?.email}
            </Typography>
          )}
          {!loading && (
            <Button
              variant="contained"
              sx={{ bgcolor: "#FF7A5A", "&:hover": { bgcolor: "#e7643f" }, textTransform: "none", fontSize: 14 }}
              startIcon={<Email />}
              component="a"
              href={`https://mail.google.com/mail/?view=cm&to=${portfolio.createdBy?.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </Button>
          )}
        </Stack>
      </Box>

      {/* Past Work Modal */}
      {selectedWork && (
        <PastWorkViewModal open={pastWorkModalOpen} handleClose={handleClosePastWork} work={selectedWork} portfolio={portfolio} />
      )}
    </Box>
     </>
  );
};

export default ViewBuilderPage;
