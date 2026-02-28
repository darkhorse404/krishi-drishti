# 🌾 Krishi Drishti: Agricultural Machinery Management

**Modern Accountability & Monitoring for Community Harvesting Centers (CHC)**

Krishi Drishti is an enterprise-grade IoT-enabled platform designed to bring transparency and efficiency to agricultural machinery distribution. It empowers state nodal officers, panchayat leaders, and farmers to track machinery utilization, prevent stubble burning, and manage hiring centers in real-time.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (Recommended)
- PostgreSQL (Local or NeonDB)
- npm or pnpm

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd v0-machine-management-system

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
cp .env.example .env.local
# Edit .env.local with your actual credentials (see Environment Variables section below)

# 4. Initialize Database
npx prisma db push
npm run seed

# 5. Launch Development Server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory using `.env.example` as a template. Configure the following variables:

### Required Variables

| Variable       | Description                                     | Example                                                                      |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                    | `postgresql://user:password@localhost:5432/machine_management?schema=public` |
| `NEXTAUTH_URL` | Base URL for authentication and Socket.io CORS  | `http://localhost:3000`                                                      |
| `CRON_SECRET`  | Secret key for authenticating cron job requests | `your_secure_random_string`                                                  |

### Optional API Keys

| Variable                        | Description                                          | Where to Get                              |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY`   | Vapi AI public key for Kisan Sahayak voice assistant | [vapi.ai](https://vapi.ai)                |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Vapi AI assistant identifier                         | [vapi.ai](https://vapi.ai)                |
| `NEXT_PUBLIC_GEMINI_API_KEY`    | Google Gemini API for Drone Verifier feature         | [Google AI Studio](https://ai.google.dev) |

### Environment Mode

| Variable   | Description           | Values                              |
| ---------- | --------------------- | ----------------------------------- |
| `NODE_ENV` | Node environment mode | `development`, `production`, `test` |

**Note**: Never commit your `.env.local` file to version control. The `.env.example` file is provided as a template only.

---

## 🛠 Tech Stack

| Layer     | Technology              | Key Usage                                     |
| --------- | ----------------------- | --------------------------------------------- |
| Framework | Next.js 15 (App Router) | Server Components & API Routes                |
| Language  | TypeScript 5.7          | Type-safe data structures                     |
| Database  | PostgreSQL + Prisma     | Relational mapping for accountability models  |
| Visuals   | Recharts & Leaflet      | Real-time utilization heatmaps & KPI tracking |
| Styling   | Tailwind CSS 4.1        | Responsive, modern dashboard UI               |
| Real-time | Socket.IO               | Live machine telemetry & alert feeds          |

---

## 🏗 System Architecture & Portals

The system is partitioned into specialized portals to serve different stakeholders:

- **📈 Analytics Dashboard** (`/analytics`): High-level KPIs, burn alert monitoring, and regional performance trends.
- **🚜 Machine Management** (`/machines`): CRUD operations for machinery with GPS tracking and status monitoring (`active`, `idle`, `maintenance`).
- **🏘️ Panchayat Leaderboard** (`/leaderboard`): Accountability rankings for village-level officers based on machine utilization scores.
- **🛠 CHC Operator Portal** (`/chc-portal`): Daily session logs, booking management, and revenue tracking.
- **📢 Public Transparency** (`/transparency`): Public-facing portal showcasing success stories and resource availability.
- **🚨 Alert Center** (`/alerts`): Management of geofence breaches, stubble burning SOS, and maintenance triggers.

---

## 📊 Database Schema Highlights

The system utilizes a robust relational schema designed for accountability:

- **`UtilizationSession`**: Tracks exact start/end times, GPS coordinates, and acres covered per machine.
- **`TelemetryLog`**: Captures raw IoT data (Engine RPM, Fuel Level, Vibration) to detect "ghost" sessions.
- **`Panchayat`**: Stores geographic boundaries (GeoJSON) for automatic geofence monitoring.
- **`Complaint`**: Community-driven reporting for stubble burning or operator absence.

---

## 📋 Available Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Generates the Prisma client and builds the Next.js app.
- **`npm run test`**: Executes Jest unit tests for components.
- **`npx prisma studio`**: Visual interface to manage your database records.

---

## 🏁 Project Health & Roadmap

### Current Status: FUNCTIONAL ✅

- **Core Navigation**: Fully restored including the Leaderboard.
- **Database**: Synced with accountability models (Telemetry, Sessions, Complaints).
- **Mapping**: Interactive heatmaps for machine density are live.

### Upcoming Milestones (Phase 4-7)

1. **Full Schema Audit**: Resolving field name mismatches in IoT API routes.
2. **Real-time Telemetry**: Implementing Socket.IO for live position updates.
3. **Role-Based Auth**: NextAuth.js integration for distinct Admin/Farmer views.
4. **Mobile Optimization**: Finalizing responsive layouts for field officers.

---

## 📞 Support & Documentation

- **`PROJECT_ISSUES_RESOLUTION.md`**: Log of recently fixed bugs and non-critical warnings.
- **`prisma/schema.prisma`**: Detailed source of truth for all data models.

---

**Built with ❤️ for a sustainable and accountable agricultural future.**
