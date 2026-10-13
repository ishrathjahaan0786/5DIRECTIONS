# 5Directions Backend API

RESTful API backend for the **5Directions** supply chain resilience platform.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` (optional, defaults are pre-configured):
```bash
cp .env.example .env
```

### 3. Run the Development Server
```bash
npm run dev
```
The server will start at: `http://localhost:5000`

---

## API Endpoints Reference

### Health Check
- `GET /api/health` — Service status, uptime, timestamp

### Authentication
- `POST /api/auth/login` — Sign in with `{ email, password }`
- `POST /api/auth/register` — Register company or supplier `{ email, password, fullName, role, companyName, country }`
- `GET /api/auth/me` — Current authenticated user profile (`Authorization: Bearer <token>`)
- `PUT /api/auth/profile` — Update user details

### Materials Catalog
- `GET /api/materials` — List all raw materials (query params: `search`, `category`, `supplierId`, `minPrice`, `maxPrice`)
- `GET /api/materials/:id` — Single raw material details
- `POST /api/materials` — Add new raw material (supplier inventory)
- `PUT /api/materials/:id` — Update stock, pricing, and specs
- `DELETE /api/materials/:id` — Remove material

### Suppliers & Allocations
- `GET /api/suppliers` — List certified suppliers with reliability scores
- `GET /api/suppliers/:id` — Supplier profile with certificates
- `GET /api/suppliers/compare?ids=1,2,3` — Side-by-side comparison matrix
- `POST /api/suppliers/allocations` — Update multi-supplier risk allocation shares (sum to 100%)

### Orders & Procurement
- `GET /api/orders` — List orders (query params: `status`, `supplierId`, `buyer`, `stage`)
- `GET /api/orders/:id` — Single order with fulfillment stage
- `POST /api/orders` — Issue new Purchase Order (PO)
- `PATCH /api/orders/:id/status` — Advance fulfillment tracker stage (1: Placed, 2: QA, 3: In Transit, 4: Delivered)
- `POST /api/orders/:id/respond` — Supplier respond (`accept`, `decline`, `counter`)

### Disruption Intelligence & Risk
- `GET /api/disruptions` — Live global supply chain disruption alerts
- `GET /api/disruptions/overview` — High-level KPI risk index for executive dashboard
- `POST /api/disruptions` — Register new disruption event
