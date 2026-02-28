"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Zod validation schema
const BookingSchema = z.object({
  farmer_id: z.string().min(1, "Farmer ID is required"),
  machine_id: z.string().min(1, "Machine is required"),
  chc_id: z.string().min(1, "CHC is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  area: z.coerce.number().min(0.1, "Area must be greater than 0"),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
})

type BookingFormData = z.infer<typeof BookingSchema>

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BookingFormData) => Promise<void>
  machineId?: string
  chcId?: string
}

export function BookingModal({ isOpen, onClose, onSubmit, machineId, chcId }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      machine_id: machineId,
      chc_id: chcId,
    },
  })

  const onSubmitHandler = async (data: BookingFormData) => {
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
            <h2 className="text-xl font-bold text-slate-900">Create New Booking</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4 px-6 py-4">
            {/* Farmer ID */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Farmer ID</label>
              <input
                {...register("farmer_id")}
                type="text"
                placeholder="F-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.farmer_id && <p className="text-xs text-red-600 mt-1">{errors.farmer_id.message}</p>}
            </div>

            {/* Machine ID */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Machine ID</label>
              <input
                {...register("machine_id")}
                type="text"
                placeholder="M-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                disabled={!!machineId}
              />
              {errors.machine_id && <p className="text-xs text-red-600 mt-1">{errors.machine_id.message}</p>}
            </div>

            {/* CHC ID */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">CHC ID</label>
              <input
                {...register("chc_id")}
                type="text"
                placeholder="CHC-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                disabled={!!chcId}
              />
              {errors.chc_id && <p className="text-xs text-red-600 mt-1">{errors.chc_id.message}</p>}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Start Date</label>
              <input
                {...register("start_date")}
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.start_date && <p className="text-xs text-red-600 mt-1">{errors.start_date.message}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">End Date</label>
              <input
                {...register("end_date")}
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.end_date && <p className="text-xs text-red-600 mt-1">{errors.end_date.message}</p>}
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Area (acres)</label>
              <input
                {...register("area")}
                type="number"
                step="0.1"
                placeholder="10"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.area && <p className="text-xs text-red-600 mt-1">{errors.area.message}</p>}
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Cost (₹)</label>
              <input
                {...register("cost")}
                type="number"
                placeholder="5000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.cost && <p className="text-xs text-red-600 mt-1">{errors.cost.message}</p>}
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
                {isSubmitting ? "Creating..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
