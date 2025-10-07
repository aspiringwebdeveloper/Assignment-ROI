# Invoicing ROI Simulator

A modern, lightweight single-page web application built with Next.js to simulate cost savings, ROI, and payback periods from automating invoice processing. Features real-time calculations, scenario management, and downloadable HTML reports.

## 🎯 Overview

This application helps businesses evaluate the financial impact of automating their invoice processing workflow. Users can input their current manual processing metrics and instantly see projected savings, ROI percentages, and payback periods.

## ✨ Features

- **Real-time ROI Simulation** - Instant calculations based on business inputs
- **Scenario Management** - Save, load, and delete multiple scenarios with CRUD operations
- **Report Generation** - Email-gated HTML report downloads for sharing and archival
- **Bias-Favored Calculations** - Built-in boost factor (1.1x) to favor automation outcomes
- **Responsive UI** - Modern, mobile-friendly interface using shadcn/ui components
- **Local Persistence** - JSON file-based storage (no database required)

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **Runtime**: React 19
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4.1.9
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: SWR
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React
- **Language**: TypeScript 5

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── simulate/route.ts          # POST - Run ROI simulation
│   │   ├── scenarios/route.ts         # GET/POST - List/create scenarios
│   │   ├── scenarios/[id]/route.ts    # GET/DELETE - Read/delete scenario
│   │   └── report/generate/route.tsx  # POST - Generate HTML report
│   ├── page.tsx                       # Main application page
│   ├── layout.tsx                     # Root layout
│   └── globals.css                    # Global styles
├── components/
│   ├── roi-form.tsx                   # Input form component
│   ├── results-card.tsx               # Results display component
│   ├── scenarios-panel.tsx            # Saved scenarios panel
│   └── ui/                            # shadcn/ui components
├── lib/
│   ├── db.ts                          # JSON file database operations
│   └── utils.ts                       # Utility functions
└── data/
    └── scenarios.json                 # Auto-generated scenario storage
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- MongoDB Atlas account (free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create a .env.local file in the root directory
# Add your MongoDB connection string:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# 3. Run development server
npm run dev

# 4. Build for production
npm run build

# 5. Start production server
npm start
```

The application will be available at `http://localhost:3000`

### MongoDB Setup

1. **Create MongoDB Atlas Account**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. **Create a Cluster**: Choose the free tier (M0)
3. **Create Database User**: Set username and password
4. **Whitelist IP**: Add `0.0.0.0/0` (allow from anywhere) or your specific IP
5. **Get Connection String**: Click "Connect" → "Connect your application" → Copy the connection string
6. **Add to .env.local**: Replace `<password>` with your database user password

## 📊 How It Works

### Input Parameters

The simulator accepts the following business metrics:

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Scenario Name** | Identifier for saved scenarios | "Q4_Pilot" |
| **Monthly Invoice Volume** | Number of invoices processed per month | 2000 |
| **AP Staff** | Number of accounts payable staff | 3 |
| **Hours per Invoice** | Average manual processing time | 0.17 |
| **Hourly Wage** | Average staff hourly rate | $30 |
| **Manual Error Rate** | Percentage of invoices with errors | 0.5% |
| **Error Fix Cost** | Average cost to fix an error | $100 |
| **Time Horizon** | Projection period in months | 36 |
| **One-time Implementation Cost** | Initial automation setup cost | $50,000 |

### Calculation Logic

The simulation uses server-side constants (not exposed to client):

```typescript
automated_cost_per_invoice = $0.20
error_rate_auto = 0.1%
time_saved_per_invoice = 8 minutes
min_roi_boost_factor = 1.1x
```

**Formula:**
1. `labor_cost_manual = staff × wage × hours_per_invoice × volume`
2. `auto_cost = volume × automated_cost_per_invoice`
3. `error_savings = (error_rate_manual - error_rate_auto) × volume × error_cost`
4. `monthly_savings = (labor_cost_manual + error_savings - auto_cost) × boost_factor`
5. `cumulative_savings = monthly_savings × time_horizon_months`
6. `net_savings = cumulative_savings - implementation_cost`
7. `payback_months = implementation_cost / monthly_savings`
8. `roi_percentage = (net_savings / implementation_cost) × 100`

### Output Metrics

- **Monthly Savings**: Projected savings per month
- **Cumulative Savings**: Total savings over time horizon
- **Net Savings**: Cumulative savings minus implementation cost
- **Payback Period**: Months to recover implementation cost
- **ROI Percentage**: Return on investment percentage

## 🔌 API Endpoints

### POST `/api/simulate`

Run ROI simulation with provided inputs.

**Request Body:**
```json
{
  "scenario_name": "Q4_Pilot",
  "monthly_invoice_volume": 2000,
  "num_ap_staff": 3,
  "avg_hours_per_invoice": 0.17,
  "hourly_wage": 30,
  "error_rate_manual": 0.5,
  "error_cost": 100,
  "time_horizon_months": 36,
  "one_time_implementation_cost": 50000
}
```

**Response:**
```json
{
  "inputs": { /* validated inputs */ },
  "breakdown": {
    "labor_cost_manual": 30600,
    "auto_cost": 400,
    "error_savings": 998,
    "bias_factor": 1.1
  },
  "results": {
    "monthly_savings": 34318.8,
    "cumulative_savings": 1235476.8,
    "net_savings": 1185476.8,
    "payback_months": 1.46,
    "roi_percentage": 2370.95
  }
}
```

### GET `/api/scenarios`

List all saved scenarios (lightweight view).

**Response:**
```json
[
  {
    "id": "uuid-here",
    "scenario_name": "Q4_Pilot",
    "createdAt": "2025-10-07T10:30:00.000Z",
    "updatedAt": "2025-10-07T10:30:00.000Z"
  }
]
```

### POST `/api/scenarios`

Create a new scenario.

**Request Body:**
```json
{
  "scenario_name": "Q4_Pilot",
  "inputs": { /* simulation inputs */ },
  "results": { /* simulation results */ }
}
```

### GET `/api/scenarios/:id`

Retrieve a specific scenario by ID.

### DELETE `/api/scenarios/:id`

Delete a scenario by ID.

### POST `/api/report/generate`

Generate downloadable HTML report.

**Request Body:**
```json
{
  "email": "user@example.com",
  "scenario": {
    "inputs": { /* scenario inputs */ },
    "results": { /* scenario results */ }
  }
}
```

**Response:** HTML file download (`roi-report-{timestamp}.html`)

## 💾 Data Storage

Scenarios are persisted in **MongoDB Atlas** cloud database for reliable, scalable storage that works across deployments.

**Database**: `roi_simulator`  
**Collection**: `scenarios`

**Schema:**
```typescript
{
  id: string              // UUID
  scenario_name: string   // User-defined name
  inputs: object          // Simulation inputs
  results: object         // Simulation results
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

**Benefits:**
- ✅ Persistent across deployments
- ✅ Supports multiple users
- ✅ Works on Vercel/Netlify
- ✅ Free tier available (512MB)

## 🎨 UI Components

Built with shadcn/ui components:
- **Card** - Container layouts
- **Input** - Form fields
- **Button** - Actions
- **Label** - Form labels
- **Accordion** - Collapsible sections
- **Alert** - Notifications
- **Dialog** - Modals

## 🔒 Security Notes

- All calculation constants are server-side only
- No sensitive data is exposed to the client
- Email validation on report generation
- Input sanitization and validation on all endpoints

## 🧪 Testing

```bash
# Run linter
pnpm lint

# Type checking
npx tsc --noEmit
```

## 📝 Development Notes

- **Bias Factor**: The `min_roi_boost_factor` (1.1x) ensures results favor automation
- **Negative Savings**: Softened to 25% and clamped to 0 to maintain positive outlook
- **SWR Caching**: Simulation results are cached client-side with `keepPreviousData`
- **File-based DB**: Simple JSON storage suitable for demo/prototype use

## 🚢 Deployment

This is a standard Next.js application and can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

**Environment Requirements:**
- Node.js 18+
- Write permissions for `data/` directory

## 📄 License

This project is built for demonstration purposes.

## 🤝 Contributing

This is an assignment/demo project. For production use, consider:
- Adding a real database (PostgreSQL, MongoDB)
- Implementing authentication
- Adding input validation schemas
- Creating unit and integration tests
- Adding error boundaries and logging
- Implementing rate limiting on API routes
