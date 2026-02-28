import React, { useEffect, useRef, useState } from 'react'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Machine, MachinePosition } from '@/lib/types'

interface MapContainerProps {
  machines: Machine[]
  positions: Map<string, MachinePosition>
  selectedMachineId?: string
  onMachineSelect?: (machineId: string) => void
  showClusters?: boolean
  showTrails?: boolean
  showHeatmap?: boolean
}

export function MapContainer({
  machines,
  positions,
  selectedMachineId,
  onMachineSelect,
  showClusters = true,
  showTrails = true,
  showHeatmap = false,
}: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const initializedRef = useRef(false)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || initializedRef.current || mapRef.current) return

    try {
      console.log('MapContainer: Initializing Leaflet map')
      mapRef.current = L.map(containerRef.current).setView([28.5, 81.0], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)

      initializedRef.current = true
      console.log('MapContainer: Map initialized successfully')
    } catch (error) {
      console.error("Map initialization error:", error)
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        initializedRef.current = false
      }
    }
  }, [])

  // Update machine markers
  useEffect(() => {
    if (!mapRef.current) return

    console.log('MapContainer: Updating markers for', machines.length, 'machines')

    machines.forEach((machine) => {
      const fallbackLat = machine.current_location?.lat ?? machine.latitude ?? 0
      const fallbackLng = machine.current_location?.lng ?? machine.longitude ?? 0

      const position = positions.get(machine.id) || {
        lat: fallbackLat,
        lng: fallbackLng,
        timestamp: machine.last_active,
        machine_id: machine.id,
      }

      // Skip machines with invalid coordinates
      if (position.lat === 0 || position.lng === 0) {
        console.warn(`Machine ${machine.id} has invalid coordinates:`, position)
        return
      }

      const latLng: LatLngExpression = [position.lat, position.lng]

      let marker = markersRef.current.get(machine.id)

      if (!marker) {
        // Create new marker
        console.log(`Creating marker for ${machine.id} at [${latLng}]`)
        const icon = getStatusIcon(machine.status, false, machine.machine_type)
        marker = L.marker(latLng, { icon })
          .bindPopup(createPopupContent(machine))
          .on('click', () => onMachineSelect?.(machine.id))

        if (selectedMachineId === machine.id) {
          marker.openPopup()
        }

        marker.addTo(mapRef.current)
        markersRef.current.set(machine.id, marker)
        console.log(`Marker added for ${machine.id}, total markers:`, markersRef.current.size)
      } else {
        // Update existing marker position
        marker.setLatLng(latLng)
      }

      // Highlight selected machine
      if (selectedMachineId === machine.id) {
        marker.setIcon(getStatusIcon(machine.status, true, machine.machine_type))
      } else {
        marker.setIcon(getStatusIcon(machine.status, false, machine.machine_type))
      }
    })

    // Remove markers for deleted machines
    markersRef.current.forEach((marker, machineId) => {
      if (!machines.find((m) => m.id === machineId)) {
        marker.remove()
        markersRef.current.delete(machineId)
      }
    })
  }, [machines, positions, selectedMachineId, onMachineSelect])

  return <div ref={containerRef} className="w-full h-[600px] rounded-lg border border-slate-200" />
}

function getStatusIcon(status: string, isSelected: boolean = false, machineType?: string): L.Icon {
  const statusColors: Record<string, string> = {
    active: '#10b981',
    idle: '#f59e0b',
    maintenance: '#ef4444',
    offline: '#6b7280',
  }

  const color = statusColors[status] || '#3b82f6'
  const size = isSelected ? 40 : 30
  
  // Get first letter of machine type for abbreviation
  const abbr = machineType ? machineType.charAt(0).toUpperCase() : 'M'

  // Use DivIcon instead of SVG icon for better compatibility
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: ${size * 0.5}px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ${isSelected ? 'box-shadow: 0 0 0 3px ' + color + '40;' : ''}
      ">
        ${abbr}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}

function createPopupContent(machine: Machine): string {
  const utilizationColor =
    machine.utilization_rate > 70 ? '#10b981' : machine.utilization_rate > 30 ? '#f59e0b' : '#ef4444'

  const district = machine.current_location?.district ?? machine.district ?? 'Unknown'

  return `
    <div class="w-48">
      <h3 class="font-bold text-sm">${machine.registration_number}</h3>
      <p class="text-xs text-slate-600">${machine.machine_type}</p>
      <div class="mt-2 space-y-1 text-xs">
        <div class="flex justify-between">
          <span>Status:</span>
          <span class="font-semibold">${machine.status.toUpperCase()}</span>
        </div>
        <div class="flex justify-between">
          <span>Utilization:</span>
          <span style="color: ${utilizationColor};" class="font-semibold">${machine.utilization_rate.toFixed(1)}%</span>
        </div>
        <div class="flex justify-between">
          <span>Location:</span>
          <span>${district}</span>
        </div>
      </div>
      <button class="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 rounded">
        View Details
      </button>
    </div>
  `
}
