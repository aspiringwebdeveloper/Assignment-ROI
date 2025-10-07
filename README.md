# Invoicing ROI Simulator

A lightweight single-page web app to simulate cost savings, ROI, and payback from automating invoice processing. Includes API endpoints, scenario persistence, and an email-gated HTML report.

## Features
- Live simulation from simple business inputs
- CRUD for named scenarios (local JSON persistence)
- Email-gated report generation (downloadable HTML snapshot)
- Bias factor ensures favorable automation outcomes

## Tech
- Next.js App Router (Next.js runtime)
- shadcn/ui components
- Local JSON storage (`data/scenarios.json`) via route handlers

## Run & Test
- In v0: open the Preview to run the app. Click Publish to deploy.
- The main page is at `/`.
- Endpoints:
  - POST `/api/simulate`
  - GET `/api/scenarios`, POST `/api/scenarios`
  - GET `/api/scenarios/:id`, DELETE `/api/scenarios/:id`
  - POST `/api/report/generate` (requires `email` and a `scenario` payload)

## Notes
- Internal constants are server-only and never exposed to the client.
- Report is delivered as an HTML file download for portability.
