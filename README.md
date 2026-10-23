# SkillPath — Discover Your Skills. Build Your Future.

SkillPath is a full-stack career exploration and skill development platform designed for college students, career changers, and beginners who want to discover their strengths, verify competencies with diagnostic tests, explore industry career tracks, follow structured learning roadmaps, manage portfolio projects, and monitor their progress.

---

## 🚀 Key Features

1. **Public Marketing & Exploration Platform:**
   - 11-section SaaS landing page featuring live interactive previews, curriculum breakdowns, and interactive FAQs.
   - Public Career Explorer with multi-category search, difficulty filters, and side-by-side career comparison.
   - Public Skills Catalog and Project Templates directory.

2. **Secure Authentication & Role-Based Authorization:**
   - Email and password registration with educational background and career interest capture.
   - Passwords hashed using `bcrypt` (10 salt rounds).
   - JWT sessions supported via HttpOnly secure cookies and `Authorization: Bearer <token>` headers.
   - Strict server-side role guards: `STUDENT` and `ADMIN`.
   - Built-in demo accounts with instant quick-fill buttons.

3. **Multi-Step Student Onboarding Flow:**
   - 4-step wizard capturing education level, existing skills, topics enjoyed, preferred careers, proficiency level, weekly availability, and goals.
   - Generates a transparent **Career Discovery Summary** with match scores, clearly distinguishing self-reported provisional skills from assessment-verified abilities.

4. **Student Workspace & Dashboard:**
   - Live metrics summary cards (Verified Skills, Active Roadmaps, Avg Progress %, Completed Projects, Weekly Study Target, Activity Streak).
   - "Continue Learning" banner pointing directly to the next incomplete topic.
   - Daily tasks with interactive completion toggles.
   - Recharts visual charts: Weekly Study Cadence (Area/Bar) and Domain Proficiency Radar.

5. **Server-Side Skill Assessment Engine:**
   - Timed multiple-choice evaluations (JavaScript, React, SQL, Python).
   - Answers and `isCorrect` fields are **never exposed** to client browsers.
   - Scores and proficiency ratings (Beginner, Intermediate, Advanced) are calculated strictly on the backend.
   - Automatically upgrades student skills to **Verified** upon passing.
   - Provides comprehensive question reviews with educational explanations and educational disclaimers.

6. **Structured 6-Phase Career Roadmaps:**
   - Follows real-world progression: *Web Fundamentals → Language Core & Async → Frameworks & Architecture → Professional Dev (Git, Testing, WCAG) → Portfolio Projects → Career Preparation*.
   - Dynamic schedule calculator adapts estimated completion weeks to the student's weekly study hours.
   - Item-level completion tracking and personal notes.

7. **Project Workspace & Public Shareable Portfolio:**
   - Track projects through *Not Started*, *In Progress*, and *Completed* stages.
   - Validates code repository and live demo URLs.
   - Shareable public portfolio (`/portfolio/:userId`) presenting verified skills, completed projects, and achievement badges.

8. **AI Career Assistant:**
   - Conversational career guidance interface with quick suggestion chips.
   - Connects to Google Gemini API when `AI_API_KEY` is provided.
   - Includes a deterministic, high-fidelity **SkillPath Intelligent Guidance Engine** fallback when offline.
   - Transparent source attribution on every response.

9. **Protected Administration Area (`/admin`):**
   - Platform analytics: registered users, published careers, active roadmaps, and completed assessments.
   - User directory with search.
   - Instant publishing tools for new career tracks, skills, and learning resources.

---

## 🛠 Technology Stack

- **Frontend:** React 19, Vite, React Router 7, Tailwind CSS, Lucide React, Recharts, Canvas Confetti.
- **Backend:** Node.js, Express.js (ES Modules), Prisma ORM, JWT, Bcryptjs, Cookie-Parser, CORS.
- **Database:** SQLite via Prisma ORM (`file:./dev.db`) for self-contained local zero-friction setup; ready for PostgreSQL via `.env` configuration.
- **Testing:** Vitest, Supertest.

---

## 📦 Getting Started & Setup

### Prerequisites
- Node.js v18+ and npm installed.

### 1. Installation
Clone or navigate to the workspace directory:
```bash
cd c:/skillpath
```

Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd ../client
npm install
```

### 2. Environment Configuration
The server includes a configured `.env` file:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=skillpath_super_secret_jwt_key_2026_secure
CLIENT_URL=http://localhost:5173
ADMIN_SECRET=admin_secret_setup_key
# Optional: Provide Google Gemini API Key for real-time generative chat
AI_API_KEY=
```

### 3. Database Initialization & Seeding
From the `server` directory:
```bash
cd c:/skillpath/server

# Push schema to SQLite database
npx prisma db push

# Seed careers, roadmaps, skills, questions, and demo accounts
npm run db:seed
```

### 4. Running the Development Servers

**Start Backend REST API (Port 5000):**
```bash
cd c:/skillpath/server
npm run dev
# or: node src/server.js
```

**Start Frontend Client (Port 5173 / 5174):**
```bash
cd c:/skillpath/client
npm run dev
```

Open `http://localhost:5173` (or the port indicated in the terminal) in your browser.

---

## 🔑 Demo Accounts

Use the instant quick-fill buttons on the `/login` screen, or sign in with:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@skillpath.dev` | `StudentPass123!` | Dashboard, assessments, roadmaps, projects |
| **Administrator** | `admin@skillpath.dev` | `AdminPass123!` | Protected `/admin` panel & management |

---

## 🧪 Automated Testing

Run the automated integration test suite:
```bash
cd c:/skillpath/server
npm test
```

### Verified Test Cases (30 Tests Passing):
- `GET /api/health` status check
- User registration validation (missing fields, short passwords, duplicate emails)
- Login authentication (valid vs invalid credentials)
- Protected route authorization guards (401 without token)
- Role authorization guards (403 when students attempt admin endpoints)
- Student onboarding submission and career match generation
- Assessment question retrieval (verifying `isCorrect` is never leaked)
- Server-side score calculation and proficiency ranking
- Roadmap enrollment, schedule estimation, and item progress toggling
- Goal and task full CRUD operations
- Project creation with URL validation and completion triggers
- Dashboard live metric calculations
- AI assistant chat and transparent source attribution

---

## 🏗 Building for Production

To create an optimized production bundle:
```bash
cd c:/skillpath/client
npm run build
```
Built assets will be emitted to `client/dist/`.

---

## ☁️ Production Deployment (Vercel & Cloud)

### 1. Frontend on Vercel
SkillPath is configured for seamless deployment on Vercel:
- **Framework Preset:** Vite
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Routing:** Handled via `client/vercel.json` with SPA rewrites (`/(.*) -> /index.html`), preventing 404s on direct page reloads.

#### Environment Variables for Frontend on Vercel:
| Variable | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://your-api-domain.com/api` | The public base URL of your deployed backend REST API |

### 2. Backend REST API Deployment
The Express.js REST API (`server/`) can be hosted on any persistent Node.js environment (e.g. Render, Railway, Fly.io, AWS ECS/Lightsail, or DigitalOcean App Platform):
- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `node src/server.js`
- **Health Check Path:** `/api/health`

#### Environment Variables for Backend:
| Variable | Description |
|---|---|
| `NODE_ENV` | Set to `production` |
| `PORT` | Set automatically by cloud host (defaults to `5000`) |
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://user:pass@host:5432/dbname?sslmode=require`) |
| `JWT_SECRET` | Secure cryptographic secret string (32+ characters) |
| `CLIENT_URL` | Deployed Vercel frontend domain (e.g. `https://skillpath.vercel.app`) |
| `AI_API_KEY` | *(Optional)* Google Gemini API key for live LLM career assistant queries |

### 3. Production Database Setup
1. Provision a PostgreSQL instance on Neon, Supabase, Railway, or AWS RDS.
2. Update `server/prisma/schema.prisma` datasource provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run schema push and seed:
   ```bash
   cd server
   npx prisma db push
   node prisma/seed.js
   ```
