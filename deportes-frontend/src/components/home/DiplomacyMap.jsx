import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./DiplomacyMap.module.css";

const LATAM_CENTER = [-8, -58];
const EUROPE_CENTER = [50, 12];

// Punto de control desplazado al norte para que el arco se vea como una ruta de vuelo
const ARC_CONTROL = [60, -23];

function quadraticBezierPoints(p0, control, p1, steps = 28) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat =
      (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * control[0] + t * t * p1[0];
    const lng =
      (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * control[1] + t * t * p1[1];
    points.push([lat, lng]);
  }
  return points;
}

const ARC_POINTS = quadraticBezierPoints(LATAM_CENTER, ARC_CONTROL, EUROPE_CENTER);

function labelIcon(text) {
  return L.divIcon({
    className: "",
    html: `<div class="${styles.labelPill}">${text}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function FitRegions() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      [
        [-40, -95],
        [66, 35],
      ],
      { padding: [12, 12] }
    );
    setTimeout(() => map.invalidateSize(), 80);
  }, [map]);
  return null;
}

export default function DiplomacyMap() {
  return (
    <div className={styles.mapMock}>
      <MapContainer
        center={[20, -20]}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <FitRegions />
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <Circle
          center={LATAM_CENTER}
          radius={2600000}
          pathOptions={{ color: "#53fb52", weight: 1.5, fillColor: "#53fb52", fillOpacity: 0.12 }}
        />
        <Circle
          center={EUROPE_CENTER}
          radius={1500000}
          pathOptions={{ color: "#53fb52", weight: 1.5, fillColor: "#53fb52", fillOpacity: 0.12 }}
        />

        <Polyline
          positions={ARC_POINTS}
          pathOptions={{ color: "#53fb52", weight: 2, dashArray: "5 5", opacity: 0.85 }}
        />

        <CircleMarker center={LATAM_CENTER} radius={5} pathOptions={{ color: "#07111c", weight: 1.5, fillColor: "#53fb52", fillOpacity: 1 }} />
        <CircleMarker center={EUROPE_CENTER} radius={5} pathOptions={{ color: "#07111c", weight: 1.5, fillColor: "#53fb52", fillOpacity: 1 }} />

        <Marker position={[-20, -58]} icon={labelIcon("LATINOAMÉRICA")} interactive={false} />
        <Marker position={[58, 12]} icon={labelIcon("EUROPA")} interactive={false} />
      </MapContainer>
      <div className={styles.mapCornerLabel}>Red BKME activa</div>
    </div>
  );
}
