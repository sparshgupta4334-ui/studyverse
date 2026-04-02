# StudyVerse 🌌

> **The 3D Collaborative Learning Universe** — Study smarter in a shared immersive world powered by AI, real-time multiplayer, and semantic search.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![Colyseus](https://img.shields.io/badge/Colyseus-0.15-00D9FF?style=flat)](https://colyseus.io)
[![Three.js](https://img.shields.io/badge/Three.js-0.165-black?style=flat&logo=three.js)](https://threejs.org)
[![BullMQ](https://img.shields.io/badge/BullMQ-5.x-red?style=flat)](https://docs.bullmq.io)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat&logo=prisma)](https://prisma.io)

---

## What is StudyVerse?

StudyVerse is a **Level-3 multiplayer 3D web application** that transforms studying into an immersive social experience. Users enter a persistent 3D study room rendered with WebGL (React Three Fiber + Rapier physics), where they can:

- 🏃 **Move around freely** with WASD + mouse look (third-person capsule character)
- 👥 **See other learners** in real-time (Colyseus WebSocket state sync at 20Hz)
- 📝 **Take and organize notes** via an interactive desk object
- 📚 **Upload & manage resources** (PDFs, links) via an interactive bookshelf
- 🔬 **Research papers** via a whiteboard with semantic search
- 🤖 **Chat with AI** using RAG (Retrieval-Augmented Generation) at the AI terminal
- 💬 **World chat** to talk with other players in the room

---

## Quick Start (5 commands)

```bash
# 1. Start infrastructure (PostgreSQL + Redis)
docker-compose up -d

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env

# 4. Set up the database
cd apps/web && pnpm prisma db push && cd ../..

# 5. Start everything
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## Full Setup Guide

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20.0.0 | [nodejs.org](https://nodejs.org) |
| pnpm | ≥ 9.0.0 | `npm install -g pnpm` |
| Docker | Latest | [docker.com](https://docker.com) |

### Step-by-Step

#### 1. Clone the repository
```bash
git clone <repo-url> studyverse && cd studyverse
```

#### 2. Start Docker services
```bash
docker-compose up -d
# Starts: PostgreSQL 16 (pgvector) on :5432, Redis 7 on :6379
```

#### 3. Install all dependencies
```bash
pnpm install
```

#### 4. Configure environment
```bash
cp .env.example .env
# Edit .env — defaults work with Docker out of the box
```

#### 5. Set up the database
```bash
cd apps/web
pnpm prisma generate   # generates Prisma Client
pnpm prisma db push    # creates tables
cd ../..
```

#### 6. Start all services
```bash
pnpm dev
# apps/web    → http://localhost:3000  (Next.js)
# apps/server → ws://localhost:2567   (Colyseus)
# apps/workers → background workers
```

---

## Architecture Overview

```
studyverse/
├── apps/
│   ├── web/              # Next.js 14 App Router
│   │   ├── src/app/      # Pages & API routes
│   │   ├── src/components/
│   │   │   ├── world/    # React Three Fiber 3D scene
│   │   │   ├── panels/   # UI overlay panels
│   │   │   └── ui/       # Reusable components
│   │   ├── src/store/    # Zustand state
│   │   └── prisma/       # Database schema
│   ├── server/           # Colyseus multiplayer server
│   └── workers/          # BullMQ background workers
└── packages/
    └── shared/           # Shared TypeScript types & validators
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| 3D Engine | React Three Fiber, Three.js 0.165 |
| Physics | @react-three/rapier (Rapier WASM) |
| Multiplayer | Colyseus 0.15 (WebSocket) |
| State | Zustand 4 |
| Database | PostgreSQL 16 + pgvector |
| ORM | Prisma 5 |
| Queue | Redis 7 + BullMQ 5 |
| AI | OpenAI API (RAG pipeline) |
| Auth | NextAuth.js 4 |
| Styling | Tailwind CSS 3 (dark theme) |
| Monorepo | pnpm workspaces + Turborepo |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `NEXTAUTH_SECRET` | JWT signing secret |
| `NEXTAUTH_URL` | App base URL |
| `NEXT_PUBLIC_COLYSEUS_URL` | Colyseus WebSocket URL |
| `OPENAI_API_KEY` | OpenAI API key (optional — mocked if absent) |
| `AWS_*` | S3 file upload credentials (optional) |

---

## Available Scripts

```bash
pnpm dev          # Start all apps in parallel
pnpm build        # Build all apps (Turborepo cache)
pnpm lint         # Lint all
pnpm type-check   # TypeScript check
pnpm format       # Prettier format
pnpm clean        # Clean build artifacts
```

---

## 3D World Controls

| Control | Action |
|---------|--------|
| `W A S D` | Move |
| `Shift` | Sprint |
| `Mouse` | Look (click to lock) |
| Click **Desk** | Notes panel |
| Click **Bookshelf** | Resources panel |
| Click **Whiteboard** | Research panel |
| Click **Terminal** | AI Chat panel |

---

## License

MIT © StudyVerse Contributors
