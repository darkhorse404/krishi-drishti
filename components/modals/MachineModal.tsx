"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Machine } from "@/lib/types"

// CHC Interface
interface CustomHiringCentre {
  id: string
  name: string
  district: string
  state: string
  contact_number: string
  email?: string
}

// Zod validation schema
const MachineSchema = z.object({
  id: z.string().min(1, "Machine ID is required"),
  registration_number: z.string().min(1, "Registration number is required"),
  machine_type: z.enum(["baler", "mulcher", "seeder", "harvester", "tiller", "happy_seeder", "zero_till_drill"], {
    errorMap: () => ({ message: "Please select a valid machine type" }),
  }),
  status: z.enum(["active", "idle", "maintenance", "offline"], {
    errorMap: () => ({ message: "Please select a status" }),
  }),
  chc_id: z.string().min(1, "CHC is required"),
  latitude: z.coerce.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.coerce.number().min(-180).max(180, "Invalid longitude"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  fuel_level: z.coerce.number().min(0).max(100, "Fuel level must be between 0-100"),
  utilization_rate: z.coerce.number().min(0).max(100, "Utilization must be between 0-100"),
})

type MachineFormData = z.infer<typeof MachineSchema>

interface MachineModalProps {
  isOpen: boolean
  machine?: Machine | null
  onClose: () => void
  onSubmit: (data: MachineFormData) => Promise<void>
}

export function MachineModal({ isOpen, machine, onClose, onSubmit }: MachineModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [chcs, setChcs] = useState<CustomHiringCentre[]>([])
  const [chcsLoading, setChcsLoading] = useState(false)
  const [chcsError, setChcsError] = useState<string | null>(null)

  // Fetch CHCs on mount
  useEffect(() => {
    const fetchChcs = async () => {
      setChcsLoading(true)
      setChcsError(null)
      try {
        const response = await fetch("/api/custom-hiring-centres")
        if (!response.ok) throw new Error("Failed to fetch CHCs")
        const data = await response.json()
        setChcs(data)
      } catch (error) {
        console.error("Error fetching CHCs:", error)
        setChcsError("Failed to load CHCs")
      } finally {
        setChcsLoading(false)
      }
    }

    if (isOpen) {
      fetchChcs()
    }
  }, [isOpen])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MachineFormData>({
    resolver: zodResolver(MachineSchema),
    defaultValues: machine
      ? {
          id: machine.id,
          registration_number: machine.registration_number,
          machine_type: machine.machine_type as any,
          status: machine.status as any,
          chc_id: machine.chc_id,
          latitude: machine.latitude,
          longitude: machine.longitude,
          district: machine.district,
          state: machine.state,
          fuel_level: machine.fuel_level,
          utilization_rate: machine.utilization_rate,
        }
      : undefined,
  })

  const onSubmitHandler = async (data: MachineFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">{machine ? "Edit Machine" : "Add New Machine"}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4 px-6 py-4">
            {/* Machine ID */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Machine ID</label>
              <input
                {...register("id")}
                type="text"
                placeholder="M-001"
                disabled={!!machine}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
              {errors.id && <p className="text-xs text-red-600 mt-1">{errors.id.message}</p>}
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Registration Number</label>
              <input
                {...register("registration_number")}
                type="text"
                placeholder="DL-01-AB-1234"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.registration_number && (
                <p className="text-xs text-red-600 mt-1">{errors.registration_number.message}</p>
              )}
            </div>

            {/* Machine Type */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Machine Type</label>
              <select
                {...register("machine_type")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="baler">Baler</option>
                <option value="mulcher">Mulcher</option>
                <option value="seeder">Seeder</option>
                <option value="harvester">Harvester</option>
                <option value="tiller">Tiller</option>
                <option value="happy_seeder">Happy Seeder</option>
                <option value="zero_till_drill">Zero Till Drill</option>
              </select>
              {errors.machine_type && <p className="text-xs text-red-600 mt-1">{errors.machine_type.message}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Status</label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
              {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
            </div>

            {/* CHC ID */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Custom Hiring Centre</label>
              {chcsError && <p className="text-xs text-red-600 mb-2">{chcsError}</p>}
              <select
                {...register("chc_id", {
                  onChange: (e) => {
                    // Auto-fill district and state when CHC is selected
                    const selected = chcs.find((c) => c.id === e.target.value)
                    if (selected) {
                      const form = e.target.form
                      if (form) {
                        const districtInput = form.querySelector('input[name="district"]') as HTMLInputElement
                        const stateInput = form.querySelector('input[name="state"]') as HTMLInputElement
                        if (districtInput) districtInput.value = selected.district
                        if (stateInput) stateInput.value = selected.state
                      }
                    }
                  },
                })}
                disabled={chcsLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              >
                <option value="">{chcsLoading ? "Loading CHCs..." : "Select CHC"}</option>
                {chcs.map((chc) => (
                  <option key={chc.id} value={chc.id}>
                    {chc.name} - {chc.district}, {chc.state}
                  </option>
                ))}
              </select>
              {errors.chc_id && <p className="text-xs text-red-600 mt-1">{errors.chc_id.message}</p>}
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">District</label>
              <input
                {...register("district")}
                type="text"
                placeholder="e.g., Hisar"
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
              {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district.message}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">State</label>
              <input
                {...register("state")}
                type="text"
                placeholder="e.g., Haryana"
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
              {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state.message}</p>}
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Latitude</label>
              <input
                {...register("latitude")}
                type="number"
                placeholder="29.1833"
                step="0.0001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.latitude && <p className="text-xs text-red-600 mt-1">{errors.latitude.message}</p>}
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Longitude</label>
              <input
                {...register("longitude")}
                type="number"
                placeholder="75.7597"
                step="0.0001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.longitude && <p className="text-xs text-red-600 mt-1">{errors.longitude.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Fuel Level (%)</label>
              <input
                {...register("fuel_level")}
                type="number"
                placeholder="80"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fuel_level && <p className="text-xs text-red-600 mt-1">{errors.fuel_level.message}</p>}
            </div>

            {/* Utilization Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Utilization Rate (%)</label>
              <input
                {...register("utilization_rate")}
                type="number"
                placeholder="75"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.utilization_rate && (
                <p className="text-xs text-red-600 mt-1">{errors.utilization_rate.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg font-medium transition"
              >
                {isSubmitting ? "Saving..." : machine ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
