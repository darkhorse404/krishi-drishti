import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/admin/heatmap-data
 * Returns machine activity heatmap data based on recent telemetry
 */
export async function GET(req: NextRequest) {
  try {
    // Check if new tables exist, return empty data if not migrated yet
    try {
      await prisma.$queryRaw`SELECT 1 FROM "TelemetryLog" LIMIT 1`
    } catch (dbError) {
      return NextResponse.json({
        success: true,
        points: [],
        total_logs: 0,
        unique_locations: 0,
        message: "Database not migrated yet. Run: npx prisma migrate dev"
      })
    }

    // Fetch telemetry data from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const telemetryLogs = await prisma.telemetryLog.findMany({
      where: {
        recorded_at: { gte: twentyFourHoursAgo },
        status: { in: ["ACTIVE", "MOVING"] },
      },
      select: {
        latitude: true,
        longitude: true,
        status: true,
      },
    })

    // Aggregate points by grid (0.1 degree precision)
    const gridMap = new Map<string, { lat: number; lng: number; count: number }>()

    telemetryLogs.forEach((log) => {
      const gridLat = Math.round(log.latitude * 10) / 10
      const gridLng = Math.round(log.longitude * 10) / 10
      const key = `${gridLat},${gridLng}`

      if (gridMap.has(key)) {
        const existing = gridMap.get(key)!
        existing.count += 1
      } else {
        gridMap.set(key, { lat: gridLat, lng: gridLng, count: 1 })
      }
    })

    // Convert to heatmap points with normalized intensity
    const maxCount = Math.max(...Array.from(gridMap.values()).map((p) => p.count), 1)

    const points = Array.from(gridMap.values()).map((point) => ({
      lat: point.lat,
      lng: point.lng,
      intensity: point.count / maxCount, // Normalize to 0-1
    }))

    return NextResponse.json({
      success: true,
      points,
      total_logs: telemetryLogs.length,
      unique_locations: points.length,
    })
  } catch (error) {
    console.error("Heatmap data error:", error)
    return NextResponse.json({ error: "Failed to generate heatmap data" }, { status: 500 })
  }
}
