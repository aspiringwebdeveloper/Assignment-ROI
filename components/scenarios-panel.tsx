"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type ScenarioListItem = {
  id: string
  scenario_name: string
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ScenariosPanel({
  onLoad,
  currentScenario,
}: {
  onLoad: (id: string) => void
  currentScenario?: { inputs: any; results: any }
}) {
  const { data, mutate, isLoading } = useSWR<ScenarioListItem[]>("/api/scenarios", fetcher)
  const [email, setEmail] = useState("")

  async function onDelete(id: string) {
    await fetch(`/api/scenarios/${id}`, { method: "DELETE" })
    mutate()
  }

  async function downloadReport() {
    if (!email) return alert("Please enter your email to generate the report.")
    if (!currentScenario?.inputs || !currentScenario?.results) {
      return alert("Please run a simulation first.")
    }
    const res = await fetch("/api/report/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, scenario: currentScenario }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return alert(err?.error || "Failed to generate report.")
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `roi-report-${Date.now()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-balance">Saved Scenarios</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground" htmlFor="report-email">
            Enter email to download report
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="report-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={downloadReport}>Download Report</Button>
          </div>
        </div>
        {isLoading && <div className="text-muted-foreground">Loading...</div>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="text-muted-foreground">No scenarios saved yet.</div>
        )}
        <div className="grid gap-2">
          {data?.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-md border p-3">
              <div className="min-w-0">
                <div className="font-medium">{s.scenario_name}</div>
                <div className="text-xs text-muted-foreground">Created {new Date(s.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => onLoad(s.id)}>
                  Load
                </Button>
                <Button variant="destructive" onClick={() => onDelete(s.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
