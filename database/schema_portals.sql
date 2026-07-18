-- ============================================================
-- Portals Module: Driver & Accountant Login
-- ============================================================

-- 1. Add password and employee_id to drivers
ALTER TABLE drivers
  ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Create the driver_expenses table
CREATE TABLE IF NOT EXISTS driver_expenses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
  driver_id       UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id      UUID REFERENCES vehicles(id),
  trip_id         UUID REFERENCES trips(id),
  expense_type    VARCHAR(50) NOT NULL
                  CHECK (expense_type IN ('Fuel', 'Batta', 'Toll', 'Parking', 'Maintenance', 'Food', 'Other')),
  amount          NUMERIC(12,2) NOT NULL DEFAULT 0,
  description     TEXT,
  receipt_url     TEXT,
  expense_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  status          VARCHAR(20) DEFAULT 'Pending'
                  CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  accountant_comments TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_driver_expenses_driver  ON driver_expenses(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_expenses_vehicle ON driver_expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_driver_expenses_trip    ON driver_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_driver_expenses_status  ON driver_expenses(status);
CREATE INDEX IF NOT EXISTS idx_driver_expenses_date    ON driver_expenses(expense_date);
