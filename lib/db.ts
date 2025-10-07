import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

export type ScenarioRecord = {
  id: string
  scenario_name: string
  inputs: any
  results: any
  createdAt: string
  updatedAt: string
}

const dataDir = path.join(process.cwd(), "data")
const dbFile = path.join(dataDir, "scenarios.json")

async function ensureFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    await fs.access(dbFile)
  } catch {
    await fs.writeFile(dbFile, JSON.stringify([]), "utf8")
  }
}

export async function readAll(): Promise<ScenarioRecord[]> {
  await ensureFile()
  const raw = await fs.readFile(dbFile, "utf8")
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function writeAll(list: ScenarioRecord[]) {
  await ensureFile()
  await fs.writeFile(dbFile, JSON.stringify(list, null, 2), "utf8")
}

export async function createScenario(payload: {
  scenario_name: string
  inputs: any
  results: any
}) {
  const now = new Date().toISOString()
  const rec: ScenarioRecord = {
    id: randomUUID(),
    scenario_name: payload.scenario_name,
    inputs: payload.inputs,
    results: payload.results,
    createdAt: now,
    updatedAt: now,
  }
  const all = await readAll()
  all.push(rec)
  await writeAll(all)
  return rec
}

export async function getScenario(id: string) {
  const all = await readAll()
  return all.find((s) => s.id === id) || null
}

export async function deleteScenario(id: string) {
  const all = await readAll()
  const next = all.filter((s) => s.id !== id)
  await writeAll(next)
  return all.length !== next.length
}
