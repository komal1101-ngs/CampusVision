# VisionCampus: AI-Powered Campus Safety, Accessibility & Infrastructure Intelligence Platform

VisionCampus is an enterprise-grade AI Computer Vision and Spatial Risk Intelligence web application built for educational institutions to identify safety hazards, accessibility non-compliance (ADA), physical infrastructure damage, and crowd bottlenecks across campus facilities.

The platform combines spatial metadata (**"Where was the inspection performed?"** via structured campus hierarchy nodes) with visual analytics (**"What is wrong?"** powered by Google Gemini Vision reasoning).

---

## 🏛️ Default Institution: GMR Institute of Technology (GMRIT)
- **Institution**: GMR Institute of Technology (GMRIT)
- **Code**: `GMRIT-RAJAM`
- **Location**: Rajam, Vizianagaram, Andhra Pradesh
- **Coordinates**: 18.4674° N, 83.6603° E

### 4-Tier Location Hierarchy:
- **Main Block (MB)**
  - *Ground Floor*: Central Administrative Corridor (`MB-G01`), Main Entrance (`MB-MAIN`)
  - *Floor 1*: Dean Office Hallway (`MB-101`), Computer Labs Passageway (`MB-LAB`)
- **Civil & Mechanical Block (CMB)**
  - *Ground Floor*: Heavy Machinery Lab Area (`CMB-G02`), East Exit Ramp (`CMB-RAMP`)
  - *Floor 1*: Structural Engineering Corridor (`CMB-105`), Emergency Stairwell (`CMB-STAIR`)
- **Electrical & Electronics Block (EEE)**
  - *Ground Floor*: Power Systems Lab (`EEE-PSL`), High Voltage Bay Entrance (`EEE-HVB`)
  - *Floor 1*: Electronics Workshop Corridor (`EEE-108`)
- **Student Activity Center & Canteen (SAC)**
  - *Ground Floor*: Dining Area Pathway (`SAC-DINE`), Kitchen Egress Corridor (`SAC-KITCH`)

---

## 🚀 Key Features

1. **Role-Based Access Control (RBAC)**:
   - Configured profiles for `STUDENT`, `TEACHER`, `SAFETY_OFFICER`, `FACILITY_MANAGER`, and `ADMIN`.
   - Dynamic UI switcher and Supabase Row-Level Security (RLS) policies.
2. **Cascading Location Hierarchy Engine**:
   - 4-Tier selector (Campus &rarr; Building &rarr; Floor &rarr; Area) linking visual evidence to spatial nodes.
3. **Dual-Mode Image Pipeline**:
   - Live device camera stream capture and drag-and-drop file upload.
   - Client-side auto-downscaling (&gt;2048px on longest edge) and binary magic-byte header validation.
4. **Server-Side Multimodal AI Reasoning**:
   - Google Gemini Vision (`gemini-3.8-flash` / `gemini-2.5-flash`) via the official `@google/genai` SDK.
   - Spatial context evaluation (e.g., distinguishing storage closet boxes from egress-blocking hazards).
   - Strict server-side Zod validation against `AIIssueAnalysisResponseSchema`.
5. **Issue Remediation Lifecycle**:
   - Full 6-state lifecycle: `NEW` &rarr; `REVIEWED` &rarr; `ASSIGNED` &rarr; `IN_PROGRESS` &rarr; `RESOLVED` &rarr; `CLOSED`.
   - Automated immutable audit trails in `issue_audit_logs`.
6. **Analytics & GIS Layer**:
   - KPI metrics and Recharts breakdown graphs (Severity, Domain, Building).
   - Interactive GIS campus footprint map plotting building nodes and outdoor safety pins.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend**: Node.js, Express.js (TypeScript), Multer
- **Database & Auth**: Supabase PostgreSQL with RLS, Supabase Storage
- **AI Engine**: Google Gemini Vision via `@google/genai`
- **Validation**: Zod (API requests, forms, and structured AI output)

---

## ⚙️ Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root based on `.env.example`:
```env
# Server Secrets (Backend Only)
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Public Client Variables (Frontend)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Database Migration
Apply the PostgreSQL migration schema located in `supabase/migrations/20260101000000_initial_schema.sql` via the Supabase SQL Editor.

### 4. Running Locally
```bash
# Run both backend server and frontend client concurrently:
npm run dev

# Or run individually:
npm run dev:server  # Express API at http://localhost:5000
npm run dev:client  # Vite Client at http://localhost:5173
```

---

## 🔒 Security & Privacy Notice
All sensitive environment variables (`.env`, secrets, API keys, service role tokens) are strictly excluded from version control via `.gitignore`.
