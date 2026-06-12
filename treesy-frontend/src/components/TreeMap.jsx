import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css"; //importer leaflet.css
import L from "leaflet";

// Fix til Leaflet marker-ikoner med Vite/Rolldown
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TreeMap({ trees }) {
  if (!trees || trees.length === 0) {
    return <p style={{ color: "#9ca3af" }}>Ingen træer registreret endnu.</p>;
  }

  return (
    <MapContainer
      center={[-6.37, 34.88]}
      zoom={6}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      {trees.map((t, i) => (
        <Marker key={i} position={[t.lat, t.lng]} />
      ))}
    </MapContainer>
  );
}