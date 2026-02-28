import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state")
    const district = searchParams.get("district")

    const where: any = {}
    if (state) where.state = state
    if (district) where.district = district

    const chcs = await prisma.operator.findMany({
      where,
      include: {
        _count: {
          select: {
            machines: true,
            usageLogs: true
          },
        },
        machines: true,
      },
      take: 100,
    })

    return Response.json(chcs)
  } catch (error) {
    console.error("Error fetching CHCs:", error)
    return Response.json({ error: "Failed to fetch CHCs" }, { status: 500 })
  }
}
