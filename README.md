# BuildOpt Frontend

This is the Next.js frontend for the **League of Legends Build Optimizer**.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📦 Deployment to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com).

### Quick Deploy

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel.
3. **Build Settings**: The default Next.js settings work automatically.
    * Framework Preset: `Next.js`
    * Root Directory: `frontend` (Important if your repo is monorepo-style)
    * Build Command: `next build`
    * Output Directory: `.next`

### Environment Variables

By default, the application runs in **Mock Data Mode**, meaning it uses embedded JSON data (Champions, Items) instead of connecting to a live Python backend. This is perfect for demos and frontend testing.

To configure the environment:

| Variable | Description | Default |
| item | item | item |
| `NEXT_PUBLIC_USE_MOCK` | Set to `true` to use local mock data. Set to `false` to use real API. | `true` |
| `NEXT_PUBLIC_API_URL` | The URL of your backend API (only if `USE_MOCK=false`). | `http://localhost:8000/api/v1` |

**For a standard Vercel demo deployment, you do NOT need to set any environment variables.**

## 🛠 Project Structure

* `app/`: Next.js App Router pages and layouts.
* `components/`: Reusable UI components (shadcn/ui).
* `lib/mock/`: Static data for items, champions, and builds.
* `lib/api/`: API client handling data fetching (switches between mock/real).
* `lib/hooks/`: React hooks for data access.

## 🎨 Tech Stack

* **Framework**: Next.js 14+ (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS + Shadcn UI
* **Icons**: HugeIcons

## ⚡ Supabase Setup (Backend)

We use **Supabase** for Auth, Database, Vector Search, and Realtime features.

### 1. Create a Project
1.  Go to [database.new](https://database.new) and create a new project.
2.  Save your `Project URL` and `Anon Key`.

### 2. Configure Environment
Create a `.env.local` file in `frontend/`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Deploy Database Schema
Run the migration script in `supabase/migrations/20260216000000_init_schema.sql` via the Supabase SQL Editor.

**Features Enabled:**
*   `profiles`: Linked to Auth users.
*   `builds`: Store user builds (with Vector Search support).
*   `matches`: Store match history & analysis.
*   `pgvector`: Enabled for AI similarity search.
*   `Realtime`: Enabled for `match_events`.
