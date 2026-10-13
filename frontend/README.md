# 5Directions — Resilient Supply Chain Platform

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Supabase
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up the database
Run `supabase-schema.sql` in your Supabase SQL Editor (Dashboard → SQL Editor → New Query → paste → Run).

### 4. Run the development server
```bash
npm run dev
```
Open http://localhost:5173

---

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/sign-in` | Sign In |
| `/sign-up` | Sign Up (Company or Supplier role toggle) |
| `/forgot-password` | Reset Password |
| `/company/dashboard` | Company Dashboard (role-protected) |
| `/company/find-materials` | Find Raw Materials |
| `/company/compare-suppliers` | Compare Suppliers |
| `/company/orders` | Company Orders with tracker |
| `/supplier/dashboard` | Supplier Dashboard (role-protected) |
| `/supplier/my-materials` | My Materials (inline editable) |
| `/supplier/company-requests` | Company Requests (accept/decline) |
| `/supplier/my-orders` | My Orders with tracker |

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set in Vercel dashboard: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## Design System

See `stitch-final/DESIGN.md` for full brand tokens. Tailwind config implements the Fiery Ocean palette.

**Brand Colours:** Warm Cream `#FDF0D5` · Deep Navy `#003049` · Ocean Blue `#669BBC` · Crimson Red `#C1121F` · Deep Burgundy `#780000`
