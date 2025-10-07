"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type ROIInputs = {
  scenario_name: string
  monthly_invoice_volume: number
  num_ap_staff: number
  avg_hours_per_invoice: number
  hourly_wage: number
  error_rate_manual: number
  error_cost: number
  time_horizon_months: number
  one_time_implementation_cost?: number
}

export function ROIForm({
  value,
  onChange,
  onSimulate,
  onSave,
}: {
  value: ROIInputs
  onChange: (v: ROIInputs) => void
  onSimulate: () => void
  onSave: () => void
}) {
  const [local, setLocal] = useState(value)

  // keep parent in sync when local changes
  useMemo(() => {
    onChange(local)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local])

  function num(v: string) {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-balance">ROI Simulation Inputs</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="scenario_name">Scenario Name</Label>
          <Input
            id="scenario_name"
            placeholder="e.g. Q4_Pilot"
            value={local.scenario_name}
            onChange={(e) => setLocal({ ...local, scenario_name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="monthly_invoice_volume">Invoices / Month</Label>
            <Input
              id="monthly_invoice_volume"
              type="number"
              min={0}
              step={1}
              value={local.monthly_invoice_volume}
              onChange={(e) => setLocal({ ...local, monthly_invoice_volume: num(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="num_ap_staff">AP Staff</Label>
            <Input
              id="num_ap_staff"
              type="number"
              min={0}
              step={1}
              value={local.num_ap_staff}
              onChange={(e) => setLocal({ ...local, num_ap_staff: num(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avg_hours_per_invoice">Hours / Invoice</Label>
            <Input
              id="avg_hours_per_invoice"
              type="number"
              min={0}
              step={0.01}
              value={local.avg_hours_per_invoice}
              onChange={(e) => setLocal({ ...local, avg_hours_per_invoice: num(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hourly_wage">Hourly Wage ($)</Label>
            <Input
              id="hourly_wage"
              type="number"
              min={0}
              step={1}
              value={local.hourly_wage}
              onChange={(e) => setLocal({ ...local, hourly_wage: num(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="error_rate_manual">Manual Error Rate</Label>
            <Input
              id="error_rate_manual"
              type="number"
              min={0}
              step={0.01}
              value={local.error_rate_manual}
              onChange={(e) => setLocal({ ...local, error_rate_manual: num(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="error_cost">Error Fix Cost ($)</Label>
            <Input
              id="error_cost"
              type="number"
              min={0}
              step={1}
              value={local.error_cost}
              onChange={(e) => setLocal({ ...local, error_cost: num(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time_horizon_months">Horizon (months)</Label>
            <Input
              id="time_horizon_months"
              type="number"
              min={1}
              step={1}
              value={local.time_horizon_months}
              onChange={(e) => setLocal({ ...local, time_horizon_months: num(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="one_time_implementation_cost">One-time Cost ($)</Label>
            <Input
              id="one_time_implementation_cost"
              type="number"
              min={0}
              step={1}
              value={local.one_time_implementation_cost || 0}
              onChange={(e) =>
                setLocal({
                  ...local,
                  one_time_implementation_cost: num(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onSimulate}>Run Simulation</Button>
          <Button variant="secondary" onClick={onSave}>
            Save Scenario
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
