import type { Machine, CustomHiringCentre, Alert } from "./types"

const STATES = ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Karnataka"]
const DISTRICTS = {
  Punjab: ["Ludhiana", "Patiala", "Amritsar", "Jalandhar"],
  Haryana: ["Hisar", "Rohtak", "Faridabad", "Gurgaon"],
  "Uttar Pradesh": ["Meerut", "Agra", "Lucknow", "Kanpur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur"],
  Karnataka: ["Bangalore", "Mysore", "Belgaum", "Mangalore"],
}

const MACHINE_TYPES: Array<"baler" | "mulcher" | "seeder" | "harvester" | "tiller"> = [
  "baler",
  "mulcher",
  "seeder",
  "harvester",
  "tiller",
]

const STATUSES: Array<"active" | "idle" | "maintenance" | "offline"> = ["active", "idle", "maintenance", "offline"]

export function generateMockMachines(count = 300): Machine[] {
  const machines: Machine[] = []
  const chcIds = Array.from({ length: 50 }, (_, i) => `CHC-${String(i + 1).padStart(3, "0")}`)

  for (let i = 0; i < count; i++) {
    const state = STATES[Math.floor(Math.random() * STATES.length)]
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)]

    machines.push({
      id: `MACH-${String(i + 1).padStart(6, "0")}`,
      registration_number: `MH-${String(i + 1).padStart(5, "0")}`,
      machine_type: MACHINE_TYPES[Math.floor(Math.random() * MACHINE_TYPES.length)],
      chc_id: chcIds[Math.floor(Math.random() * chcIds.length)],
      status,
      current_location: {
        lat: 28 + Math.random() * 8,
        lng: 75 + Math.random() * 12,
      },
      last_active: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      total_hours: Math.floor(Math.random() * 5000),
      fuel_efficiency: 8 + Math.random() * 4,
      utilization_rate: status === "active" ? 70 + Math.random() * 30 : Math.random() * 40,
    })
  }

  return machines
}

export function generateMockCHCs(count = 50): CustomHiringCentre[] {
  const chcs: CustomHiringCentre[] = []

  for (let i = 0; i < count; i++) {
    const state = STATES[Math.floor(Math.random() * STATES.length)]
    const districts = DISTRICTS[state as keyof typeof DISTRICTS]
    const district = districts[Math.floor(Math.random() * districts.length)]

    chcs.push({
      id: `CHC-${String(i + 1).padStart(3, "0")}`,
      name: `${district} CHC - ${i + 1}`,
      location: {
        lat: 28 + Math.random() * 8,
        lng: 75 + Math.random() * 12,
      },
      district,
      state,
      contact_number: `+91${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      total_machines: Math.floor(Math.random() * 20) + 5,
      performance_rating: 2 + Math.random() * 3,
    })
  }

  return chcs
}

export function generateMockAlerts(machineCount = 50): Alert[] {
  const alerts: Alert[] = []
  const alertTypes: Array<"underutilization" | "maintenance" | "geofence"> = [
    "underutilization",
    "maintenance",
    "geofence",
  ]
  const severities: Array<"low" | "medium" | "high"> = ["low", "medium", "high"]

  for (let i = 0; i < machineCount; i++) {
    alerts.push({
      id: `ALERT-${String(i + 1).padStart(5, "0")}`,
      machine_id: `MACH-${String(Math.floor(Math.random() * 300) + 1).padStart(6, "0")}`,
      alert_type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: Math.random() > 0.5 ? "open" : "acknowledged",
      created_at: new Date(Date.now() - Math.random() * 604800000).toISOString(),
      message: "Alert generated for machine monitoring",
    })
  }

  return alerts
}

export function generateUtilizationTrend() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    utilization: Math.floor(40 + Math.random() * 50),
    machines_active: Math.floor(100 + Math.random() * 150),
  }))
}

export function generateStateDistribution() {
  return STATES.map((state) => ({
    state,
    machines: Math.floor(Math.random() * 80000) + 20000,
  })).sort((a, b) => b.machines - a.machines)
}

export function generateMachineTypeBreakdown() {
  return MACHINE_TYPES.map((type) => ({
    type,
    count: Math.floor(Math.random() * 100000) + 10000,
  }))
}
