# 🏗️ PTIALRECORD: Project Structure

This document outlines the architecture and organization of the **PTIALRECORD** monorepo.

## 📂 Monorepo Layout

The project uses a monorepo structure managed by **Turborepo** and **pnpm**.

```text
pitalrecord/
├── apps/
│   ├── web/                # Next.js 14 web application (Patient/Admin Portal)
│   └── docs/               # Documentation site (Starlight/Docusaurus - Future)
├── packages/
│   ├── ui/                 # Shared React components (Shadcn/UI + Tailwind)
│   ├── tsconfig/           # Shared TypeScript configurations
│   └── eslint-config/      # Shared ESLint rules
├── supabase/
│   ├── migrations/         # SQL database migrations (PostgreSQL)
│   └── seed.sql            # Initial development data
├── scripts/                # Helper scripts for deployment and AI training
└── docs/                   # Engineering and product documentation
```

## 🚀 Technology Stack

### Core
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Monorepo Manager**: [Turborepo](https://turbo.build/repo)
- **Package Manager**: [pnpm](https://pnpm.io/)

### UI & Styling
- **CSS**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) + Custom Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (Managed)
- **Auth**: Supabase Auth (JWT + Refresh Tokens)
- **Storage**: Supabase Storage (Presigned URLs + S3)

### AI Intelligence
- **OCR Engine**: Tesseract.js / AWS Textract
- **NER**: GPT-4o / Claude 3.5 Sonnet (Medical entity extraction)
- **Queue**: BullMQ (Redis) for async processing

## 🛠️ Development Workflow

1.  **Installation**: `pnpm install`
2.  **Dev Server**: `pnpm dev`
3.  **Build**: `pnpm build`
4.  **Database**: `npx supabase start` (Local development)

---

## 📜 Architectural Principles

- **Feature-First Architecture**: Code is grouped by functionality rather than type.
- **Single Responsibility**: Each component and hook has one clear purpose.
- **Type Safety**: End-to-end type safety from the database to the UI.
- **Patient Privacy**: No data leaves the VPC without explicit, time-limited consent.

---
*PTIALRECORD Engineering Team*
