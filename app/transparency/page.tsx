"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { TransparencyPortal } from "@/components/transparency/TransparencyPortal"

export default function TransparencyPage() {
  const [stats, setStats] = useState({
    totalMachines: 0,
    farmersSupported: 0,
    landCovered: 0,
    stateCount: 0,
    totalRevenue: 0,
    averageIncome: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics")
        const data = await res.json()

        setStats({
          totalMachines: data.total_machines || 50000,
          farmersSupported: data.active_machines * 1000 || 500000,
          landCovered: data.avg_utilization * 50000 || 5000000,
          stateCount: 28,
          totalRevenue: 5000000000,
          averageIncome: 150000,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const successStories = [
    {
      id: "1",
      title: "Bumper Harvest with Mechanization",
      farmer: "Rajesh Kumar",
      state: "Punjab",
      impact: "Increased yield by 45% using our machinery services",
      imageUrl: "/images/story1.jpg",
    },
    {
      id: "2",
      title: "Time-Saving Agricultural Solutions",
      farmer: "Priya Sharma",
      state: "Maharashtra",
      impact: "Reduced harvest time from 20 days to 5 days",
      imageUrl: "/images/story2.jpg",
    },
    {
      id: "3",
      title: "Sustainable Farming Practices",
      farmer: "Arjun Singh",
      state: "Karnataka",
      impact: "Adopted eco-friendly tillage methods, improved soil health",
      imageUrl: "/images/story3.jpg",
    },
  ]

  const news = [
    {
      id: "1",
      title: "New Fleet Added",
      category: "announcement",
      date: "2025-10-20",
      description: "100 new machines added to fleet",
      imageUrl: "/images/news1.jpg",
    },
    {
      id: "2",
      title: "Farmer Training Program",
      category: "training",
      date: "2025-10-18",
      description: "Successfully trained 500 farmers this month",
      imageUrl: "/images/news2.jpg",
    },
  ]

  if (loading) {
    return (
      <div className="flex">
        <SidebarNav />
        <main className="ml-64 flex-1 bg-slate-50 min-h-screen p-8">
          <p className="text-slate-600">Loading transparency portal...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="lg:ml-64 flex-1 bg-white min-h-screen pt-16 lg:pt-0">
        <TransparencyPortal stats={stats} successStories={successStories} news={news} />
      </main>
    </div>
  )
}
