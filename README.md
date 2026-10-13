# 5Directions — Resilient Supply Chain Platform

Welcome to the 5Directions Supply Chain Resilience Platform codebase. The project is split into dedicated **`frontend`** and **`backend`** workspaces.

```
SUPPLY CHAIN/
├── frontend/             # React 19 + Vite + Tailwind CSS + Stitch Design System
│   ├── src/
│   │   ├── components/   # Headers, AuthGuard, Layouts, Logo
│   │   ├── context/      # AuthContext (Role-based state & Supabase/REST ready)
│   │   ├── pages/        # Landing, SignIn, SignUp, ForgotPassword,
│   │   │                 # Company Dashboard, FindMaterials, CompareSuppliers, Orders,
│   │   │                 # Supplier Dashboard, MyMaterials, CompanyRequests, MyOrders
│   │   └── assets/       # Brand logo, icons, styling
│   └── package.json
│
├── backend/              # Node.js + Express REST API Server
│   ├── src/
│   │   ├── controllers/  # Auth, Materials, Suppliers, Orders, Disruptions
│   │   ├── middleware/   # JWT Auth & Error Handling
│   │   ├── routes/       # API endpoints (/api/auth, /api/materials, etc.)
│   │   └── data/         # Seeded domain mock database
│   └── package.json
│
├── stitch-final/         # Original Google Stitch design export (preserved)
└── package.json          # Root scripts runner
```

---

## Quick Start

### 1. Run the Frontend (UI)
```bash
cd frontend
npm install
npm run dev
```
Runs at: **`http://localhost:5173`**

### 2. Run the Backend (API)
```bash
cd backend
npm install
npm run dev
```
Runs at: **`http://localhost:5000`** (Health check: `http://localhost:5000/api/health`)
