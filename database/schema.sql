-- ============================================================
-- Fleet Expense & Batta Management System — PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------
-- Table: fleet_owners
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS fleet_owners (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(200)        NOT NULL,
  email        VARCHAR(200) UNIQUE NOT NULL,
  phone        VARCHAR(20),
  password_hash TEXT               NOT NULL,
  created_at   TIMESTAMPTZ        DEFAULT NOW(),
  updated_at   TIMESTAMPTZ        DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: drivers
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS drivers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id     UUID REFERENCES fleet_owners(id) ON DELETE CASCADE,
  phone        VARCHAR(20)  UNIQUE NOT NULL,     -- WhatsApp number e.g. +919999999999
  name         VARCHAR(200) NOT NULL,
  license_no   VARCHAR(50),
  vehicle_no   VARCHAR(30),
  status       VARCHAR(20)  DEFAULT 'active'     -- active | inactive | suspended
               CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: trips
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id        UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  trip_code        VARCHAR(50) UNIQUE NOT NULL,  -- e.g. TRIP-1001
  origin           VARCHAR(200),
  destination      VARCHAR(200),
  start_date       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date         TIMESTAMPTZ,
  opening_batta    NUMERIC(12,2) NOT NULL DEFAULT 0.00,   -- Initial batta allocated
  current_balance  NUMERIC(12,2) NOT NULL DEFAULT 0.00,   -- Running balance
  status           VARCHAR(20)   DEFAULT 'active'
                   CHECK (status IN ('active', 'completed', 'cancelled')),
  notes            TEXT,
  created_at       TIMESTAMPTZ   DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: expenses
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id       UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  expense_type  VARCHAR(100) NOT NULL,  -- Diesel | Tyre Repair | Food | Toll | etc.
  amount        NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  location      VARCHAR(200),
  merchant_name VARCHAR(200),
  notes         TEXT,
  receipt_url   TEXT,                   -- Supabase Storage URL
  message_type  VARCHAR(20) DEFAULT 'text'
                CHECK (message_type IN ('text', 'audio', 'image')),
  confidence    NUMERIC(4,3),           -- AI confidence score 0.000–1.000
  submitted_via VARCHAR(30) DEFAULT 'whatsapp',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: ledger_entries
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS ledger_entries (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id          UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  expense_id       UUID REFERENCES expenses(id) ON DELETE SET NULL,
  transaction_type VARCHAR(30) NOT NULL
                   CHECK (transaction_type IN ('credit', 'debit', 'opening', 'topup', 'settlement')),
  amount           NUMERIC(12,2) NOT NULL,
  balance_after    NUMERIC(12,2) NOT NULL,
  description      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: whatsapp_messages (audit log)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_phone   VARCHAR(20) NOT NULL,
  wa_message_id  VARCHAR(100) UNIQUE,
  message_type   VARCHAR(20),           -- text | audio | image
  raw_payload    JSONB,
  parsed_expense JSONB,
  status         VARCHAR(20) DEFAULT 'received'
                 CHECK (status IN ('received', 'parsed', 'recorded', 'failed')),
  error_message  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- Indexes
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_drivers_phone      ON drivers(phone);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id    ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status       ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_code         ON trips(trip_code);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id   ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_type      ON expenses(expense_type);
CREATE INDEX IF NOT EXISTS idx_expenses_created   ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_trip_id     ON ledger_entries(trip_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_phone     ON whatsapp_messages(driver_phone);

-- -------------------------------------------------------
-- Function: auto-update updated_at timestamp
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_fleet_owners_updated_at
  BEFORE UPDATE ON fleet_owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- Seed: Expense Type Reference
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS expense_categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

INSERT INTO expense_categories (name, description) VALUES
  ('Diesel',        'Fuel expenses'),
  ('Petrol',        'Fuel expenses'),
  ('Tyre Repair',   'Tyre puncture or replacement'),
  ('Toll',          'Highway toll charges'),
  ('Food',          'Driver meals and refreshments'),
  ('Maintenance',   'Vehicle maintenance and repairs'),
  ('Loading',       'Loading/unloading charges'),
  ('Parking',       'Parking fees'),
  ('Police',        'Traffic fines or police charges'),
  ('Miscellaneous', 'Other uncategorized expenses')
ON CONFLICT (name) DO NOTHING;

-- -------------------------------------------------------
-- View: trip_summary (used by dashboard)
-- -------------------------------------------------------
CREATE OR REPLACE VIEW trip_summary AS
SELECT
  t.id,
  t.trip_code,
  t.status,
  t.start_date,
  t.end_date,
  t.opening_batta,
  t.current_balance,
  d.name        AS driver_name,
  d.phone       AS driver_phone,
  d.vehicle_no,
  t.origin,
  t.destination,
  COALESCE(SUM(e.amount), 0)   AS total_expenses,
  COUNT(e.id)                  AS expense_count,
  (t.opening_batta - t.current_balance) AS total_spent
FROM trips t
JOIN drivers d ON d.id = t.driver_id
LEFT JOIN expenses e ON e.trip_id = t.id
GROUP BY t.id, d.id;
