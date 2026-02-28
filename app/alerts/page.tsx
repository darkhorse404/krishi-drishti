"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { AlertCenter } from "@/components/alerts/AlertCenter"
import { AlertDetailModal } from "@/components/modals/AlertDetailModal"
import type { Alert } from "@/lib/types"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | undefined>()

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/alerts")
        const data = await res.json()
        setAlerts(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching alerts:", error)
        setLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleAcknowledge = (alertId: string) => {
    console.log("Acknowledge alert:", alertId)
    // TODO: Call API to acknowledge alert
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: "acknowledged" as const } : a))
    if (selectedAlert?.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status: "acknowledged" as const })
    }
  }

  const handleResolve = (alertId: string) => {
    console.log("Resolve alert:", alertId)
    // TODO: Call API to resolve alert
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: "resolved" as const } : a))
    if (selectedAlert?.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status: "resolved" as const })
    }
  }

  const handleDelete = (alertId: string) => {
    console.log("Delete alert:", alertId)
    // TODO: Call API to delete alert
    setAlerts(alerts.filter(a => a.id !== alertId))
    if (selectedAlert?.id === alertId) {
      setShowDetailModal(false)
      setSelectedAlert(undefined)
    }
  }

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert)
    setShowDetailModal(true)
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="lg:ml-64 flex-1 bg-slate-50 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">Alert Center</h1>
          <p className="text-slate-600 mt-2 text-sm lg:text-base">Monitor and manage system alerts</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading alerts...</p>
          </div>
        ) : (
          <AlertCenter
            alerts={alerts}
            onAcknowledge={handleAcknowledge}
            onResolve={handleResolve}
            onDelete={handleDelete}
          />
        )}

        <AlertDetailModal
          isOpen={showDetailModal}
          alert={selectedAlert}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedAlert(undefined)
          }}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}
