import { NextResponse } from "next/server"
import { deleteScenario, getScenario } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const rec = await getScenario(id)
  if (!rec) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(rec)
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const ok = await deleteScenario(id)
  return NextResponse.json({ deleted: ok })
}
