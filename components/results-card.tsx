"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type SimulationResults = {
  monthly_savings: number
  cumulative_savings: number
  net_savings: number
  payback_months: number
  roi_percentage: number
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n)
}

export function ResultsCard({
  results,
  loading,
}: {
  results?: SimulationResults
  loading?: boolean
}) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-balance">Results</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {!results && !loading && <div className="text-muted-foreground">Enter inputs to see results.</div>}
        {loading && <div className="text-muted-foreground">Calculating...</div>}
        {results && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Metric label="Monthly Savings" value={fmtMoney(results.monthly_savings)} />
            <Metric label="Cumulative Savings" value={fmtMoney(results.cumulative_savings)} />
            <Metric label="Net Savings" value={fmtMoney(results.net_savings)} />
            <Metric
              label="Payback (months)"
              value={Number.isFinite(results.payback_months) ? results.payback_months.toFixed(2) : "N/A"}
            />
            <Metric label="ROI (%)" value={`${results.roi_percentage.toFixed(2)}%`} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}
