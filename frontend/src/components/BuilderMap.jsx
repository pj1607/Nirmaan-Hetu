import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { LocationOn, Add, Remove } from "@mui/icons-material";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Floating controls
const MapControls = ({ position }) => {
  const map = useMap();

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();
  const flyToMarker = () => map.flyTo(position, 15, { animate: true, duration: 1 });

  return (
    <Stack
      spacing={1}
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      {/* Zoom to Marker */}
      <IconButton
        onClick={flyToMarker}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          color: "#FF7A5A",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          "&:hover": {
             bgcolor: "rgba(230, 228, 228, 0.84)",
             color: "#FF7A5A",
            transform: "scale(1.05)",
          },
        }}
      >
        <LocationOn />
      </IconButton>

      {/* Zoom In */}
      <IconButton
        onClick={zoomIn}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          color: "#333",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          "&:hover": {
            bgcolor: "rgba(230, 228, 228, 0.84)",
            transform: "scale(1.05)",
          },
        }}
      >
        <Add />
      </IconButton>

      {/* Zoom Out */}
      <IconButton
        onClick={zoomOut}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          color: "#333",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          "&:hover": {
            bgcolor: "rgba(230, 228, 228, 0.84)",
            transform: "scale(1.05)",
          },
        }}
      >
        <Remove />
      </IconButton>
    </Stack>
  );
};

const BuilderMap = ({ location, company }) => {
  if (!location?.coordinates) return null;

  const [lng, lat] = location.coordinates;
  const position = [lat, lng];

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      }}
    >
      <MapContainer
        center={position}
         zoomControl={false} 
        zoom={13}
        style={{
          height: "320px",
          width: "100%",
        }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position}>
          <Popup>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#FF7A5A" }}>
              {company}
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Builder Location 📍
            </Typography>
          </Popup>
        </Marker>

        {/* Floating Controls */}
        <MapControls position={position} />
      </MapContainer>
    </Box>
  );
};

export default BuilderMap;
