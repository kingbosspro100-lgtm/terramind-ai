"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  latitude: number;
  longitude: number;
  name: string;
};

export default function FarmMap({
  latitude,
  longitude,
  name,
}: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]} icon={icon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}