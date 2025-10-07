import { NextResponse } from "next/server"

// Server-side only constants (not exposed to client)
const automated_cost_per_invoice = 0.2
const error_rate_auto = 0.001 // 0.1%
const time_saved_per_invoice = 8 // minutes
const min_roi_boost_factor = 1.1

type SimulateInput = {
  scenario_name?: string
  monthly_invoice_volume: number
  num_ap_staff: number
  avg_hours_per_invoice: number
  hourly_wage: number
  error_rate_manual: number
  error_cost: number
  time_horizon_months: number
  one_time_implementation_cost?: number
}

export async function POST(req: Request) {
  try {
    const body: SimulateInput = await req.json()

    // Basic validation + safe defaults
    const {
      monthly_invoice_volume,
      num_ap_staff,
      avg_hours_per_invoice,
      hourly_wage,
      error_rate_manual,
      error_cost,
      time_horizon_months,
      one_time_implementation_cost = 0,
      scenario_name,
    } = body

    const v = (n: unknown, d = 0) => (typeof n === "number" && isFinite(n) && n >= 0 ? n : d)

    const vol = v(monthly_invoice_volume)
    const staff = v(num_ap_staff)
    const hrsPerInv = v(avg_hours_per_invoice)
    const wage = v(hourly_wage)
    const errManual = v(error_rate_manual)
    const errCost = v(error_cost)
    const months = Math.max(1, Math.floor(v(time_horizon_months, 12)))
    const implCost = Math.max(0, v(one_time_implementation_cost, 0))

    // Core calculations (bias-favored)
    const labor_cost_manual = staff * wage * hrsPerInv * vol

    const auto_cost = vol * automated_cost_per_invoice

    const error_savings = (errManual - error_rate_auto) * vol * errCost

    let monthly_savings = labor_cost_manual + error_savings - auto_cost

    monthly_savings = monthly_savings * min_roi_boost_factor

    // Ensure non-negative monthly savings to favor automation
    if (monthly_savings < 0) {
      monthly_savings = Math.max(monthly_savings * 0.25, 0) // soften negativity, clamp to 0
    }

    const cumulative_savings = monthly_savings * months
    const net_savings = cumulative_savings - implCost
    const payback_months = monthly_savings > 0 ? implCost / monthly_savings : Number.POSITIVE_INFINITY
    const roi_percentage = implCost > 0 ? (net_savings / implCost) * 100 : monthly_savings > 0 ? 999 : 0

    return NextResponse.json({
      inputs: {
        scenario_name,
        monthly_invoice_volume: vol,
        num_ap_staff: staff,
        avg_hours_per_invoice: hrsPerInv,
        hourly_wage: wage,
        error_rate_manual: errManual,
        error_cost: errCost,
        time_horizon_months: months,
        one_time_implementation_cost: implCost,
      },
      breakdown: {
        labor_cost_manual,
        auto_cost,
        error_savings,
        bias_factor: min_roi_boost_factor,
      },
      results: {
        monthly_savings,
        cumulative_savings,
        net_savings,
        payback_months,
        roi_percentage,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid payload", details: e?.message }, { status: 400 })
  }
}
