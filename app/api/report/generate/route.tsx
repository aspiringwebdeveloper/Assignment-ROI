import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, scenario } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required" }, { status: 400 })
    }
    if (!scenario?.inputs || !scenario?.results) {
      return NextResponse.json({ error: "scenario with inputs and results is required" }, { status: 400 })
    }

    const { inputs, results } = scenario

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>ROI Report - ${inputs.scenario_name || "Scenario"}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #0a0a0a; }
      .wrap { max-width: 720px; margin: 0 auto; padding: 24px; }
      h1 { font-size: 24px; margin: 0 0 8px; }
      h2 { font-size: 18px; margin: 24px 0 8px; }
      .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin: 12px 0; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
      .label { color: #6b7280; }
      .value { font-weight: 600; }
      .muted { color: #6b7280; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>Invoicing Automation ROI Report</h1>
      <div class="muted">Generated for: ${email}</div>

      <div class="card">
        <h2>Scenario</h2>
        <div class="grid">
          <div class="label">Name</div><div class="value">${inputs.scenario_name || "-"}</div>
          <div class="label">Invoices/Month</div><div class="value">${inputs.monthly_invoice_volume}</div>
          <div class="label">AP Staff</div><div class="value">${inputs.num_ap_staff}</div>
          <div class="label">Hours/Invoice</div><div class="value">${inputs.avg_hours_per_invoice}</div>
          <div class="label">Hourly Wage</div><div class="value">₹${inputs.hourly_wage}</div>
          <div class="label">Manual Error Rate</div><div class="value">${inputs.error_rate_manual}</div>
          <div class="label">Error Cost</div><div class="value">₹${inputs.error_cost}</div>
          <div class="label">Horizon (months)</div><div class="value">${inputs.time_horizon_months}</div>
          <div class="label">One-time Cost</div><div class="value">₹${inputs.one_time_implementation_cost || 0}</div>
        </div>
      </div>

      <div class="card">
        <h2>Results</h2>
        <div class="grid">
          <div class="label">Monthly Savings</div><div class="value">₹${results.monthly_savings.toFixed(0)}</div>
          <div class="label">Cumulative Savings</div><div class="value">₹${results.cumulative_savings.toFixed(0)}</div>
          <div class="label">Net Savings</div><div class="value">₹${results.net_savings.toFixed(0)}</div>
          <div class="label">Payback (months)</div><div class="value">${Number.isFinite(results.payback_months) ? results.payback_months.toFixed(2) : "N/A"}</div>
          <div class="label">ROI (%)</div><div class="value">${results.roi_percentage.toFixed(2)}%</div>
        </div>
      </div>

      <p class="muted">This report is a simplified projection favoring automation outcomes.</p>
    </div>
  </body>
</html>`

    const res = new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="roi-report-${Date.now()}.html"`,
      },
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid payload", details: e?.message }, { status: 400 })
  }
}
