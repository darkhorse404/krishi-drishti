import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/admin/utilization-audit
 * Returns Panchayat utilization data for audit chart
 */
export async function GET(req: NextRequest) {
  try {
    // Check if new tables exist, return empty data if not migrated yet
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Panchayat" LIMIT 1`
    } catch (dbError) {
      return NextResponse.json({
        success: true,
        panchayats: [],
        message: "Database not migrated yet. Run: npx prisma migrate dev"
      })
    }

    const { searchParams } = new URL(req.url)
    const state = searchParams.get("state")
    const limit = parseInt(searchParams.get("limit") || "10")

    // Build filter
    const where: any = {}
    if (state) where.state = state

    // Fetch Panchayats with session statistics
    const panchayats = await prisma.panchayat.findMany({
      where,
      orderBy: { utilization_score: "desc" },
      take: Math.min(limit, 50),
      include: {
        sessions: {
          where: {
            verified_by_panchayat: true,
            end_time: { not: null },
          },
          select: {
            acres_covered: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    })

    // Transform to audit format
    const auditData = panchayats.map((panchayat) => ({
      panchayat_name: panchayat.name,
      district: panchayat.district,
      state: panchayat.state,
      sessions_count: panchayat._count.sessions,
      total_acres: panchayat.sessions.reduce((sum, s) => sum + (s.acres_covered || 0), 0),
      utilization_score: panchayat.utilization_score,
      rank: panchayat.rank || null,
    }))

    return NextResponse.json({
      success: true,
      panchayats: auditData,
    })
  } catch (error) {
    console.error("Utilization audit error:", error)
    return NextResponse.json(
      { error: "Failed to fetch utilization audit data" },
      { status: 500 }
    )
  }
}
