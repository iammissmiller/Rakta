# Rakta ♥ — Menstrual Health Companion

A menstrual health app for Indian women — built end to end, learning TypeScript and the full Next.js stack properly as I go 🌸

## What it does 🎀
- 🌙 Tracks menstrual cycles with phase detection (menstrual, follicular, ovulation, luteal)
- 🌷 Personalized onboarding based on life stage, PMOS/PCOS, and cycle history
- 💬 Saheli — a bilingual (Hindi/English) AI companion for health questions
- 📜 A diary-inspired design — paper texture, crimson ink, warm serif type — because a health app doesn't have to feel clinical
- 🔐 Real accounts — signup, login, and onboarding all persist to Postgres (Google sign-in coming soon)

## Tech stack 💻
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v4
- PostgreSQL (Neon) + Prisma
- NextAuth v5 (Auth.js) — credentials login, Google OAuth planned
- Vercel AI SDK + Groq — *building now* (Saheli, the AI companion)
- Vitest + Playwright — *planned*
- Docker + GitHub Actions CI/CD — *planned*

## Where this stands ✨
Auth, database, onboarding, and the dashboard are fully working end to end — real accounts, real data, no localStorage dependency left in the core flow. Currently building Saheli (the AI chat companion). Tracker, Learn, and Family pages are next.