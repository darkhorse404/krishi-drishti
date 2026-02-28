import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")

    const where: any = {}
    if (status) where.status = status
    if (severity) where.severity = severity

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        machine: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    })

    return Response.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return Response.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
