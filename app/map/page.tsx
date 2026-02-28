"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { SidebarNav } from "@/components/sidebar-nav"
import { apiClient } from "@/services/api-client"
import type { Machine, MachinePosition } from "@/lib/types"
import { Search, Filter, Eye, Layers, Clock } from "lucide-react"

const MapContainer = dynamic(
  () => import("@/components/map/MapContainer").then((mod) => mod.MapContainer),
  { ssr: false }
)

export default function MachineMapPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [positions, setPositions] = useState<Map<string, MachinePosition>>(new Map())
  const [selectedMachineId, setSelectedMachineId] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Map features toggle
  const [showClusters, setShowClusters] = useState(true)
  const [showTrails, setShowTrails] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  
  // Filter states
  const [filterState, setFilterState] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterType, setFilterType] = useState("")

  // Fetch machines on mount
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getMachines({
          state: filterState || undefined,
          status: filterStatus || undefined,
          type: filterType || undefined,
        })
        
        // Ensure data is an array
        const machinesArray = Array.isArray(data) ? data : []
        console.log('Map page: Fetched machines:', machinesArray.length)
        setMachines(machinesArray)
        
        // Initialize positions
        const initialPositions = new Map<string, MachinePosition>()
        machinesArray.forEach((machine) => {
          const lat = machine.current_location?.lat ?? machine.latitude ?? 0
          const lng = machine.current_location?.lng ?? machine.longitude ?? 0

          console.log(`Machine ${machine.id}: lat=${lat}, lng=${lng}`)
          
          initialPositions.set(machine.id, {
            machine_id: machine.id,
            lat,
            lng,
            timestamp: machine.last_active,
          })
        })
        console.log('Map page: Set positions for', initialPositions.size, 'machines')
        setPositions(initialPositions)
      } catch (error) {
        console.error("Failed to fetch machines:", error)
        // Set empty array on error to prevent crashes
        setMachines([])
        setPositions(new Map())
      } finally {
        setLoading(false)
      }
    }

    fetchMachines()
  }, [filterState, filterStatus, filterType])

  // Simulate real-time position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const updated = new Map(prev)
        machines.forEach((machine) => {
          const pos = updated.get(machine.id)
          if (pos) {
            // Simulate slight position change for active machines
            if (machine.status === "active") {
              updated.set(machine.id, {
                ...pos,
                lat: pos.lat + (Math.random() - 0.5) * 0.01,
                lng: pos.lng + (Math.random() - 0.5) * 0.01,
                timestamp: new Date().toISOString(),
              })
            }
          }
        })
        return updated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [machines])

  const filteredMachines = machines.filter((m) =>
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  console.log('Map page: Total machines:', machines.length, 'Filtered:', filteredMachines.length)

  const activeMachinesCount = machines.filter((m) => m.status === "active").length

  return (
    <div className="flex">
      <SidebarNav />
      <main className="ml-64 flex-1 bg-slate-50 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Real-Time Machine Tracking</h1>
                <p className="text-slate-600 mt-2">Interactive map with live machine positions</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{activeMachinesCount}</div>
                <p className="text-sm text-slate-600">Machines Active Now</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
                {/* Search */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Machine ID or Registration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Types</option>
                  <option value="baler">Baler</option>
                  <option value="mulcher">Mulcher</option>
                  <option value="seeder">Seeder</option>
                  <option value="harvester">Harvester</option>
                  <option value="tiller">Tiller</option>
                </select>

                {/* View Toggle */}
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  Views
                </button>
              </div>

              {/* Layer Controls */}
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showClusters}
                    onChange={(e) => setShowClusters(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>Marker Clusters</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTrails}
                    onChange={(e) => setShowTrails(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>Movement Trails</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>Heatmap</span>
                </label>
              </div>
            </div>
          </div>

          {/* Map */}
          {loading ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-slate-600">Loading machines...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Map Area */}
              <div className="lg:col-span-3">
                {console.log('Rendering MapContainer with machines:', filteredMachines.length)}
                <MapContainer
                  machines={filteredMachines}
                  positions={positions}
                  selectedMachineId={selectedMachineId}
                  onMachineSelect={setSelectedMachineId}
                  showClusters={showClusters}
                  showTrails={showTrails}
                  showHeatmap={showHeatmap}
                />
              </div>

              {/* Side Panel - Machine List */}
              <div className="bg-white rounded-lg shadow p-4 h-96 overflow-y-auto">
                <h3 className="font-bold text-slate-900 mb-4">Machines ({filteredMachines.length})</h3>
                <div className="space-y-2">
                  {filteredMachines.slice(0, 20).map((machine) => (
                    <button
                      key={machine.id}
                      onClick={() => setSelectedMachineId(machine.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedMachineId === machine.id
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold text-sm text-slate-900">{machine.registration_number}</p>
                      <p className="text-xs text-slate-600">{machine.machine_type}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            machine.status === "active"
                              ? "bg-green-100 text-green-800"
                              : machine.status === "idle"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {machine.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-600">{machine.utilization_rate.toFixed(0)}%</span>
                      </div>
                    </button>
                  ))}
                  {filteredMachines.length > 20 && (
                    <p className="text-xs text-slate-600 text-center py-2">
                      +{filteredMachines.length - 20} more
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
