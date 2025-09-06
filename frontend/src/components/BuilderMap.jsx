import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BuilderMap = ({ location, company }) => {
  if (!location?.coordinates) return null;

  const [lng, lat] = location.coordinates;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "300px", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>{company}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default BuilderMap;
