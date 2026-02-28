import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { TelemetryStatus } from "@/lib/types"

/**
 * POST /api/iot/telemetry
 * Ingests IoT telemetry data from GPS devices on machines
 * Auto-creates UtilizationSession when machine transitions IDLE → ACTIVE
 * Auto-closes UtilizationSession when machine transitions ACTIVE → IDLE/OFFLINE
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required fields
    const {
      gps_device_id,
      latitude,
      longitude,
      speed,
      heading,
      ignition_status,
      vibration_level,
      rpm,
      timestamp
    } = body

    if (!gps_device_id || latitude === undefined || longitude === undefined || ignition_status === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: gps_device_id, latitude, longitude, ignition_status" },
        { status: 400 }
      )
    }

    // Find machine by GPS device ID
    const machine = await prisma.machine.findUnique({
      where: { gps_device_id },
      include: {
        chc: true,
        sessions: {
          where: { end_time: null },
          orderBy: { start_time: 'desc' },
          take: 1
        }
      }
    })

    if (!machine) {
      return NextResponse.json(
        { error: `Machine with GPS device ID ${gps_device_id} not found` },
        { status: 404 }
      )
    }

    // Determine telemetry status based on sensor data
    let status: TelemetryStatus = "IDLE"
    
    if (!ignition_status) {
      status = "OFFLINE"
    } else if (ignition_status && (speed || 0) > 0.5 && (rpm || 0) > 100) {
      status = "ACTIVE" // Ignition ON + Moving + Engine working
    } else if (ignition_status && (rpm || 0) > 100) {
      status = "MOVING" // Ignition ON + Engine working but not moving (e.g., stationary tillage)
    } else if (ignition_status) {
      status = "IDLE" // Ignition ON but no activity
    }

    // Get previous telemetry status to detect state changes
    const previousTelemetry = await prisma.telemetryLog.findFirst({
      where: { machine_id: machine.id },
      orderBy: { timestamp: 'desc' },
      take: 1
    })

    const previousStatus = previousTelemetry?.status as TelemetryStatus | undefined

    // Create telemetry log entry
    const telemetryLog = await prisma.telemetryLog.create({
      data: {
        machine_id: machine.id,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speed: speed !== undefined ? parseFloat(speed) : null,
        heading: heading !== undefined ? parseFloat(heading) : null,
        ignition_status,
        vibration_level: vibration_level !== undefined ? parseFloat(vibration_level) : null,
        rpm: rpm !== undefined ? parseInt(rpm) : null,
        status
      }
    })

    // Session Auto-Management Logic
    const activeSession = machine.sessions[0]
    let sessionAction = null

    // AUTO-CREATE SESSION: IDLE/OFFLINE → ACTIVE/MOVING
    if (
      previousStatus &&
      (previousStatus === "IDLE" || previousStatus === "OFFLINE") &&
      (status === "ACTIVE" || status === "MOVING") &&
      !activeSession
    ) {
      // Create new utilization session
      const newSession = await prisma.utilizationSession.create({
        data: {
          machine_id: machine.id,
          panchayat_id: machine.chc.panchayat_id || "", // Will be validated later
          start_time: new Date(timestamp || Date.now()),
          start_lat: parseFloat(latitude),
          start_lng: parseFloat(longitude),
          operator_id: machine.operator_id || null,
          verified: false
        }
      })

      sessionAction = { type: "session_started", session_id: newSession.id }

      // Create governance alert for new session
      await prisma.alert.create({
        data: {
          machine_id: machine.id,
          panchayat_id: machine.chc.panchayat_id,
          alert_type: "session_anomaly",
          severity: "low",
          status: "open",
          message: `New work session started for ${machine.machine_type} ${machine.registration_number}`,
          description: `Session auto-created at (${latitude}, ${longitude}). Operator: ${machine.operator_id || "Unknown"}`
        }
      })
    }

    // AUTO-CLOSE SESSION: ACTIVE/MOVING → IDLE/OFFLINE for >10 minutes
    if (
      activeSession &&
      (status === "IDLE" || status === "OFFLINE") &&
      (previousStatus === "ACTIVE" || previousStatus === "MOVING")
    ) {
      const sessionDuration = Date.now() - new Date(activeSession.start_time).getTime()
      const MINIMUM_SESSION_DURATION = 10 * 60 * 1000 // 10 minutes

      if (sessionDuration >= MINIMUM_SESSION_DURATION) {
        // Close the session
        await prisma.utilizationSession.update({
          where: { id: activeSession.id },
          data: {
            end_time: new Date(timestamp || Date.now()),
            end_lat: parseFloat(latitude),
            end_lng: parseFloat(longitude)
          }
        })

        sessionAction = { type: "session_closed", session_id: activeSession.id }

        // Update machine last_active timestamp
        await prisma.machine.update({
          where: { id: machine.id },
          data: { last_active: new Date() }
        })
      }
    }

    // Update machine location and status
    await prisma.machine.update({
      where: { id: machine.id },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: status === "ACTIVE" || status === "MOVING" ? "active" : status === "IDLE" ? "idle" : "offline",
        last_active: new Date()
      }
    })

    // Also create/update MachinePosition for map tracking
    await prisma.machinePosition.create({
      data: {
        machine_id: machine.id,
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        timestamp: new Date(timestamp || Date.now()),
        speed: speed !== undefined ? parseFloat(speed) : null,
        heading: heading !== undefined ? parseFloat(heading) : null
      }
    })

    return NextResponse.json({
      success: true,
      telemetry_id: telemetryLog.id,
      status,
      session_action: sessionAction,
      message: sessionAction
        ? sessionAction.type === "session_started"
          ? "Telemetry received and new session started"
          : "Telemetry received and session closed"
        : "Telemetry received"
    })

  } catch (error) {
    console.error("Telemetry ingestion error:", error)
    return NextResponse.json(
      { 
        error: "Failed to process telemetry data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/iot/telemetry?machine_id=xxx&limit=100
 * Retrieves recent telemetry logs for a machine
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const machine_id = searchParams.get("machine_id")
    const limit = parseInt(searchParams.get("limit") || "100")

    if (!machine_id) {
      return NextResponse.json(
        { error: "Missing required parameter: machine_id" },
        { status: 400 }
      )
    }

    const logs = await prisma.telemetryLog.findMany({
      where: { machine_id },
      orderBy: { timestamp: 'desc' },
      take: Math.min(limit, 1000), // Cap at 1000 records
      include: {
        machine: {
          select: {
            registration_number: true,
            machine_type: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      count: logs.length,
      data: logs
    })

  } catch (error) {
    console.error("Telemetry retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve telemetry data" },
      { status: 500 }
    )
  }
}
