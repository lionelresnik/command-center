import { NextRequest, NextResponse } from "next/server"
import { getMissions, createMission } from "@/lib/db/queries"

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("projectId") ?? undefined
    const data = await getMissions(projectId)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.goal || !body.projectId) {
      return NextResponse.json({ error: "goal and projectId required" }, { status: 400 })
    }
    const mission = await createMission(body)
    return NextResponse.json(mission, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
