# Rakta ♥ — Menstrual Health Companion

A menstrual health app for Indian women — built end to end, learning TypeScript and the full Next.js stack properly as I go 🌸

## What it does 🎀
- 🌙 Tracks menstrual cycles with phase detection (menstrual, follicular, ovulation, luteal)
- 🌷 Personalized onboarding based on life stage, PMOS/PCOS, and cycle history
- 💬 Saheli — a bilingual (Hindi/English) AI companion for health questions
- 📜 A diary-inspired design — paper texture, crimson ink, warm serif type — because a health app doesn't have to feel clinical
- 🔐 Real accounts with email/password login (Google sign-in coming soon)

## Tech stack 💻
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v4
- PostgreSQL (Neon) + Prisma
- NextAuth v5 (Auth.js) — credentials login, Google OAuth planned
- Vercel AI SDK — *planned*
- Vitest + Playwright — *planned*
- Docker + GitHub Actions CI/CD — *planned*

## Where this stands ✨
Real auth and a real database are live — signup, login, and onboarding data all persist to Postgres. Currently connecting the dashboard to real data (still partially reading from localStorage), then moving on to Saheli's AI backend and testing.