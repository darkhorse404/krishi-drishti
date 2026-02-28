import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/cron/close-sessions
 * Automated cron job to close stale utilization sessions
 * Should be triggered every 15 minutes via external cron service (e.g., Vercel Cron)
 * 
 * Closes sessions that:
 * 1. Have no end_time (still open)
 * 2. Last telemetry shows IDLE/OFFLINE status for >15 minutes
 * 3. No recent telemetry in past 15 minutes
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

    // Find all open sessions
    const openSessions = await prisma.utilizationSession.findMany({
      where: {
        end_time: null,
      },
      include: {
        machine: {
          include: {
            telemetryLogs: {
              orderBy: { timestamp: "desc" },
              take: 1,
            },
          },
        },
      },
    })

    const sessionsToClose: string[] = []
    const closureReasons: Record<string, string> = {}

    for (const session of openSessions) {
      const latestTelemetry = session.machine.telemetryLogs[0]

      let shouldClose = false
      let reason = ""

      if (!latestTelemetry) {
        // No telemetry at all - close very old sessions (>30 min)
        if (new Date(session.start_time) < thirtyMinutesAgo) {
          shouldClose = true
          reason = "No telemetry data available"
        }
      } else {
        const telemetryAge = Date.now() - new Date(latestTelemetry.timestamp).getTime()

        // Close if no recent telemetry (>15 minutes old)
        if (telemetryAge > 15 * 60 * 1000) {
          shouldClose = true
          reason = "No recent telemetry (stale data)"
        }
        // Close if status is IDLE or OFFLINE for >15 minutes
        else if (
          (latestTelemetry.status === "IDLE" || latestTelemetry.status === "OFFLINE") &&
          new Date(latestTelemetry.timestamp) < fifteenMinutesAgo
        ) {
          shouldClose = true
          reason = `Machine ${latestTelemetry.status.toLowerCase()} for >15 minutes`
        }
      }

      if (shouldClose) {
        sessionsToClose.push(session.id)
        closureReasons[session.id] = reason
      }
    }

    // Bulk close sessions
    const closedSessions = []

    for (const sessionId of sessionsToClose) {
      const session = openSessions.find((s) => s.id === sessionId)!

      // Get last known position from telemetry or use start position
      const lastTelemetry = session.machine.telemetryLogs[0]
      const endLat = lastTelemetry?.latitude || session.start_lat
      const endLng = lastTelemetry?.longitude || session.start_lng

      await prisma.utilizationSession.update({
        where: { id: sessionId },
        data: {
          end_time: new Date(),
          end_lat: endLat,
          end_lng: endLng,
          notes: `Auto-closed by cron: ${closureReasons[sessionId]}`,
        },
      })

      closedSessions.push({
        session_id: sessionId,
        machine_id: session.machine_id,
        reason: closureReasons[sessionId],
      })

      // Create alert for auto-closed session
      await prisma.alert.create({
        data: {
          machine_id: session.machine_id,
          panchayat_id: session.panchayat_id,
          alert_type: "session_anomaly",
          severity: "low",
          status: "open",
          message: `Session auto-closed for machine ${session.machine.registration_number}`,
          description: `Session was automatically closed due to: ${closureReasons[sessionId]}. Duration: ${Math.floor((Date.now() - new Date(session.start_time).getTime()) / (1000 * 60))} minutes`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        total_open_sessions: openSessions.length,
        sessions_closed: closedSessions.length,
      },
      closed_sessions: closedSessions,
    })
  } catch (error) {
    console.error("Session closure cron error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to close stale sessions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cron/close-sessions
 * Manual trigger endpoint (for testing or emergency closures)
 */
export async function POST(req: NextRequest) {
  // Reuse the same logic as GET
  return GET(req)
}
