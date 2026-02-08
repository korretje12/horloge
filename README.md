# Horloge - Watch Collection Platform

A Next.js application for watch enthusiasts to browse watches, build virtual watchboxes, and share wristcheck photos.

## Features

- **Watch Database** — Browse a curated collection of watches with search and category filters
- **Virtual Watchbox** — Sign in to build your personal collection and wishlist
- **Wristcheck** — Upload wrist shots and view the community's Wall of Fame
- **Authentication** — Secure email-based authentication via Supabase Auth

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Database, Auth, Storage)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/korretje12/horloge.git
cd horloge
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

3. Run the SQL schema in Supabase SQL Editor (see `supabase-schema.sql`) — this creates the tables, RLS policies, storage bucket, and seed data.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Schema

| Table | Description |
|-------|-------------|
| `watches` | All watches (brand, model, reference_number, image_url, movement, category) |
| `user_collection` | Links users to watches with status (owned / wishlist) |
| `wristchecks` | Wristcheck photos (user_id, watch_model, image_url, caption) |

## Project Structure

```
src/
├── app/
│   ├── auth/           # Login, signup, and OAuth callback
│   ├── profile/        # Virtual watchbox (user collection)
│   ├── watches/        # Watch database with filters
│   ├── wristcheck/     # Photo upload & Wall of Fame
│   ├── layout.tsx      # Root layout with Navbar
│   └── page.tsx        # Homepage with latest wristchecks feed
├── components/
│   ├── Navbar.tsx       # Navigation with auth state
│   └── WatchCard.tsx    # Reusable watch display card
├── lib/
│   ├── supabase.ts      # Supabase browser client
│   └── supabase-server.ts # Supabase server client
└── types/
    └── database.ts      # TypeScript interfaces
```
