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
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 20px;
        min-height: 100vh;
      }
      .container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px;
        text-align: center;
      }
      .header h1 {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 10px;
        letter-spacing: -0.5px;
      }
      .header .subtitle {
        font-size: 16px;
        opacity: 0.95;
        font-weight: 400;
      }
      .content {
        padding: 40px;
      }
      .section {
        margin-bottom: 40px;
      }
      .section-title {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 3px solid #667eea;
        display: inline-block;
      }
      .card {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        border: 1px solid #e9ecef;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .grid-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }
      .label {
        color: #6c757d;
        font-size: 14px;
        font-weight: 500;
      }
      .value {
        color: #1a1a1a;
        font-size: 16px;
        font-weight: 700;
      }
      .highlight-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        margin: 30px 0;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      }
      .highlight-card .big-number {
        font-size: 48px;
        font-weight: 800;
        margin: 10px 0;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      }
      .highlight-card .label {
        color: rgba(255,255,255,0.9);
        font-size: 16px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-top: 20px;
      }
      .metric-box {
        background: white;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
      }
      .metric-box:hover {
        border-color: #667eea;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
      }
      .metric-box .metric-value {
        font-size: 32px;
        font-weight: 800;
        color: #667eea;
        margin: 10px 0;
      }
      .metric-box .metric-label {
        color: #6c757d;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .footer {
        background: #f8f9fa;
        padding: 30px 40px;
        text-align: center;
        border-top: 1px solid #e9ecef;
      }
      .footer-text {
        color: #6c757d;
        font-size: 13px;
        line-height: 1.6;
      }
      .badge {
        display: inline-block;
        background: #28a745;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-top: 10px;
      }
      @media print {
        body { background: white; padding: 0; }
        .container { box-shadow: none; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📊 Invoicing Automation ROI Report</h1>
        <div class="subtitle">Generated for: ${email}</div>
        <div class="subtitle" style="margin-top: 5px; opacity: 0.8;">Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <div class="content">
        <!-- Key Highlights -->
        <div class="highlight-card">
          <div class="label">Total ROI Over ${inputs.time_horizon_months} Months</div>
          <div class="big-number">${results.roi_percentage.toFixed(0)}%</div>
          <div class="badge">✓ Highly Profitable Investment</div>
        </div>

        <!-- Key Metrics -->
        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Monthly Savings</div>
            <div class="metric-value">₹${results.monthly_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Payback Period</div>
            <div class="metric-value">${Number.isFinite(results.payback_months) ? results.payback_months.toFixed(1) : "N/A"} mo</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Cumulative Savings</div>
            <div class="metric-value">₹${results.cumulative_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Net Savings</div>
            <div class="metric-value">₹${results.net_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
        </div>

        <!-- Scenario Details -->
        <div class="section">
          <h2 class="section-title">Scenario Details</h2>
          <div class="card">
            <div class="grid">
              <div class="grid-item">
                <span class="label">Scenario Name</span>
                <span class="value">${inputs.scenario_name || "-"}</span>
              </div>
              <div class="grid-item">
                <span class="label">Invoices/Month</span>
                <span class="value">${inputs.monthly_invoice_volume.toLocaleString('en-IN')}</span>
              </div>
              <div class="grid-item">
                <span class="label">AP Staff</span>
                <span class="value">${inputs.num_ap_staff}</span>
              </div>
              <div class="grid-item">
                <span class="label">Hours/Invoice</span>
                <span class="value">${inputs.avg_hours_per_invoice}</span>
              </div>
              <div class="grid-item">
                <span class="label">Hourly Wage</span>
                <span class="value">₹${inputs.hourly_wage.toLocaleString('en-IN')}</span>
              </div>
              <div class="grid-item">
                <span class="label">Manual Error Rate</span>
                <span class="value">${inputs.error_rate_manual}%</span>
              </div>
              <div class="grid-item">
                <span class="label">Error Fix Cost</span>
                <span class="value">₹${inputs.error_cost.toLocaleString('en-IN')}</span>
              </div>
              <div class="grid-item">
                <span class="label">Time Horizon</span>
                <span class="value">${inputs.time_horizon_months} months</span>
              </div>
              <div class="grid-item">
                <span class="label">Implementation Cost</span>
                <span class="value">₹${(inputs.one_time_implementation_cost || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-text">
          <strong>Note:</strong> This report provides a simplified projection of potential cost savings and ROI from automating invoice processing. 
          Results are based on the inputs provided and include optimization factors that favor automation outcomes. 
          Actual results may vary based on specific business conditions and implementation details.
        </div>
        <div class="footer-text" style="margin-top: 15px; font-size: 12px;">
          Generated by Invoicing ROI Simulator • ${new Date().toLocaleString('en-IN')}
        </div>
      </div>
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
