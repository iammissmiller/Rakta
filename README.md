# Rakta ♥ — Menstrual Health Companion

A menstrual health app for Indian women — built end to end, learning TypeScript and the full Next.js stack properly as I go 🌸

## What it does 🎀
- 🌙 Tracks menstrual cycles with phase detection (menstrual, follicular, ovulation, luteal), including honest handling of overdue/late periods
- 🌷 Personalized onboarding based on life stage, PMOS/PCOS, and cycle history
- 📅 A full Tracker — calendar view, daily logging (flow, mood, symptoms, notes), and life-stage-aware tracking: standard cycle logging, PCOS-aware irregular-cycle detection from real logged data, pregnancy week/trimester tracking, and menopause symptom-frequency tracking
- 🗓️ Important dates — flag meetings, travel, or deadlines and get a heads-up if a predicted period might clash with one
- 💬 Saheli — a bilingual (Hindi/English) AI companion for health questions (tool-calling into real user data in progress)
- 📜 A diary-inspired design — paper texture, crimson ink, warm serif type — because a health app doesn't have to feel clinical
- 🔐 Real accounts — signup, login, and onboarding all persist to Postgres, with route-level session protection (Google sign-in coming soon)

## Tech stack 💻
- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- PostgreSQL (Neon) + Prisma, with driver adapters
- NextAuth v5 (Auth.js) — credentials login, split edge-safe config for `proxy.ts` route protection, Google OAuth planned
- Vercel AI SDK + Groq — Saheli's chat is live; real tool-calling into user data is the next step
- Vitest + Playwright — *planned*
- Docker + GitHub Actions CI/CD — *planned*

## Where this stands ✨
Auth, database, onboarding, dashboard, landing page, and the Tracker are all working end to end — real accounts, real data, no `localStorage` dependency left anywhere in the app. Route protection runs at the edge via `proxy.ts`. Saheli's chat is live but doesn't yet call into real user data mid-conversation — a `fetchUserCycleInfo` helper is written and ready to be wired in as an AI SDK tool. Learn, Family, and Settings pages are next, along with chat history persistence, tests, and CI.