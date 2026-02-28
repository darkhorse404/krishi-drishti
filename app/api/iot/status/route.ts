import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/iot/status
 * Real-time polling endpoint for machine status updates
 * Returns current machine status aggregated from latest telemetry
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const machineIds = searchParams.get("machine_ids")?.split(",") || []
    const panchayatId = searchParams.get("panchayat_id")
    const state = searchParams.get("state")

    // Build filter
    const where: any = {}
    if (machineIds.length > 0) {
      where.id = { in: machineIds }
    }
    if (state) {
      where.state = state
    }
    if (panchayatId) {
      where.chc = { panchayat_id: panchayatId }
    }

    // Fetch machines with latest telemetry
    const machines = await prisma.machine.findMany({
      where,
      select: {
        id: true,
        registration_number: true,
        machine_type: true,
        status: true,
        latitude: true,
        longitude: true,
        last_active: true,
        telemetryLogs: {
          orderBy: { timestamp: "desc" },
          take: 1,
          select: {
            status: true,
            timestamp: true,
            ignition_status: true,
            speed: true,
            rpm: true,
          },
        },
        sessions: {
          where: { end_time: null },
          take: 1,
          select: {
            id: true,
            start_time: true,
            farmer_name: true,
          },
        },
      },
    })

    // Transform to status response
    const statusData = machines.map((machine) => {
      const latestTelemetry = machine.telemetryLogs[0]
      const activeSession = machine.sessions[0]

      // Determine real-time status
      let realTimeStatus = "offline"
      if (latestTelemetry) {
        const timeSinceLastUpdate = Date.now() - new Date(latestTelemetry.timestamp).getTime()
        const isRecent = timeSinceLastUpdate < 5 * 60 * 1000 // Within 5 minutes

        if (isRecent) {
          realTimeStatus = latestTelemetry.status.toLowerCase()
        }
      }

      return {
        machine_id: machine.id,
        registration_number: machine.registration_number,
        machine_type: machine.machine_type,
        status: realTimeStatus,
        location: {
          lat: machine.latitude,
          lng: machine.longitude,
        },
        last_updated: latestTelemetry?.timestamp || machine.last_active,
        telemetry: latestTelemetry
          ? {
              ignition_on: latestTelemetry.ignition_status,
              speed: latestTelemetry.speed,
              rpm: latestTelemetry.rpm,
            }
          : null,
        active_session: activeSession
          ? {
              session_id: activeSession.id,
              started_at: activeSession.start_time,
              farmer_name: activeSession.farmer_name,
              duration_minutes: Math.floor(
                (Date.now() - new Date(activeSession.start_time).getTime()) / (1000 * 60)
              ),
            }
          : null,
      }
    })

    // Aggregate summary statistics
    const summary = {
      total: statusData.length,
      active: statusData.filter((m) => m.status === "active").length,
      moving: statusData.filter((m) => m.status === "moving").length,
      idle: statusData.filter((m) => m.status === "idle").length,
      offline: statusData.filter((m) => m.status === "offline").length,
      with_active_session: statusData.filter((m) => m.active_session !== null).length,
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      machines: statusData,
    })
  } catch (error) {
    console.error("Status API error:", error)
    return NextResponse.json({ error: "Failed to fetch machine status" }, { status: 500 })
  }
}

/**
 * POST /api/iot/status
 * Bulk status update endpoint (for testing or manual overrides)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { machine_id, status } = body

    if (!machine_id || !status) {
      return NextResponse.json(
        { error: "Missing required fields: machine_id, status" },
        { status: 400 }
      )
    }

    // Update machine status
    await prisma.machine.update({
      where: { id: machine_id },
      data: {
        status: status.toLowerCase(),
        last_active: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Machine status updated",
    })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Failed to update machine status" }, { status: 500 })
  }
}
