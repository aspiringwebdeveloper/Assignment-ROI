"use client"

import useSWR from "swr"
import { useCallback, useMemo, useState } from "react"
import { ROIForm, type ROIInputs } from "@/components/roi-form"
import { ResultsCard, type SimulationResults } from "@/components/results-card"
import { ScenariosPanel } from "@/components/scenarios-panel"
import { ThemeToggle } from "@/components/theme-toggle"

const postSimulate = async (_key: string, payload: ROIInputs) => {
  const res = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Simulation failed")
  return res.json()
}

export default function Page() {
  const [inputs, setInputs] = useState<ROIInputs>({
    scenario_name: "",
    monthly_invoice_volume: 2000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.17,
    hourly_wage: 30,
    error_rate_manual: 0.5,
    error_cost: 100,
    time_horizon_months: 36,
    one_time_implementation_cost: 50000,
  })

  const key = useMemo(() => ["simulate", inputs] as const, [inputs])
  const { data, isLoading, mutate } = useSWR(key, ([, payload]) => postSimulate("simulate", payload), {
    keepPreviousData: true,
  })

  const results: SimulationResults | undefined = data?.results

  const runSimulation = useCallback(() => {
    mutate()
  }, [mutate])

  const saveScenario = useCallback(async () => {
    if (!inputs.scenario_name) {
      alert("Please provide a Scenario Name before saving.")
      return
    }
    if (!data?.inputs || !data?.results) {
      alert("Please run a simulation first.")
      return
    }
    const res = await fetch("/api/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario_name: inputs.scenario_name,
        inputs: data.inputs,
        results: data.results,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      alert(err?.error || "Failed to save scenario.")
      return
    }
    alert("Scenario saved.")
  }, [inputs.scenario_name, data])

  const loadScenario = useCallback(async (id: string) => {
    const res = await fetch(`/api/scenarios/${id}`)
    if (!res.ok) return alert("Failed to load scenario.")
    const rec = await res.json()
    // Load inputs then trigger simulate
    setInputs({
      scenario_name: rec.scenario_name || "",
      ...rec.inputs,
    })
  }, [])

  return (
    <main className="container mx-auto p-4 md:p-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-balance">Invoicing ROI Simulator</h1>
          <p className="text-muted-foreground">Estimate savings, payback, and ROI when automating invoice processing.</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ROIForm value={inputs} onChange={setInputs} onSimulate={runSimulation} onSave={saveScenario} />
        </div>
        <div className="lg:col-span-1">
          <ResultsCard results={results} loading={isLoading} />
        </div>
      </section>

      <section className="mt-6">
        <ScenariosPanel onLoad={loadScenario} currentScenario={{ inputs: data?.inputs, results: data?.results }} />
      </section>

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        Built for demo purposes. Results favor automation.
      </footer>
    </main>
  )
}
