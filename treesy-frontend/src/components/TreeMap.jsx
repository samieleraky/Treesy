import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function TreeMap({ trees }) {
  return (
    <MapContainer
      center={[-6.37, 34.88]}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trees.map((t, i) => (
        <Marker key={i} position={[t.lat, t.lng]} />
      ))}
    </MapContainer>
  );
}