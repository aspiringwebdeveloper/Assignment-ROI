import { NextResponse } from "next/server"
import { createScenario, readAll } from "@/lib/db"

export async function GET() {
  const all = await readAll()
  // return lighter list view
  return NextResponse.json(
    all.map((s) => ({
      id: s.id,
      scenario_name: s.scenario_name,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    })),
  )
}

export async function POST(req: Request) {
  try {
    const { scenario_name, inputs, results } = await req.json()

    if (!scenario_name || typeof scenario_name !== "string") {
      return NextResponse.json({ error: "scenario_name is required" }, { status: 400 })
    }

    if (!inputs || !results) {
      return NextResponse.json({ error: "inputs and results are required" }, { status: 400 })
    }

    const rec = await createScenario({ scenario_name, inputs, results })
    return NextResponse.json(rec, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid payload", details: e?.message }, { status: 400 })
  }
}
