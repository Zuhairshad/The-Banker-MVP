# Banker Expert

AI-powered crypto wallet analysis platform providing personalized investment insights.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Google Gemini API
- **Crypto Data**: CoinGecko API

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Fill in your API keys in `.env`.

### 3. Run Development Servers

```bash
pnpm dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Deployment

### Frontend (Vercel)

```bash
cd apps/web
vercel deploy
```

Environment variables to set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (your backend URL)

### Backend (Railway/Render)

```bash
cd apps/api
# Deploy to Railway
railway up

# Or Render
render deploy
```

Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `COINGECKO_API_KEY`
- `PORT`

## Project Structure

```
banker-expert/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared TypeScript types
└── supabase/
    └── migrations/   # Database migrations
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development servers |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |
| `pnpm typecheck` | TypeScript check |

## Features

- **Landing Page**: Marketing page with features and CTA
- **Auth**: Login/Register with investment quiz (10 preference sliders)
- **Dashboard**: Stats cards, quick analysis form
- **Wallets**: Connect and manage crypto wallets
- **Reports**: AI-generated analysis with insights
- **Settings**: Investment preferences, account settings

## License

MIT
