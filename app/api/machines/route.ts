import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    const where: any = {}

    if (status) where.status = status
    if (type) where.machine_type = type
    if (state) where.state = state

    try {
      const machines = await prisma.machine.findMany({
        where,
        include: {
          chc: true,
        },
        take: 300,
      })

      return Response.json(machines)
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Return empty array if database is not available
      return Response.json([])
    }
  } catch (error) {
    console.error("Error fetching machines:", error)
    return Response.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      registration_number,
      machine_type,
      status,
      chc_id,
      latitude,
      longitude,
      district,
      state,
      fuel_level,
      utilization_rate,
    } = body

    // Validate required fields
    if (!id || !registration_number || !machine_type || !status || !chc_id || !district || !state) {
      return Response.json(
        { error: "Missing required fields: id, registration_number, machine_type, status, chc_id, district, state" },
        { status: 400 }
      )
    }

    // Validate latitude and longitude
    if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
      return Response.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      )
    }

    // Validate that CHC exists
    const chcExists = await prisma.customHiringCentre.findUnique({
      where: { id: chc_id },
    })

    if (!chcExists) {
      return Response.json(
        { error: `Custom Hiring Centre with ID "${chc_id}" does not exist. Please select a valid CHC.` },
        { status: 400 }
      )
    }

    const machine = await prisma.machine.create({
      data: {
        id,
        registration_number,
        machine_type,
        status,
        chc_id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        district,
        state,
        fuel_level: fuel_level ? parseFloat(fuel_level) : 0,
        utilization_rate: utilization_rate ? parseFloat(utilization_rate) : 0,
      },
      include: {
        chc: true,
      },
    })

    return Response.json(machine, { status: 201 })
  } catch (error) {
    console.error("Error creating machine:", error)
    return Response.json(
      { error: "Failed to create machine" },
      { status: 500 }
    )
  }
}
