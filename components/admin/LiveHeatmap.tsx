"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

function HeatmapLayer({ points }: { points: HeatmapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Convert points to heatmap format: [lat, lng, intensity]
    const heatData = points.map((point) => [
      point.lat,
      point.lng,
      point.intensity,
    ]);

    // @ts-ignore - leaflet.heat types not available
    const heatLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 35,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: "blue",
        0.3: "cyan",
        0.5: "lime",
        0.7: "yellow",
        1.0: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default function LiveHeatmap() {
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<boolean>(false);

  useEffect(() => {
    fetchHeatmapData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHeatmapData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const res = await fetch("/api/admin/heatmap-data");
      const data = await res.json();

      if (data.points) {
        setHeatmapPoints(data.points);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100">
        <p className="text-slate-600">Loading heatmap...</p>
      </div>
    );
  }

  // Default center: India
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;

  // Prevent re-initialization on hot reload
  if (mapRef.current) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100">
        <p className="text-slate-600">Map loaded</p>
      </div>
    );
  }

  mapRef.current = true;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      key="heatmap-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatmapLayer points={heatmapPoints} />
    </MapContainer>
  );
}
