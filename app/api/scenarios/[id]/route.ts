import { NextResponse } from "next/server"
import { deleteScenario, getScenario } from "@/lib/db"

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const rec = await getScenario(params.id)
  if (!rec) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(rec)
}

export async function DELETE(_req: Request, { params }: Params) {
  const ok = await deleteScenario(params.id)
  return NextResponse.json({ deleted: ok })
}
