"use server"

import { prisma } from "@/lib/prisma"

export interface LeaderboardEntry {
  id: string
  name: string
  district: string
  state: string
  utilization_score: number
  rank: number
  medal?: "GOLD" | "SILVER" | "BRONZE"
  total_sessions: number
  total_acres_covered: number
  avg_session_duration_hours: number
}

export interface LeaderboardResult {
  top_performers: LeaderboardEntry[]
  bottom_performers: LeaderboardEntry[]
  total_panchayats: number
  last_updated: string
}

/**
 * Calculate and retrieve Panchayat leaderboard rankings
 * Based on utilization_score which reflects machine usage efficiency
 * Returns top 3 (Gold/Silver/Bronze) and bottom 5 performers
 */
export async function calculateLeaderboard(
  state?: string,
  district?: string
): Promise<LeaderboardResult> {
  try {
    // Build filter conditions
    const where: any = {}
    if (state) where.state = state
    if (district) where.district = district

    // Fetch all Panchayats with their session data
    const panchayats = await prisma.panchayat.findMany({
      where,
      include: {
        sessions: {
          where: {
            verified: true, // Only count verified sessions
            end_time: { not: null }
          }
        },
        _count: {
          select: {
            sessions: true
          }
        }
      },
      orderBy: {
        utilization_score: 'desc'
      }
    })

    // Calculate enhanced metrics for each Panchayat
    const enrichedPanchayats = panchayats.map((panchayat) => {
      const completedSessions = panchayat.sessions.filter(s => s.end_time)
      
      const totalAcresCovered = completedSessions.reduce(
        (sum, session) => sum + (session.acres_covered || 0),
        0
      )

      const totalSessionDurationMs = completedSessions.reduce((sum, session) => {
        if (session.end_time && session.start_time) {
          return sum + (new Date(session.end_time).getTime() - new Date(session.start_time).getTime())
        }
        return sum
      }, 0)

      const avgSessionDurationHours = completedSessions.length > 0
        ? (totalSessionDurationMs / completedSessions.length) / (1000 * 60 * 60)
        : 0

      return {
        id: panchayat.id,
        name: panchayat.name,
        district: panchayat.district,
        state: panchayat.state,
        utilization_score: panchayat.utilization_score,
        rank: 0, // Will be assigned below
        total_sessions: completedSessions.length,
        total_acres_covered: totalAcresCovered,
        avg_session_duration_hours: avgSessionDurationHours
      }
    })

    // Sort by utilization_score descending
    enrichedPanchayats.sort((a, b) => b.utilization_score - a.utilization_score)

    // Assign ranks
    enrichedPanchayats.forEach((p, index) => {
      p.rank = index + 1
    })

    // Update ranks in database (batch update)
    await Promise.all(
      enrichedPanchayats.map(p =>
        prisma.panchayat.update({
          where: { id: p.id },
          data: { rank: p.rank }
        })
      )
    )

    // Extract top 3 performers with medals
    const topPerformers: LeaderboardEntry[] = enrichedPanchayats.slice(0, 3).map((p, index) => ({
      ...p,
      medal: index === 0 ? "GOLD" : index === 1 ? "SILVER" : "BRONZE"
    }))

    // Extract bottom 5 performers
    const bottomPerformers: LeaderboardEntry[] = enrichedPanchayats
      .slice(-5)
      .reverse()
      .map(p => ({ ...p }))

    return {
      top_performers: topPerformers,
      bottom_performers: bottomPerformers,
      total_panchayats: enrichedPanchayats.length,
      last_updated: new Date().toISOString()
    }

  } catch (error) {
    console.error("Leaderboard calculation error:", error)
    throw new Error("Failed to calculate leaderboard")
  }
}

/**
 * Get leaderboard for a specific state
 */
export async function getStateLeaderboard(state: string): Promise<LeaderboardResult> {
  return calculateLeaderboard(state)
}

/**
 * Get leaderboard for a specific district
 */
export async function getDistrictLeaderboard(state: string, district: string): Promise<LeaderboardResult> {
  return calculateLeaderboard(state, district)
}

/**
 * Get national leaderboard (all Panchayats)
 */
export async function getNationalLeaderboard(): Promise<LeaderboardResult> {
  return calculateLeaderboard()
}

/**
 * Update utilization score for a single Panchayat
 * Called when new sessions are verified or metrics change
 */
export async function updatePanchayatScore(panchayat_id: string): Promise<number> {
  try {
    // Fetch all verified sessions for this Panchayat
    const sessions = await prisma.utilizationSession.findMany({
      where: {
        panchayat_id,
        verified: true,
        end_time: { not: null }
      }
    })

    if (sessions.length === 0) {
      await prisma.panchayat.update({
        where: { id: panchayat_id },
        data: { utilization_score: 0 }
      })
      return 0
    }

    // Calculate score based on:
    // 1. Total acres covered (40% weight)
    // 2. Number of sessions (30% weight)
    // 3. Average session duration (20% weight)
    // 4. Subsidy efficiency (10% weight)

    const totalAcres = sessions.reduce((sum, s) => sum + (s.acres_covered || 0), 0)
    const sessionCount = sessions.length
    
    const totalDurationHours = sessions.reduce((sum, s) => {
      if (s.end_time && s.start_time) {
        return sum + (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / (1000 * 60 * 60)
      }
      return sum
    }, 0)
    const avgDurationHours = totalDurationHours / sessionCount

    const totalSubsidy = sessions.reduce((sum, s) => sum + (s.subsidy_amount || 0), 0)
    const subsidyEfficiency = totalAcres > 0 ? totalSubsidy / totalAcres : 0

    // Normalize to 0-100 scale
    const acresScore = Math.min(totalAcres / 100, 1) * 40 // Max 40 points
    const sessionScore = Math.min(sessionCount / 50, 1) * 30 // Max 30 points
    const durationScore = Math.min(avgDurationHours / 8, 1) * 20 // Max 20 points
    const efficiencyScore = Math.min(subsidyEfficiency / 500, 1) * 10 // Max 10 points

    const finalScore = Math.round(acresScore + sessionScore + durationScore + efficiencyScore)

    // Update Panchayat with new score
    await prisma.panchayat.update({
      where: { id: panchayat_id },
      data: { utilization_score: finalScore }
    })

    return finalScore

  } catch (error) {
    console.error("Score update error:", error)
    throw new Error("Failed to update Panchayat score")
  }
}
