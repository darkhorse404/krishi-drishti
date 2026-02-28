import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const machineId = searchParams.get('machine_id')

        const where: any = {}
        if (machineId) where.machine_id = machineId

        const maintenance = await prisma.maintenanceRecord.findMany({
            where,
            include: {
                machine: true,
            },
            orderBy: { service_date: 'desc' },
            take: 100,
        })

        return NextResponse.json(maintenance)
    } catch (error) {
        console.error('Error fetching maintenance records:', error)
        return NextResponse.json(
            { error: 'Failed to fetch maintenance records' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            machine_id,
            service_type,
            service_date,
            next_due_date,
            cost,
            description,
            technician,
            parts_replaced,
        } = body

        const maintenanceRecord = await prisma.maintenanceRecord.create({
            data: {
                machine_id,
                service_type,
                service_date: new Date(service_date),
                next_due_date: next_due_date ? new Date(next_due_date) : null,
                cost: parseFloat(cost),
                description,
                technician: technician || null,
                parts_replaced: parts_replaced || [],
            },
            include: {
                machine: true,
            },
        })

        return NextResponse.json(maintenanceRecord, { status: 201 })
    } catch (error) {
        console.error('Error creating maintenance record:', error)
        return NextResponse.json(
            { error: 'Failed to create maintenance record' },
            { status: 500 }
        )
    }
}
