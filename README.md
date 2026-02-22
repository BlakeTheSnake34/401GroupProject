# Purpose App

---

## For Graders / TA Instructions

This section provides a quick grading checklist. Follow the steps below to evaluate the README and verify the application.

### Grading Checklist (README Rubric)

| Criterion | What to Look For |
|-----------|------------------|
| **App Summary** | Problem and product value clearly explained (see App Summary section) |
| **Tech Stack** | Organized by layer (Frontend, Backend, Database) in the Tech Stack table |
| **Architecture Diagram** | Matches the system: User → Frontend → Backend → PostgreSQL with labeled data flow |
| **Setup Instructions** | Complete and ordered: Prerequisites → Install → Database → Env → Run |
| **Verification Steps** | Concrete success criteria: complete session → see in table → refresh → data persists |

### Quick Start for Grading

1. **Prerequisites:** Node.js v18+, PostgreSQL, and `psql` in PATH.
2. **Setup:** Run `npm run install:all`, create database, run `db/schema.sql` and `db/seed.sql`, configure `backend/.env`.
3. **Run:** `npm run dev` (or `npm run dev:backend` + `npm run dev:frontend` in separate terminals).
4. **Verify:** Open http://localhost:5173 → Complete a session → View History → Refresh page. Session should persist.

**Success looks like:** A new row appears in the Session History table after completing a session, and it remains after refreshing the page.

**TL;DR for grading:** Clone → `npm run install:all` → Create DB + run schema/seed → Copy `backend/.env.example` to `backend/.env` (set password) → `npm run dev` → Open http://localhost:5173 → Complete a session → Click View History → Refresh. Session persists = pass.

---

## App Summary

**Purpose** is a focus session application that helps users engage with apps and websites more intentionally.

**Problem:** Many people open Instagram, YouTube, or other apps without a clear goal and end up mindlessly scrolling or spending more time than intended. This leads to unproductive screen time and weaker digital habits.

**Product value:** Purpose guides users to state their intention before starting a session, set a time limit, and track their progress. The primary user is anyone who wants to build healthier digital habits and use technology with more awareness. The product walks users through a simple flow: select an app, state their purpose (e.g., "Reply to messages and log off"), choose a duration, run a timer, and complete the session. All completed sessions are saved to a PostgreSQL database and displayed in a history table, allowing users to review their intentional usage over time.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 18 |
| **Frontend Build Tool** | Vite 5 |
| **Frontend Styling** | Tailwind CSS 3 |
| **Frontend Icons** | Lucide React |
| **Frontend Language** | TypeScript 5 |
| **Backend Framework** | Express 4 |
| **Backend Runtime** | Node.js |
| **Database** | PostgreSQL |
| **Database Driver** | `pg` (node-postgres) |
| **Authentication** | None (guest user for demo) |
| **External Services** | None |
| **Dev Tooling** | ESLint, PostCSS, concurrently |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │   User   │
    │ (Browser)│
    └────┬─────┘
         │
         │ 1. HTTP (fetch)
         │    localhost:5173
         ▼
    ┌─────────────────────────────────────────────────────────┐
    │                    FRONTEND (React + Vite)                │
    │                    Port: 5173                            │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
    │  │ WelcomeScreen│  │SessionActive│  │ SessionsHistory │  │
    │  └─────────────┘  └─────────────┘  └─────────────────┘  │
    └────────────────────────┬────────────────────────────────┘
                              │
                              │ 2. /api/* proxied to backend
                              │    (Vite dev server proxy)
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │                    BACKEND (Express + Node.js)           │
    │                    Port: 3001                            │
    │  ┌─────────────────────────────────────────────────┐   │
    │  │  GET  /api/health          - Health check         │   │
    │  │  GET  /api/sessions        - Fetch all sessions   │   │
    │  │  POST /api/sessions/complete - Save new session   │   │
    │  └─────────────────────────────────────────────────┘   │
    └────────────────────────┬────────────────────────────────┘
                              │
                              │ 3. SQL queries (pg driver)
                              │    Connection: DATABASE_URL
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │                    PostgreSQL Database                   │
    │                    Port: 5432                           │
    │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐       │
    │  │ app_user │  │ purpose  │  │ focus_session    │       │
    │  └──────────┘  └──────────┘  └──────────────────┘       │
    └─────────────────────────────────────────────────────────┘

Data flow:
  1. User interacts with React UI → triggers API calls
  2. Frontend fetch('/api/...') → Vite proxies to http://localhost:3001
  3. Express handles request → pg driver executes SQL on PostgreSQL
  4. Response flows back to frontend → UI updates
```

---

## Prerequisites

Install the following software before running the project:

| Software | Purpose | Verify Installation |
|----------|---------|---------------------|
| **Node.js** (v18+) | JavaScript runtime for frontend and backend | `node --version` |
| **npm** | Package manager (included with Node.js) | `npm --version` |
| **PostgreSQL** | Database server | `psql --version` |
| **psql** | PostgreSQL command-line client (included with PostgreSQL) | `psql -U postgres -c "SELECT 1"` |

### Installation Links

- **Node.js**: https://nodejs.org/ (LTS recommended)
- **PostgreSQL**: https://www.postgresql.org/download/

### Add psql to PATH (Windows)

PostgreSQL's `bin` folder must be in your system PATH. Typical location:

```
C:\Program Files\PostgreSQL\16\bin
```

Add it via: **Settings → System → About → Advanced system settings → Environment Variables → Path → Edit → New**

---

## Installation and Setup

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd 401GroupProject-1

# Install root, frontend, and backend dependencies
npm run install:all
```

Or install separately:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### Step 2: Create the Database

**Windows (PowerShell):**
```powershell
$env:PGPASSWORD="your_password"
psql -U postgres -c "CREATE DATABASE purpose;"
psql -U postgres -d purpose -f db/schema.sql
psql -U postgres -d purpose -f db/seed.sql
```

**macOS / Linux:**
```bash
PGPASSWORD=your_password psql -U postgres -c "CREATE DATABASE purpose;"
PGPASSWORD=your_password psql -U postgres -d purpose -f db/schema.sql
PGPASSWORD=your_password psql -U postgres -d purpose -f db/seed.sql
```

**Alternative (PowerShell):** `$env:PGPASSWORD="your_password"; .\scripts\setup-db.ps1`

### Step 3: Configure Environment Variables

1. Copy the backend environment example:
   ```bash
   copy backend\.env.example backend\.env
   ```

2. Edit `backend/.env` and set your PostgreSQL password:
   ```
   PORT=3001
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/purpose
   ```

   Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

---

## Running the Application

### Option A: Run Both Servers (Recommended)

```bash
npm run dev
```

This starts the backend and frontend concurrently.

### Option B: Run in Separate Terminals

**Terminal 1 – Backend:**
```bash
npm run dev:backend
```

**Terminal 2 – Frontend:**
```bash
npm run dev:frontend
```

### URLs

| Service | URL |
|---------|-----|
| **Frontend (open in browser)** | http://localhost:5173/ |
| **Backend API** | http://localhost:3001/ |

> **Note:** If port 5173 is in use, Vite will try 5174, 5175, etc. Check the terminal output for the actual URL.

---

## Verifying the Vertical Slice

Follow these steps to confirm the full stack works end-to-end: frontend → backend → database → persistence.

### Step 1: Start the Application

1. Ensure the backend and frontend are running (`npm run dev` or separate terminals).
2. Open **http://localhost:5173/** in your browser.

### Step 2: Complete a Focus Session

1. On the **Welcome** screen, click an app (e.g., **Instagram**).
2. On the **Purpose** screen, select or enter a purpose (e.g., "Check messages").
3. On the **Time** screen, choose a duration (e.g., **5 min**).
4. On the **Session Active** screen, wait for the timer or click **Complete** to finish early.
5. You should be redirected to the **Session History** page.

### Step 3: Confirm the Database Was Updated

1. On the **Session History** page, verify your new session appears in the table with:
   - Purpose
   - User (Guest User)
   - App
   - Duration
   - Completed timestamp

2. **Optional – verify in PostgreSQL:**
   ```bash
   psql -U postgres -d purpose -c "SELECT session_id, app_name, purpose_id, planned_minutes, ended_at FROM focus_session ORDER BY session_id DESC LIMIT 5;"
   ```
   You should see your new row.

### Step 4: Verify Persistence After Refresh

1. Refresh the page (F5 or Ctrl+R).
2. Navigate to **View History** (top right on the Welcome screen) if you are back on the Welcome screen.
3. Confirm your session is still in the table.
4. The data is stored in PostgreSQL, so it persists across refreshes and browser restarts.

### Step 5: Verify API Directly (Optional)

```bash
curl http://localhost:3001/api/sessions
```

You should receive a JSON array of sessions including the one you just completed.

### Success Criteria (For Graders)

| Step | Expected Result |
|------|-----------------|
| Complete a session | Redirected to Session History page |
| View table | New row shows: Purpose, Guest User, App name, Duration, Completed timestamp |
| Refresh page | Same session still visible (data persisted in PostgreSQL) |
| API check | `GET /api/sessions` returns JSON array including the new session |

If all four criteria pass, the vertical slice (frontend → backend → database → persistence) is verified.

---

## Project Structure

```
├── frontend/           # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── index.html
│   └── vite.config.ts
├── backend/            # Express API
│   ├── server.js
│   ├── db.js
│   └── .env
├── db/
│   ├── schema.sql     # Table definitions
│   └── seed.sql       # Sample data
├── scripts/
│   └── setup-db.ps1   # Database setup script
└── package.json
```
