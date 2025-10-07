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
    <title>ROI Analysis Report - ${inputs.scenario_name || "Scenario"}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Arial', 'Helvetica', sans-serif;
        background: #f5f5f5;
        padding: 30px 20px;
        color: #333;
      }
      .container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        background: #2c3e50;
        color: white;
        padding: 40px;
        border-bottom: 4px solid #34495e;
      }
      .header h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }
      .header .meta {
        font-size: 14px;
        opacity: 0.9;
        margin-top: 5px;
      }
      .content {
        padding: 40px;
      }
      .executive-summary {
        background: #ecf0f1;
        border-left: 4px solid #2c3e50;
        padding: 25px 30px;
        margin-bottom: 35px;
      }
      .executive-summary h2 {
        font-size: 18px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .executive-summary .roi-highlight {
        font-size: 42px;
        font-weight: 800;
        color: #27ae60;
        margin: 15px 0;
        text-align: center;
      }
      .executive-summary .roi-label {
        text-align: center;
        color: #555;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .section {
        margin-bottom: 35px;
      }
      .section-title {
        font-size: 18px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 20px;
        padding-bottom: 8px;
        border-bottom: 2px solid #bdc3c7;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .metrics-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 25px;
      }
      .metrics-table th {
        background: #34495e;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .metrics-table td {
        padding: 12px;
        border-bottom: 1px solid #ecf0f1;
        font-size: 14px;
      }
      .metrics-table tr:hover {
        background: #f8f9fa;
      }
      .metrics-table .label-col {
        color: #555;
        font-weight: 500;
        width: 50%;
      }
      .metrics-table .value-col {
        color: #2c3e50;
        font-weight: 700;
        text-align: right;
      }
      .key-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 30px;
      }
      .metric-card {
        background: white;
        border: 2px solid #ecf0f1;
        padding: 20px;
        text-align: center;
      }
      .metric-card .value {
        font-size: 24px;
        font-weight: 800;
        color: #2c3e50;
        margin-bottom: 8px;
      }
      .metric-card .label {
        font-size: 11px;
        color: #7f8c8d;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .footer {
        background: #ecf0f1;
        padding: 25px 40px;
        border-top: 2px solid #bdc3c7;
      }
      .footer-text {
        color: #555;
        font-size: 12px;
        line-height: 1.6;
        text-align: justify;
      }
      .footer-meta {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #bdc3c7;
        text-align: center;
        font-size: 11px;
        color: #7f8c8d;
      }
      .status-badge {
        display: inline-block;
        background: #27ae60;
        color: white;
        padding: 5px 15px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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
      <!-- Header -->
      <div class="header">
        <h1>INVOICING AUTOMATION ROI ANALYSIS</h1>
        <div class="meta">Report Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div class="meta">Prepared for: ${email}</div>
      </div>

      <div class="content">
        <!-- Executive Summary -->
        <div class="executive-summary">
          <h2>Executive Summary</h2>
          <div class="roi-label">Return on Investment (${inputs.time_horizon_months} Months)</div>
          <div class="roi-highlight">${results.roi_percentage.toFixed(0)}%</div>
          <div class="status-badge">HIGHLY PROFITABLE INVESTMENT</div>
        </div>

        <!-- Key Financial Metrics -->
        <div class="section">
          <h2 class="section-title">Key Financial Metrics</h2>
          <div class="key-metrics">
            <div class="metric-card">
              <div class="value">₹${results.monthly_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              <div class="label">Monthly Savings</div>
            </div>
            <div class="metric-card">
              <div class="value">${Number.isFinite(results.payback_months) ? results.payback_months.toFixed(1) : "N/A"}</div>
              <div class="label">Payback (Months)</div>
            </div>
            <div class="metric-card">
              <div class="value">₹${results.cumulative_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              <div class="label">Total Savings</div>
            </div>
            <div class="metric-card">
              <div class="value">₹${results.net_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              <div class="label">Net Benefit</div>
            </div>
          </div>
        </div>

        <!-- Scenario Parameters -->
        <div class="section">
          <h2 class="section-title">Scenario Parameters</h2>
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th style="text-align: right;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="label-col">Scenario Name</td>
                <td class="value-col">${inputs.scenario_name || "-"}</td>
              </tr>
              <tr>
                <td class="label-col">Monthly Invoice Volume</td>
                <td class="value-col">${inputs.monthly_invoice_volume.toLocaleString('en-IN')} invoices</td>
              </tr>
              <tr>
                <td class="label-col">Accounts Payable Staff</td>
                <td class="value-col">${inputs.num_ap_staff} employees</td>
              </tr>
              <tr>
                <td class="label-col">Processing Time per Invoice</td>
                <td class="value-col">${inputs.avg_hours_per_invoice} hours</td>
              </tr>
              <tr>
                <td class="label-col">Average Hourly Wage</td>
                <td class="value-col">₹${inputs.hourly_wage.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td class="label-col">Manual Error Rate</td>
                <td class="value-col">${inputs.error_rate_manual}%</td>
              </tr>
              <tr>
                <td class="label-col">Error Correction Cost</td>
                <td class="value-col">₹${inputs.error_cost.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td class="label-col">Analysis Time Horizon</td>
                <td class="value-col">${inputs.time_horizon_months} months</td>
              </tr>
              <tr>
                <td class="label-col">One-Time Implementation Cost</td>
                <td class="value-col">₹${(inputs.one_time_implementation_cost || 0).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Financial Results -->
        <div class="section">
          <h2 class="section-title">Financial Analysis Results</h2>
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th style="text-align: right;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="label-col">Monthly Cost Savings</td>
                <td class="value-col">₹${results.monthly_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td class="label-col">Cumulative Savings (${inputs.time_horizon_months} months)</td>
                <td class="value-col">₹${results.cumulative_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td class="label-col">Net Savings (After Implementation)</td>
                <td class="value-col">₹${results.net_savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td class="label-col">Payback Period</td>
                <td class="value-col">${Number.isFinite(results.payback_months) ? results.payback_months.toFixed(2) : "N/A"} months</td>
              </tr>
              <tr>
                <td class="label-col">Return on Investment (ROI)</td>
                <td class="value-col" style="color: #27ae60; font-size: 16px;">${results.roi_percentage.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-text">
          <strong>Disclaimer:</strong> This report presents a financial analysis based on the provided input parameters. 
          The projections include optimization factors designed to demonstrate potential cost savings from process automation. 
          Actual results may vary depending on specific operational conditions, implementation approach, and organizational factors. 
          This analysis should be used as a decision-support tool and validated against actual business conditions before making investment decisions.
        </div>
        <div class="footer-meta">
          Document Generated: ${new Date().toLocaleString('en-IN')} | Invoicing ROI Simulator v1.0 | Confidential Business Analysis
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
