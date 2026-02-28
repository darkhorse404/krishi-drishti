"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard"
import type { AnalyticsData } from "@/lib/types"

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics")
        const analyticsData = await res.json()
        setData(analyticsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="flex">
      <SidebarNav />
      <main className="ml-64 flex-1 bg-slate-50 min-h-screen p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-2">Comprehensive system performance metrics</p>
        </div>
        
        <AnalyticsDashboard data={data} loading={loading} />
      </main>
    </div>
  )
}
