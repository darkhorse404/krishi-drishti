import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const machines = await prisma.machine.findMany({
      include: { chc: true },
    })

    const activeMachines = machines.filter((m) => m.status === "active").length
    const idleMachines = machines.filter((m) => m.status === "idle").length
    const maintenanceMachines = machines.filter((m) => m.status === "maintenance").length
    const offlineMachines = machines.filter((m) => m.status === "offline").length

    const avgUtilization =
      machines.length > 0
        ? Math.round(machines.reduce((sum, m) => sum + m.utilization_rate, 0) / machines.length)
        : 0

    // Get state distribution
    const states = machines.reduce(
      (acc, m) => {
        if (!acc[m.state]) {
          acc[m.state] = { state: m.state, machines: 0, utilization: 0 }
        }
        acc[m.state].machines++
        acc[m.state].utilization += m.utilization_rate
        return acc
      },
      {} as Record<string, { state: string; machines: number; utilization: number }>
    )

    const stateDistribution = Object.values(states)
      .map((s) => ({
        ...s,
        utilization: Math.round(s.utilization / s.machines),
      }))
      .sort((a, b) => b.machines - a.machines)

    // Get machine type breakdown
    const typeBreakdown = machines.reduce(
      (acc, m) => {
        const type = m.machine_type
        if (!acc[type]) {
          acc[type] = { type, count: 0, avg_utilization: 0 }
        }
        acc[type].count++
        acc[type].avg_utilization += m.utilization_rate
        return acc
      },
      {} as Record<string, { type: string; count: number; avg_utilization: number }>
    )

    const machineTypeBreakdown = Object.entries(typeBreakdown).reduce(
      (acc, [type, data]) => {
        acc[type] = data.count
        return acc
      },
      {} as Record<string, number>
    )

    // Get CHCs with machine counts
    const chcsWithCounts = await prisma.customHiringCentre.findMany({
      include: {
        _count: {
          select: { machines: true },
        },
      },
      orderBy: { revenue_this_month: "desc" },
      take: 5,
    })

    const topChcs = chcsWithCounts.map((chc) => ({
      id: chc.id,
      name: chc.name,
      machines: chc._count.machines,
      rating: chc.performance_rating,
    }))

    // Get state distribution as object
    const stateDistObj = stateDistribution.reduce(
      (acc, s) => {
        acc[s.state] = s.machines
        return acc
      },
      {} as Record<string, number>
    )

    return Response.json({
      total_machines: machines.length,
      active_machines: activeMachines,
      idle_machines: idleMachines,
      maintenance_machines: maintenanceMachines,
      offline_machines: offlineMachines,
      avg_utilization_rate: avgUtilization,
      avg_fuel_level: machines.length > 0
        ? Math.round((machines.reduce((sum, m) => sum + (m.fuel_level || 0), 0) / machines.length) * 10) / 10
        : 0,
      state_distribution: stateDistObj,
      machine_type_breakdown: machineTypeBreakdown,
      top_chcs: topChcs,
      active_machines_trend: 5,
      predicted_underutilization_risk: 15,
      maintenance_alert_count: maintenanceMachines + offlineMachines,
      fuel_savings_potential: 12,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return Response.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
