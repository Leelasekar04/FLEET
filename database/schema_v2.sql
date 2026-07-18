-- ============================================================
-- Fleet SaaS Platform — Schema V2 (Full 24-Module Expansion)
-- Run this AFTER schema.sql (adds new tables, alters existing)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- ============================================================
-- MULTI-TENANCY LAYER
-- ============================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50)  NOT NULL,  -- Basic | Pro | Enterprise
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_drivers INT  DEFAULT 10,
  max_vehicles INT DEFAULT 10,
  max_branches INT DEFAULT 1,
  max_storage_gb INT DEFAULT 5,
  features    JSONB DEFAULT '{}',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(200) NOT NULL,
  gst_number      VARCHAR(20),
  pan_number      VARCHAR(15),
  address         TEXT,
  city            VARCHAR(100),
  state           VARCHAR(100),
  pincode         VARCHAR(10),
  phone           VARCHAR(20),
  email           VARCHAR(200),
  logo_url        TEXT,
  plan_id         UUID REFERENCES subscription_plans(id),
  subscription_status VARCHAR(20) DEFAULT 'trial'
                  CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  trial_ends_at   TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name        VARCHAR(200) NOT NULL,
  address     TEXT,
  city        VARCHAR(100),
  state       VARCHAR(100),
  phone       VARCHAR(20),
  manager_name VARCHAR(200),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER MANAGEMENT (replaces fleet_owners, adds roles)
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin', 'fleet_owner', 'branch_manager',
  'accountant', 'dispatcher', 'driver'
);

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  name            VARCHAR(200) NOT NULL,
  email           VARCHAR(200) UNIQUE,
  phone           VARCHAR(20) UNIQUE,
  password_hash   TEXT,
  role            user_role NOT NULL DEFAULT 'dispatcher',
  avatar_url      TEXT,
  is_active       BOOLEAN DEFAULT true,
  last_login_at   TIMESTAMPTZ,
  otp_code        VARCHAR(6),
  otp_expires_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  role        user_role NOT NULL,
  module      VARCHAR(100) NOT NULL, -- vehicles, trips, expenses, etc.
  can_view    BOOLEAN DEFAULT false,
  can_create  BOOLEAN DEFAULT false,
  can_edit    BOOLEAN DEFAULT false,
  can_delete  BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  can_export  BOOLEAN DEFAULT false
);

-- ============================================================
-- VEHICLE MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS vehicles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id),
  vehicle_number  VARCHAR(30) UNIQUE NOT NULL,
  vehicle_type    VARCHAR(50),    -- Truck | Trailer | Container | Tanker
  make            VARCHAR(100),   -- Tata | Ashok Leyland | Eicher
  model           VARCHAR(100),
  year            INT,
  capacity_tons   NUMERIC(8,2),
  fuel_type       VARCHAR(20) DEFAULT 'diesel'
                  CHECK (fuel_type IN ('diesel', 'petrol', 'cng', 'electric')),
  engine_number   VARCHAR(100),
  chassis_number  VARCHAR(100),
  color           VARCHAR(50),
  status          VARCHAR(20) DEFAULT 'active'
                  CHECK (status IN ('active', 'in_trip', 'maintenance', 'inactive')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id      UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  doc_type        VARCHAR(50) NOT NULL
                  CHECK (doc_type IN ('rc', 'insurance', 'permit', 'fitness', 'puc', 'other')),
  doc_number      VARCHAR(100),
  issue_date      DATE,
  expiry_date     DATE,
  file_url        TEXT,
  is_verified     BOOLEAN DEFAULT false,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_maintenance (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id      UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(50) NOT NULL
                   CHECK (maintenance_type IN ('scheduled', 'breakdown', 'accident')),
  service_type    VARCHAR(100),   -- Oil Change | Tyre | Engine | etc.
  description     TEXT,
  garage_name     VARCHAR(200),
  garage_phone    VARCHAR(20),
  odometer_km     INT,
  cost            NUMERIC(12,2) DEFAULT 0,
  service_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  next_service_date DATE,
  next_service_km INT,
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_locations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id  UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  trip_id     UUID REFERENCES trips(id) ON DELETE SET NULL,
  latitude    NUMERIC(10,7),
  longitude   NUMERIC(10,7),
  speed_kmph  NUMERIC(6,2),
  heading     INT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DRIVER EXPANSION
-- ============================================================

CREATE TABLE IF NOT EXISTS driver_documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id   UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  doc_type    VARCHAR(50) NOT NULL
              CHECK (doc_type IN ('license', 'aadhaar', 'pan', 'medical', 'other')),
  doc_number  VARCHAR(100),
  issue_date  DATE,
  expiry_date DATE,
  file_url    TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS driver_ratings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id   UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  trip_id     UUID REFERENCES trips(id) ON DELETE SET NULL,
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  rated_by    UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to drivers (multi-tenancy + extra fields)
ALTER TABLE drivers
  ADD COLUMN IF NOT EXISTS company_id   UUID REFERENCES companies(id),
  ADD COLUMN IF NOT EXISTS branch_id    UUID REFERENCES branches(id),
  ADD COLUMN IF NOT EXISTS aadhaar_no   VARCHAR(12),
  ADD COLUMN IF NOT EXISTS address      TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name  VARCHAR(200),
  ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS avatar_url   TEXT;

-- ============================================================
-- TRIP EXPANSION
-- ============================================================

CREATE TABLE IF NOT EXISTS customers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name          VARCHAR(200) NOT NULL,
  gst_number    VARCHAR(20),
  contact_person VARCHAR(200),
  phone         VARCHAR(20),
  email         VARCHAR(200),
  address       TEXT,
  city          VARCHAR(100),
  state         VARCHAR(100),
  credit_limit  NUMERIC(12,2) DEFAULT 0,
  outstanding   NUMERIC(12,2) DEFAULT 0,
  status        VARCHAR(20) DEFAULT 'active',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name          VARCHAR(200) NOT NULL,
  vendor_type   VARCHAR(50) NOT NULL
                CHECK (vendor_type IN ('fuel', 'repair', 'toll', 'loading', 'other')),
  gst_number    VARCHAR(20),
  phone         VARCHAR(20),
  address       TEXT,
  city          VARCHAR(100),
  balance       NUMERIC(12,2) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS load_types (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO load_types (name) VALUES
  ('General'), ('Fragile'), ('Perishable'), ('Hazardous'),
  ('Bulk Liquid'), ('Oversized'), ('Temperature Controlled')
ON CONFLICT (name) DO NOTHING;

-- Add trip expansion columns
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS company_id     UUID REFERENCES companies(id),
  ADD COLUMN IF NOT EXISTS branch_id      UUID REFERENCES branches(id),
  ADD COLUMN IF NOT EXISTS vehicle_id     UUID REFERENCES vehicles(id),
  ADD COLUMN IF NOT EXISTS customer_id    UUID REFERENCES customers(id),
  ADD COLUMN IF NOT EXISTS load_type_id   INT REFERENCES load_types(id),
  ADD COLUMN IF NOT EXISTS distance_km    NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS freight_amount NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS driver_rating  SMALLINT,
  ADD COLUMN IF NOT EXISTS pod_url        TEXT;  -- Proof of delivery

-- ============================================================
-- FUEL MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS fuel_entries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  trip_id         UUID REFERENCES trips(id) ON DELETE SET NULL,
  vehicle_id      UUID REFERENCES vehicles(id),
  driver_id       UUID REFERENCES drivers(id),
  fuel_station    VARCHAR(200),
  fuel_type       VARCHAR(20) DEFAULT 'diesel',
  quantity_liters NUMERIC(10,3) NOT NULL,
  rate_per_liter  NUMERIC(8,2) NOT NULL,
  amount          NUMERIC(12,2) NOT NULL,
  odometer_start  INT,
  odometer_end    INT,
  mileage_kmpl    NUMERIC(8,3),
  vendor_id       UUID REFERENCES vendors(id),
  receipt_url     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TOLL MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS toll_entries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  trip_id     UUID REFERENCES trips(id) ON DELETE SET NULL,
  vehicle_id  UUID REFERENCES vehicles(id),
  driver_id   UUID REFERENCES drivers(id),
  toll_name   VARCHAR(200),
  location    VARCHAR(200),
  highway     VARCHAR(100),
  amount      NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'fastag'
               CHECK (payment_method IN ('fastag', 'cash', 'card')),
  fastag_id   VARCHAR(50),
  receipt_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPENSE EXPANSION (approval workflow)
-- ============================================================

ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS company_id     UUID REFERENCES companies(id),
  ADD COLUMN IF NOT EXISTS status         VARCHAR(20) DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS approved_by    UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS approved_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS vendor_id      UUID REFERENCES vendors(id),
  ADD COLUMN IF NOT EXISTS is_duplicate   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS duplicate_of   UUID REFERENCES expenses(id);

-- ============================================================
-- ACCOUNTING MODULE
-- ============================================================

CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code          VARCHAR(20) NOT NULL,
  name          VARCHAR(200) NOT NULL,
  account_type  VARCHAR(30) NOT NULL
                CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_id     UUID REFERENCES chart_of_accounts(id),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (company_id, code)
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  entry_number  VARCHAR(50),
  description   TEXT,
  reference_type VARCHAR(30), -- expense | trip | settlement | topup
  reference_id  UUID,
  entry_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  posted_by     UUID REFERENCES users(id),
  is_posted     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_lines (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_entry_id  UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id        UUID NOT NULL REFERENCES chart_of_accounts(id),
  debit_amount      NUMERIC(15,2) DEFAULT 0,
  credit_amount     NUMERIC(15,2) DEFAULT 0,
  description       TEXT
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID REFERENCES companies(id),
  user_id     UUID REFERENCES users(id),
  type        VARCHAR(50) NOT NULL,  -- expense_recorded | low_balance | doc_expiry | trip_completed
  title       VARCHAR(200) NOT NULL,
  body        TEXT,
  channel     VARCHAR(20) DEFAULT 'in_app'
              CHECK (channel IN ('in_app', 'whatsapp', 'email', 'push')),
  is_read     BOOLEAN DEFAULT false,
  reference_type VARCHAR(30),
  reference_id   UUID,
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID REFERENCES companies(id),
  user_id       UUID REFERENCES users(id),
  action        VARCHAR(50) NOT NULL,  -- create | update | delete | approve | reject | login
  entity_type   VARCHAR(50) NOT NULL,  -- expense | trip | driver | vehicle
  entity_id     UUID,
  old_values    JSONB,
  new_values    JSONB,
  ip_address    VARCHAR(45),
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FILE MANAGER
-- ============================================================

CREATE TABLE IF NOT EXISTS file_manager (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  folder        VARCHAR(200) NOT NULL DEFAULT '/',  -- /receipts | /drivers | /vehicles
  file_name     VARCHAR(300) NOT NULL,
  file_url      TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type     VARCHAR(100),
  entity_type   VARCHAR(50),  -- what it belongs to
  entity_id     UUID,
  uploaded_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES (new tables)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_company         ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_company      ON vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status       ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_docs_expiry   ON vehicle_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_driver_docs_expiry    ON driver_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_fuel_trip             ON fuel_entries(trip_id);
CREATE INDEX IF NOT EXISTS idx_toll_trip             ON toll_entries(trip_id);
CREATE INDEX IF NOT EXISTS idx_audit_company         ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity          ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id, is_read);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default subscription plans
INSERT INTO subscription_plans (name, price_monthly, max_drivers, max_vehicles, max_branches) VALUES
  ('Trial',      0,    5,   5,  1),
  ('Basic',    999,   20,  20,  1),
  ('Pro',     2999,  100, 100,  5),
  ('Enterprise', 9999, 999, 999, 50)
ON CONFLICT DO NOTHING;

-- Default role permissions template (per role)
-- Fleet Owner gets everything; others have limited access

 
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
 - -   V E H I C L E   A S S I G N M E N T S 
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
 
 C R E A T E   T A B L E   I F   N O T   E X I S T S   v e h i c l e _ a s s i g n m e n t s   ( 
     i d                             U U I D   P R I M A R Y   K E Y   D E F A U L T   u u i d _ g e n e r a t e _ v 4 ( ) , 
     c o m p a n y _ i d             U U I D   R E F E R E N C E S   c o m p a n i e s ( i d )   O N   D E L E T E   C A S C A D E , 
     d r i v e r _ i d               U U I D   N O T   N U L L   R E F E R E N C E S   d r i v e r s ( i d )   O N   D E L E T E   C A S C A D E , 
     v e h i c l e _ i d             U U I D   N O T   N U L L   R E F E R E N C E S   v e h i c l e s ( i d )   O N   D E L E T E   C A S C A D E , 
     e f f e c t i v e _ d a t e     D A T E   N O T   N U L L   D E F A U L T   C U R R E N T _ D A T E , 
     e n d _ d a t e                 D A T E , 
     s t a t u s                     V A R C H A R ( 2 0 )   D E F A U L T   ' a c t i v e ' 
                                     C H E C K   ( s t a t u s   I N   ( ' a c t i v e ' ,   ' i n a c t i v e ' ) ) , 
     c r e a t e d _ a t             T I M E S T A M P T Z   D E F A U L T   N O W ( ) , 
     u p d a t e d _ a t             T I M E S T A M P T Z   D E F A U L T   N O W ( ) 
 ) ; 
 
 C R E A T E   I N D E X   I F   N O T   E X I S T S   i d x _ v e h i c l e _ a s s i g n m e n t s _ d r i v e r   O N   v e h i c l e _ a s s i g n m e n t s ( d r i v e r _ i d ) ; 
 C R E A T E   I N D E X   I F   N O T   E X I S T S   i d x _ v e h i c l e _ a s s i g n m e n t s _ v e h i c l e   O N   v e h i c l e _ a s s i g n m e n t s ( v e h i c l e _ i d ) ; 
 C R E A T E   I N D E X   I F   N O T   E X I S T S   i d x _ v e h i c l e _ a s s i g n m e n t s _ s t a t u s   O N   v e h i c l e _ a s s i g n m e n t s ( s t a t u s ) ; 
  
 