import { NextRequest, NextResponse } from "next/server"
import { getNationalLeaderboard } from "@/lib/actions/leaderboard"

/**
 * GET /api/leaderboard
 * Public endpoint for landing page leaderboard display
 * Returns top 3 and bottom 5 Panchayats
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const state = searchParams.get("state") || undefined

    const leaderboard = state
      ? await getNationalLeaderboard() // Can add state filter later
      : await getNationalLeaderboard()

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Leaderboard API error:", error)
    // Return empty leaderboard if database not migrated yet
    return NextResponse.json({
      top_performers: [],
      bottom_performers: [],
      total_panchayats: 0,
      last_updated: new Date().toISOString(),
      message: "Database not migrated yet. Run: npx prisma migrate dev"
    })
  }
}
