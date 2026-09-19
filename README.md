# Rakta ♥ — Menstrual Health Companion

A menstrual health app for Indian women — built end to end, learning TypeScript and the full Next.js stack properly as I go 🌸

## What it does 🎀
- 🌙 Tracks menstrual cycles with phase detection (menstrual, follicular, ovulation, luteal), including honest handling of overdue/late periods
- 🌷 Personalized onboarding based on life stage, PMOS/PCOS, and cycle history
- 📅 A full Tracker — calendar view, daily logging (flow, mood, symptoms, notes), and life-stage-aware tracking: standard cycle logging, PCOS-aware irregular-cycle detection from real logged data, pregnancy week/trimester tracking, and menopause symptom-frequency tracking
- 🗓️ Important dates — flag meetings, travel, or deadlines and get a heads-up if a predicted period might clash with one
- 💬 Saheli — a bilingual (Hindi/English) AI companion with real tool-calling into your actual cycle status and recent logs, and persisted chat history across sessions
- 👪 Family sharing — invite a trusted contact to see a read-only view of your status (phase, day, next predicted date — never logs or notes), via a single-claim invite link you send yourself
- ⚙️ Settings — edit your profile, change life stage (with a confirmation step, since it changes what the Tracker shows), and change your password
- 📜 A diary-inspired design — paper texture, crimson ink, warm serif type — because a health app doesn't have to feel clinical
- 🔐 Real accounts — signup, login, and onboarding all persist to Postgres, with route-level session protection at the edge (Google sign-in coming soon)

## Tech stack 💻
- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- PostgreSQL (Neon) + Prisma, with driver adapters
- NextAuth v5 (Auth.js) — credentials login, split edge-safe config for `proxy.ts` route protection, Google OAuth planned
- Vercel AI SDK + Groq — Saheli's chat with real tool-calling (cycle status, recent logs) and persisted history
- Vitest — unit tests for the core cycle math, running in CI on every push; Playwright end-to-end tests still planned
- GitHub Actions CI — lint, typecheck, and tests run automatically on every push and PR
- Docker + deployment — *planned*

## Where this stands ✨
Auth, database, onboarding, dashboard, landing page, Tracker, Settings, and Family sharing are all working end to end — real accounts, real data, no `localStorage` dependency left anywhere in the app. Route protection runs at the edge via `proxy.ts`. Saheli calls real tools mid-conversation (her own cycle-status and recent-logs data) and remembers past conversations. CI runs lint, typecheck, and the unit test suite on every push. Left to do: the Learn page, Playwright end-to-end tests, Docker, deployment, and Google OAuth.