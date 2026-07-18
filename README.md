# Fleet Expense & Batta Management System

> WhatsApp-first fleet expense tracking — drivers submit expenses by text, voice, or photo. AI extracts data, ledger auto-updates, fleet owner gets a real-time dashboard.

---

## Architecture

```
                     ┌─────────────────────────────┐
  Driver (WhatsApp)  │   Meta Cloud API Webhook     │
  ─── text ────────► │   Gateway-Agent              │
  ─── voice ───────► │   /api/webhook               │
  ─── photo ───────► └──────────┬──────────────────┘
                                │
                     ┌──────────▼──────────────────┐
                     │   Parser-Agent              │
                     │   /services/ai              │
                     │   Gemini 2.0 Flash          │
                     └──────────┬──────────────────┘
                                │ parsed JSON
                     ┌──────────▼──────────────────┐
                     │   Ledger-Agent              │
                     │   /services/db              │
                     │   Supabase / PostgreSQL     │
                     └──────────┬──────────────────┘
                                │ confirmation
  Driver (WhatsApp) ◄───────────┘

  Fleet Owner (Browser)
  ─────────────────────► Next.js Dashboard (/frontend)
```

---

## Quick Start

### 1. Clone & Setup

```bash
git clone <repo>
cd FLEET
cp .env.example .env
# Fill in your credentials in .env
```

### 2. Start Backend

```bash
cd api
npm install
npm run dev
# API running at http://localhost:4000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:3000
```

### 4. Local Database (Docker)

```bash
docker-compose up postgres -d
# PostgreSQL at localhost:5432
# Schema auto-applied from database/schema.sql
```

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

| Variable | Description |
|---|---|
| `WHATSAPP_TOKEN` | Meta WhatsApp permanent access token |
| `WHATSAPP_VERIFY_TOKEN` | Custom string for webhook verification |
| `WHATSAPP_PHONE_NUMBER_ID` | Your WhatsApp Business phone number ID |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (backend) |
| `SUPABASE_ANON_KEY` | Supabase anon key (frontend) |
| `JWT_SECRET` | 64+ char random secret for JWT tokens |
| `NEXTAUTH_SECRET` | NextAuth random secret |

---

## API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register fleet owner |
| POST | `/api/auth/login` | Login (returns JWT) |

### Drivers
| Method | Path | Description |
|---|---|---|
| GET | `/api/drivers` | List all drivers |
| GET | `/api/drivers/:id` | Driver detail |
| POST | `/api/drivers` | Add driver |
| PUT | `/api/drivers/:id` | Update driver |
| DELETE | `/api/drivers/:id` | Deactivate driver |

### Trips
| Method | Path | Description |
|---|---|---|
| GET | `/api/trips` | List trips (filter: status, driver_id) |
| GET | `/api/trips/active` | Active trips only |
| GET | `/api/trips/:id` | Trip detail |
| POST | `/api/trips/start` | Start new trip + allocate batta |
| POST | `/api/trips/:id/end` | End trip |
| POST | `/api/trips/:id/topup` | Top-up batta balance |

### Expenses
| Method | Path | Description |
|---|---|---|
| GET | `/api/expenses` | List expenses (filter: trip_id, type, from, to) |
| GET | `/api/expenses/today` | Today's expenses |
| GET | `/api/expenses/summary` | Group by expense type |
| GET | `/api/expenses/:id` | Single expense |

### Ledger
| Method | Path | Description |
|---|---|---|
| GET | `/api/ledger/trip/:tripId` | Full ledger for trip |
| GET | `/api/ledger/driver/:driverId` | All entries for driver |
| GET | `/api/ledger/dashboard` | Dashboard summary stats |

### Webhook
| Method | Path | Description |
|---|---|---|
| GET | `/api/webhook` | WhatsApp verification handshake |
| POST | `/api/webhook` | Incoming WhatsApp message handler |

---

## WhatsApp Setup

1. Go to [Meta Developers](https://developers.facebook.com)
2. Create a WhatsApp Business App
3. Get your `Phone Number ID` and `Permanent Token`
4. Set webhook URL to: `https://yourdomain.com/api/webhook`
5. Subscribe to `messages` webhook field
6. Use ngrok for local development:

```bash
ngrok http 4000
# Copy the HTTPS URL → set as webhook in Meta console
```

---

## Database Schema

4 core tables + 1 audit log:

| Table | Purpose |
|---|---|
| `fleet_owners` | Dashboard user accounts |
| `drivers` | Driver registry (WhatsApp phone → name) |
| `trips` | Trip lifecycle + batta balance |
| `expenses` | Individual expense records |
| `ledger_entries` | Double-entry-style transaction log |
| `whatsapp_messages` | Raw message audit trail |

Apply schema:

```bash
psql -U fleet_user -d fleet_db -f database/schema.sql
# Or: paste into Supabase SQL editor
```

---

## How Expenses Are Processed

```
1. Driver sends: "Paid 500 for diesel at Vellore"
2. Gateway-Agent receives webhook, normalizes payload
3. Parser-Agent calls Gemini 2.0 Flash → extracts:
   { expense_type: "Diesel", amount: 500, location: "Vellore", confidence: 0.98 }
4. Ledger-Agent:
   - Validates driver phone → finds active trip
   - Checks batta balance (₹15,000)
   - Deducts ₹500 → new balance ₹14,500
   - Inserts expense record
   - Creates ledger entry (debit ₹500, balance ₹14,500)
5. Driver receives WhatsApp reply:
   "✅ Expense of ₹500 for Diesel recorded. Remaining Batta: ₹14,500"
6. Dashboard updates in real-time
```

---

## Dashboard Pages

| Page | URL | Features |
|---|---|---|
| Dashboard | `/` | KPIs, active trips, today's expenses, charts |
| Drivers | `/drivers` | Directory, status, vehicle info |
| Trips | `/trips` | Start/end trip, allocate batta, running balance |
| Expenses | `/expenses` | Timeline, receipt viewer, search & filters |
| Ledger | `/ledger` | Full ledger, export PDF & Excel |
| Reports | `/reports` | Fuel analysis, driver summary, trip profitability |

---

## Deployment

### Backend → Railway / AWS ECS

```bash
cd api
docker build -t fleet-api .
docker push your-registry/fleet-api
```

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

### Database → Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Open SQL Editor
3. Paste contents of `database/schema.sql`
4. Run query

---

## Tech Stack

| Layer | Technology |
|---|---|
| Gateway | Node.js, Express.js |
| AI Parser | Google Gemini 2.0 Flash |
| Ledger | Supabase, PostgreSQL |
| Frontend | Next.js 15, React 19, TypeScript |
| UI | Tailwind CSS, ShadCN UI |
| Charts | Recharts |
| State | Zustand |
| Auth | NextAuth.js |
| Containers | Docker, Docker Compose |
| Monitoring | Winston, Sentry (optional) |

---

## License

MIT
