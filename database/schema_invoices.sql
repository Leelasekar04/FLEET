-- ============================================================
-- Invoices Module
-- ============================================================

CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id),
  trip_id         UUID REFERENCES trips(id),
  subtotal        NUMERIC(12,2) DEFAULT 0,
  fuel_amount     NUMERIC(12,2) DEFAULT 0,
  batta_amount    NUMERIC(12,2) DEFAULT 0,
  tax_amount      NUMERIC(12,2) DEFAULT 0,
  grand_total     NUMERIC(12,2) DEFAULT 0,
  status          VARCHAR(20) DEFAULT 'draft'
                  CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_company      ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer     ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_trip         ON invoices(trip_id);
