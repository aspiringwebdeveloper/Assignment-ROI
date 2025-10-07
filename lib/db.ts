import { randomUUID } from "crypto"
import clientPromise from "./mongodb"

export type ScenarioRecord = {
  id: string
  scenario_name: string
  inputs: any
  results: any
  createdAt: string
  updatedAt: string
}

async function getCollection() {
  const client = await clientPromise
  const db = client.db("roi_simulator")
  return db.collection<ScenarioRecord>("scenarios")
}

export async function readAll(): Promise<ScenarioRecord[]> {
  try {
    const collection = await getCollection()
    const scenarios = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return scenarios.map((s) => ({
      id: s.id,
      scenario_name: s.scenario_name,
      inputs: s.inputs,
      results: s.results,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))
  } catch (error) {
    console.error("Error reading scenarios:", error)
    return []
  }
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
  
  try {
    const collection = await getCollection()
    await collection.insertOne(rec as any)
    return rec
  } catch (error) {
    console.error("Error creating scenario:", error)
    throw error
  }
}

export async function getScenario(id: string) {
  try {
    const collection = await getCollection()
    const scenario = await collection.findOne({ id })
    if (!scenario) return null
    
    return {
      id: scenario.id,
      scenario_name: scenario.scenario_name,
      inputs: scenario.inputs,
      results: scenario.results,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
    }
  } catch (error) {
    console.error("Error getting scenario:", error)
    return null
  }
}

export async function deleteScenario(id: string) {
  try {
    const collection = await getCollection()
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting scenario:", error)
    return false
  }
}
