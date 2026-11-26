import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "@tanstack/react-router";
import { AmenityList } from "@/components/cafes/AmenityTag";

const DARK_BASE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const DARK_LABELS =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";

function pinIcon(active) {
  return L.divIcon({
    className: "sanka-pin",
    html: `<span class="sanka-pin-body ${active ? "is-active" : ""}"><span>☕</span></span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 34],
    popupAnchor: [0, -28],
  });
}

const youIcon = L.divIcon({
  className: "sanka-pin",
  html: `<span class="sanka-you"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 15), { duration: 0.9 });
  }, [target?.[0], target?.[1]]);
  return null;
}

export default function CafeMap({ center, cafes, selectedId, onSelect, origin }) {
  return (
    <div className="sanka-map h-full w-full">
      <MapContainer
        center={center}
        zoom={14}
        maxZoom={16}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl
      >
        <TileLayer
          url={DARK_BASE}
          maxZoom={16}
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &middot; &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <TileLayer url={DARK_LABELS} maxZoom={16} />

        {origin && (
          <>
            <Circle center={[origin.lat, origin.lng]} radius={90} pathOptions={{ color: "#96c1c5", weight: 1, opacity: 0.5, fillOpacity: 0.08 }} />
            <Marker position={[origin.lat, origin.lng]} icon={youIcon} />
          </>
        )}

        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={cafe.position}
            icon={pinIcon(cafe.id === selectedId)}
            eventHandlers={{ click: () => onSelect(cafe.id) }}
          >
            <Popup>
              <div className="w-[196px]">
                <p className="font-heading text-[16px] font-bold leading-tight">{cafe.name}</p>
                <p className="mt-1 text-[12px] leading-snug opacity-70">{cafe.summary}</p>
                <AmenityList amenities={cafe.amenities} limit={3} className="mt-2" />
                <Link
                  to="/cafes/$cafeId"
                  params={{ cafeId: cafe.id }}
                  className="mt-3 inline-block text-[12px] font-bold underline decoration-2 underline-offset-2"
                >
                  Open café →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        <FlyTo target={selectedId ? cafes.find((c) => c.id === selectedId)?.position : null} />
      </MapContainer>
    </div>
  );
}