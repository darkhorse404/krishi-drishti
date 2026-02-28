import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const state = searchParams.get("state")
        const district = searchParams.get("district")

        const where: any = {}
        if (state) where.state = state
        if (district) where.district = district

        const chcs = await prisma.customHiringCentre.findMany({
            where,
            select: {
                id: true,
                name: true,
                district: true,
                state: true,
                contact_number: true,
                email: true,
            },
            take: 100,
        })

        return Response.json(chcs)
    } catch (error) {
        console.error("Error fetching custom hiring centres:", error)
        return Response.json({ error: "Failed to fetch custom hiring centres" }, { status: 500 })
    }
}
