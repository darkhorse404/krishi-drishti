import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/admin/live-events
 * Returns recent system events for the live activity ticker
 */
export async function GET(req: NextRequest) {
  try {
    // Check if new tables exist, return empty data if not migrated yet
    try {
      await prisma.$queryRaw`SELECT 1 FROM "UtilizationSession" LIMIT 1`
    } catch (dbError) {
      // Tables don't exist yet - return empty data
      return NextResponse.json({
        success: true,
        events: [],
        message: "Database not migrated yet. Run: npx prisma migrate dev"
      })
    }

    // Fetch recent sessions, alerts, and complaints from last 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const [recentSessions, recentAlerts, recentComplaints] = await Promise.all([
      prisma.utilizationSession.findMany({
        where: {
          createdAt: { gte: oneHourAgo },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          machine: {
            select: {
              registration_number: true,
              machine_type: true,
            },
          },
          panchayat: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.alert.findMany({
        where: {
          created_at: { gte: oneHourAgo },
        },
        orderBy: { created_at: "desc" },
        take: 10,
      }),
      prisma.complaint.findMany({
        where: {
          createdAt: { gte: oneHourAgo },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ])

    // Transform to unified event format
    const events: any[] = []

    recentSessions.forEach((session) => {
      const isEnded = session.end_time !== null

      events.push({
        id: `session-${session.id}`,
        type: isEnded ? "session_ended" : "session_started",
        message: isEnded
          ? `Work session ended for ${session.machine?.machine_type || "machine"} ${
              session.machine?.registration_number || ""
            } in ${session.panchayat?.name || "unknown panchayat"}`
          : `New work session started for ${session.machine?.machine_type || "machine"} ${
              session.machine?.registration_number || ""
            } in ${session.panchayat?.name || "unknown panchayat"}`,
        timestamp: session.createdAt.toISOString(),
        severity: "low",
      })
    })

    recentAlerts.forEach((alert) => {
      events.push({
        id: `alert-${alert.id}`,
        type: "alert",
        message: alert.message,
        timestamp: alert.created_at.toISOString(),
        severity: alert.severity,
      })
    })

    recentComplaints.forEach((complaint) => {
      events.push({
        id: `complaint-${complaint.id}`,
        type: "complaint",
        message: `New complaint: ${complaint.type} from ${complaint.reporter_name}`,
        timestamp: complaint.createdAt.toISOString(),
        severity: "medium",
      })
    })

    // Sort all events by timestamp (most recent first)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Return top 20 events
    return NextResponse.json({
      success: true,
      events: events.slice(0, 20),
    })
  } catch (error) {
    console.error("Live events error:", error)
    return NextResponse.json({ error: "Failed to fetch live events" }, { status: 500 })
  }
}
