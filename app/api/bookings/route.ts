import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const machineId = searchParams.get('machine_id')

        const where: any = {}
        if (machineId) where.machine_id = machineId

        const bookings = await prisma.usageLog.findMany({
            where,
            include: {
                machine: true,
                operator: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            machine_id,
            operator_id,
            start_time,
            end_time,
            area_covered,
            fuel_consumed,
            latitude,
            longitude,
            district,
            state,
            farmer_name,
            farmer_contact,
            village,
            notes,
        } = body

        const booking = await prisma.usageLog.create({
            data: {
                machine_id,
                operator_id,
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                area_covered: parseFloat(area_covered),
                fuel_consumed: parseFloat(fuel_consumed),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                district,
                state,
                farmer_name: farmer_name || null,
                farmer_contact: farmer_contact || null,
                village: village || null,
                notes: notes || null,
            },
            include: {
                machine: true,
                operator: true,
            },
        })

        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}
