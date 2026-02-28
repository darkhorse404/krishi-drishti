"use client"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertDetailModalProps {
  isOpen: boolean
  alert?: Alert | null
  onClose: () => void
  onAcknowledge?: (alertId: string) => void
  onResolve?: (alertId: string) => void
  onDelete?: (alertId: string) => void
}

export function AlertDetailModal({
  isOpen,
  alert,
  onClose,
  onAcknowledge,
  onResolve,
  onDelete,
}: AlertDetailModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen || !alert) return null

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", badge: "bg-red-100" }
      case "high":
        return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", badge: "bg-orange-100" }
      case "medium":
        return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", badge: "bg-yellow-100" }
      default:
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", badge: "bg-blue-100" }
    }
  }

  const colors = getSeverityColor(alert.severity)

  const handleAction = async (action: "acknowledge" | "resolve" | "delete") => {
    setIsProcessing(true)
    try {
      if (action === "acknowledge" && onAcknowledge) onAcknowledge(alert.id)
      if (action === "resolve" && onResolve) onResolve(alert.id)
      if (action === "delete" && onDelete) onDelete(alert.id)
      
      setTimeout(() => {
        setIsProcessing(false)
        onClose()
      }, 500)
    } catch (error) {
      console.error("Error:", error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative w-full max-w-md transform rounded-lg shadow-xl transition-all ${colors.bg} border ${colors.border}`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "inherit" }}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`${colors.text}`} size={24} />
              <h2 className={`text-xl font-bold ${colors.text}`}>Alert Details</h2>
            </div>
            <button onClick={onClose} className={`${colors.text} opacity-50 hover:opacity-100`}>
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            {/* Severity Badge */}
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.badge} ${colors.text}`}
              >
                {alert.severity.toUpperCase()} Severity
              </span>
            </div>

            {/* Alert Type */}
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase">Alert Type</p>
              <p className={`text-lg font-semibold ${colors.text} mt-1`}>{alert.alert_type}</p>
            </div>

            {/* Message */}
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase">Message</p>
              <p className={`${colors.text} mt-1`}>{alert.message}</p>
            </div>

            {/* Description */}
            {alert.description && (
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase">Description</p>
                <p className="text-slate-700 mt-1 text-sm">{alert.description}</p>
              </div>
            )}

            {/* Machine ID */}
            {alert.machine_id && (
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase">Machine</p>
                <p className="text-slate-800 mt-1">{alert.machine_id}</p>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase">Created</p>
                <p className="text-slate-700 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                <p className={`mt-1 font-semibold ${colors.text}`}>{alert.status}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t" style={{ borderColor: "inherit" }}>
              {alert.status !== "acknowledged" && onAcknowledge && (
                <button
                  onClick={() => handleAction("acknowledge")}
                  disabled={isProcessing}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition ${colors.badge} ${colors.text} hover:opacity-80 disabled:opacity-50`}
                >
                  Acknowledge
                </button>
              )}
              {alert.status !== "resolved" && onResolve && (
                <button
                  onClick={() => handleAction("resolve")}
                  disabled={isProcessing}
                  className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-800 hover:opacity-80 disabled:opacity-50 transition"
                >
                  Resolve
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => handleAction("delete")}
                  disabled={isProcessing}
                  className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-800 hover:opacity-80 disabled:opacity-50 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
