import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet-cluster/dist/MarkerCluster.css';
import 'leaflet-cluster/dist/MarkerCluster.Default.css';
import { Machine, MachinePosition } from '@/lib/types';

interface MapContainerProps {
  machines: Machine[];
  positions: Map<string, MachinePosition>;
  selectedMachineId?: string;
  onMachineSelect?: (machineId: string) => void;
  showClusters?: boolean;
  showTrails?: boolean;
  showHeatmap?: boolean;
}

export const MapContainerEnhanced: React.FC<MapContainerProps> = ({
  machines,
  positions,
  selectedMachineId,
  onMachineSelect,
  showClusters = true,
  showTrails = false,
  showHeatmap = false,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const clusterGroupRef = useRef<any>(null);
  const trailsRef = useRef<L.Polyline[]>([]);
  const heatmapRef = useRef<any>(null);

  // Custom status icons
  const getStatusIcon = (status: string) => {
    const iconSize = selectedMachineId ? 40 : 32;
    const iconUrl = (() => {
      switch (status) {
        case 'active':
          return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%2322c55e'/%3E%3Ccircle cx='12' cy='12' r='8' fill='%2316a34a'/%3E%3C/svg%3E`;
        case 'idle':
          return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23eab308'/%3E%3Ccircle cx='12' cy='12' r='8' fill='%23ca8a04'/%3E%3C/svg%3E`;
        case 'maintenance':
          return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ef4444'/%3E%3Ccircle cx='12' cy='12' r='8' fill='%23dc2626'/%3E%3C/svg%3E`;
        default:
          return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%236b7280'/%3E%3Ccircle cx='12' cy='12' r='8' fill='%234b5563'/%3E%3C/svg%3E`;
      }
    })();

    return L.icon({
      iconUrl,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
      popupAnchor: [0, -iconSize / 2],
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add cluster group
    if (showClusters) {
      clusterGroupRef.current = new MarkerClusterGroup();
      mapRef.current.addLayer(clusterGroupRef.current);
    }

    return () => {
      // Cleanup will be handled by component unmount
    };
  }, [showClusters]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    const markerGroup = showClusters ? clusterGroupRef.current : mapRef.current;

    machines.forEach((machine) => {
      const pos = positions.get(machine.id) || {
        latitude: machine.latitude,
        longitude: machine.longitude,
      };

      const existingMarker = markersRef.current.get(machine.id);

      if (existingMarker) {
        // Update existing marker
        existingMarker.setLatLng([pos.latitude, pos.longitude]);
        existingMarker.setIcon(getStatusIcon(machine.status));
      } else {
        // Create new marker
        const marker = L.marker([pos.latitude, pos.longitude], {
          icon: getStatusIcon(machine.status),
        });

        const popupContent = `
          <div class="p-2 w-48">
            <h3 class="font-bold text-sm">${machine.id}</h3>
            <p class="text-xs text-gray-600">${machine.registration_number}</p>
            <div class="mt-2 space-y-1 text-xs">
              <div><span class="font-semibold">Type:</span> ${machine.machine_type}</div>
              <div><span class="font-semibold">Status:</span> <span class="capitalize">${machine.status}</span></div>
              <div><span class="font-semibold">Utilization:</span> ${machine.utilization_percent}%</div>
              <div><span class="font-semibold">Location:</span> ${machine.district}, ${machine.state}</div>
              <div><span class="font-semibold">Fuel:</span> ${machine.fuel_level}%</div>
            </div>
            ${
              selectedMachineId === machine.id
                ? '<div class="mt-2 bg-blue-100 p-1 text-blue-700 text-xs font-semibold">Selected</div>'
                : ''
            }
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => onMachineSelect?.(machine.id));

        markersRef.current.set(machine.id, marker);

        if (showClusters) {
          clusterGroupRef.current.addLayer(marker);
        } else {
          mapRef.current?.addLayer(marker);
        }
      }
    });

    // Remove deleted machines
    markersRef.current.forEach((marker, machineId) => {
      if (!machines.find((m) => m.id === machineId)) {
        if (showClusters) {
          clusterGroupRef.current.removeLayer(marker);
        } else {
          mapRef.current?.removeLayer(marker);
        }
        markersRef.current.delete(machineId);
      }
    });
  }, [machines, positions, selectedMachineId, showClusters, onMachineSelect]);

  // Draw trails
  useEffect(() => {
    if (!mapRef.current || !showTrails) return;

    // Clear existing trails
    trailsRef.current.forEach((trail) => mapRef.current?.removeLayer(trail));
    trailsRef.current = [];

    machines.forEach((machine) => {
      // In a real app, you'd fetch historical positions
      // For now, we'll just draw a simple line from current position
      const pos = positions.get(machine.id);
      if (pos) {
        // Simulate a trail with some nearby points
        const trail = L.polyline(
          [
            [pos.latitude, pos.longitude],
            [pos.latitude + 0.01, pos.longitude + 0.01],
            [pos.latitude + 0.02, pos.longitude - 0.01],
          ],
          {
            color:
              machine.status === 'active'
                ? '#22c55e'
                : machine.status === 'idle'
                  ? '#eab308'
                  : machine.status === 'maintenance'
                    ? '#ef4444'
                    : '#6b7280',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 5',
          }
        );
        trail.addTo(mapRef.current);
        trailsRef.current.push(trail);
      }
    });
  }, [machines, positions, showTrails]);

  // Render heatmap
  useEffect(() => {
    if (!mapRef.current || !showHeatmap) return;

    // Remove existing heatmap
    if (heatmapRef.current) {
      mapRef.current.removeLayer(heatmapRef.current);
    }

    // Create heatmap data from positions
    const heatmapData = machines
      .map((machine) => {
        const pos = positions.get(machine.id) || { latitude: machine.latitude, longitude: machine.longitude };
        return [pos.latitude, pos.longitude, machine.utilization_percent / 100];
      })
      .filter((point) => point);

    // For now, we'll show markers with heat-like colors
    // In production, use HeatmapLayer library
    if (heatmapData.length > 0) {
      // Placeholder for heatmap visualization
      console.log('Heatmap data:', heatmapData);
    }
  }, [machines, positions, showHeatmap]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '500px' }} />
    </div>
  );
};
