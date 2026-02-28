// Machine Types
export type MachineStatus = "active" | "idle" | "maintenance" | "offline"
export type MachineType = "baler" | "mulcher" | "seeder" | "harvester" | "tiller" | "happy_seeder" | "zero_till_drill"

// Alert Types
export type AlertType = "underutilization" | "maintenance" | "geofence" | "offline" | "fuel_low" | "anomaly" | "geofence_breach" | "low_utilization" | "sos_burning" | "session_anomaly"
export type AlertSeverity = "low" | "medium" | "high" | "critical"
export type AlertStatus = "open" | "acknowledged" | "resolved" | "dismissed"

// User Roles
export type UserRole = "ADMIN" | "STATE_NODAL" | "PANCHAYAT" | "CHC_OWNER" | "FARMER"

// Telemetry Types
export type TelemetryStatus = "IDLE" | "ACTIVE" | "MOVING" | "OFFLINE"

// Complaint Types
export type ComplaintType = "MACHINE_UNAVAILABLE" | "HIGH_RENTAL_RATE" | "POOR_SERVICE" | "DELAYED_BOOKING" | "OTHER"
export type ComplaintStatus = "SUBMITTED" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED" | "ESCALATED"

// Core Interfaces
export interface Location {
  lat: number
  lng: number
  district?: string
  state?: string
  address?: string
}

export interface Machine {
  id: string
  registration_number: string
  machine_type: MachineType
  chc_id: string
  status: MachineStatus
  current_location?: Location
  latitude: number
  longitude: number
  district: string
  state: string
  last_active: string
  total_hours: number
  fuel_efficiency: number
  utilization_rate: number
  fuel_level?: number
  operator_id?: string
  make?: string
  model?: string
  year?: number
  purchase_date?: string
  warranty_expiry?: string
  gps_device_id?: string
  telemetryLogs?: TelemetryLog[]
  sessions?: UtilizationSession[]
}

export interface MachinePosition {
  machine_id: string
  lat: number
  lng: number
  timestamp: string
  speed?: number
  heading?: number
}

export interface CustomHiringCentre {
  id: string
  name: string
  location: Location
  district: string
  state: string
  contact_number: string
  total_machines: number
  performance_rating: number
  owner_name?: string
  email?: string
  revenue_this_month?: number
  panchayat_id?: string
  panchayat?: Panchayat
}

export interface Operator {
  id: string
  name: string
  phone: string
  chc_id: string
  rating: number
  total_hours_worked: number
  machines_operated: string[]
}

export interface UsageLog {
  id: string
  machine_id: string
  operator_id: string
  start_time: string
  end_time: string
  location: Location
  area_covered: number
  fuel_consumed: number
  farmer_name?: string
  farmer_contact?: string
  village?: string
  notes?: string
  photo_urls?: string[]
}

export interface Alert {
  id: string
  machine_id?: string
  chc_id?: string
  panchayat_id?: string
  alert_type: AlertType
  severity: AlertSeverity
  status: AlertStatus
  created_at: string
  updated_at: string
  message: string
  description?: string
  affected_resource?: string
  panchayat?: Panchayat
}

export interface Booking {
  id: string
  farmer_id: string
  farmer_name: string
  machine_type: MachineType
  chc_id: string
  start_date: string
  end_date: string
  land_area: number
  estimated_cost: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  location: Location
}

export interface MaintenanceRecord {
  id: string
  machine_id: string
  service_type: string
  service_date: string
  next_due_date: string
  cost: number
  description: string
  technician?: string
  parts_replaced?: string[]
}

export interface AlertRule {
  id: string
  rule_name: string
  trigger_condition: string
  threshold_value?: number
  alert_type: AlertType
  severity: AlertSeverity
  enabled: boolean
  notification_channels: ("in_app" | "email" | "sms")[]
}

export interface NotificationPreference {
  user_id: string
  alert_types: AlertType[]
  channels: ("in_app" | "email" | "sms" | "push")[]
  quiet_hours_start?: string
  quiet_hours_end?: string
  daily_digest: boolean
  sound_enabled: boolean
}

export interface AnalyticsData {
  total_machines: number
  active_machines: number
  idle_machines: number
  maintenance_machines: number
  offline_machines: number
  avg_utilization_rate: number
  avg_fuel_level: number
  active_machines_trend: number
  state_distribution: Record<string, number>
  machine_type_breakdown: Record<string, number>
  top_chcs: Array<{ id: string; name: string; machines: number; rating: number }>
  predicted_underutilization_risk: number
  maintenance_alert_count: number
  fuel_savings_potential: number
}

export interface SuccessStory {
  id: string
  title: string
  description: string
  farmer_name: string
  location: Location
  image_url?: string
  impact_metric?: string
  date_published: string
}

export interface News {
  id: string
  title: string
  description: string
  category: "milestone" | "announcement" | "achievement" | "event"
  published_date: string
  image_url?: string
}

export interface UserPreferences {
  theme: "light" | "dark"
  language: "en" | "hi" | "pa" | "bn"
  notifications_enabled: boolean
}

// Accountability & Governance Models (Krishi Drishti)
export interface Panchayat {
  id: string
  name: string
  district: string
  state: string
  block: string
  population: number
  boundary_polygon?: string
  utilization_score: number
  rank?: number
  nodal_officer_id?: string
  created_at: string
  updated_at: string
  chcs?: CustomHiringCentre[]
  sessions?: UtilizationSession[]
  complaints?: Complaint[]
  users?: User[]
  alerts?: Alert[]
}

export interface TelemetryLog {
  id: string
  machine_id: string
  timestamp: string
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  ignition_status: boolean
  vibration_level?: number
  rpm?: number
  status: TelemetryStatus
  created_at: string
  machine?: Machine
}

export interface UtilizationSession {
  id: string
  machine_id: string
  panchayat_id: string
  start_time: string
  end_time?: string
  start_lat: number
  start_lng: number
  end_lat?: number
  end_lng?: number
  operator_id?: string
  farmer_name?: string
  acres_covered?: number
  subsidy_amount?: number
  verified: boolean
  verified_by?: string
  verified_at?: string
  notes?: string
  created_at: string
  updated_at: string
  machine?: Machine
  panchayat?: Panchayat
  operator?: Operator
}

export interface Complaint {
  id: string
  panchayat_id: string
  farmer_name: string
  farmer_contact: string
  complaint_type: ComplaintType
  chc_id?: string
  machine_id?: string
  description: string
  status: ComplaintStatus
  resolution_notes?: string
  resolved_by?: string
  resolved_at?: string
  created_at: string
  updated_at: string
  panchayat?: Panchayat
  chc?: CustomHiringCentre
  machine?: Machine
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  panchayat_id?: string
  panchayat?: Panchayat
  created_at: string
  updated_at: string
}
