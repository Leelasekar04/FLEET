// ============================================================
// Ledger-Agent — Supabase Client
// ============================================================
const { createClient } = require("@supabase/supabase-js");
const logger = require("../../utils/logger");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.warn("⚠️  Supabase credentials not configured. Running in mock mode.");
}

// Service role client (bypasses Row Level Security — for backend use only)
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

// ─── Public anon client (for frontend queries via API) ────
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabasePublic = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── Mock client for dev without Supabase ─────────────────
const mockDB = {
  drivers: [
    {
      id: "mock-driver-1",
      name: "Raju Driver",
      phone: "9876543210",
      employee_id: "DRV001",
      // Hash for 'password123'
      password_hash: "$2a$12$6/GOuQ93nR1E7jnPBAbTnOVXe9ncOP6EqUUx2y033SJw/4rjJpst.", 
      company_id: "comp-1"
    },
    {
      id: "mock-driver-2",
      name: "Ali Khan",
      phone: "5551234567",
      employee_id: "DRV002",
      password_hash: "$2a$12$6/GOuQ93nR1E7jnPBAbTnOVXe9ncOP6EqUUx2y033SJw/4rjJpst.", 
      company_id: "comp-1"
    },
    {
      id: "mock-178",
      name: "leela",
      phone: "+919080483897",
      employee_id: "DRV003",
      password_hash: "$2a$12$6/GOuQ93nR1E7jnPBAbTnOVXe9ncOP6EqUUx2y033SJw/4rjJpst.", 
      company_id: "comp-1"
    }
  ],
  fleet_owners: [
    {
      id: "mock-admin",
      name: "Admin",
      email: "owner@yourfleet.com",
      password_hash: "$2a$12$6/GOuQ93nR1E7jnPBAbTnOVXe9ncOP6EqUUx2y033SJw/4rjJpst."
    }
  ],
  users: [
    {
      id: "mock-accountant",
      name: "Finance Admin",
      email: "admin@fleet.com",
      role: "accountant",
      password_hash: "$2a$12$6/GOuQ93nR1E7jnPBAbTnOVXe9ncOP6EqUUx2y033SJw/4rjJpst.",
      company_id: "comp-1"
    },
    {
      id: "mock-company-admin",
      name: "Company Admin",
      email: "admin@company.com",
      role: "COMPANY_ADMIN",
      password_hash: "$2a$12$6/GOuQ93nR1E7jnPBAbTnOVXe9ncOP6EqUUx2y033SJw/4rjJpst.",
      company_id: "comp-1",
      status: "active",
      created_at: new Date().toISOString()
    }
  ],
  trips: [
    {
      id: "mock-trip-1",
      driver_id: "mock-178",
      trip_code: "TRIP-7770",
      origin: "Hyderabad",
      destination: "Mumbai",
      start_date: new Date().toISOString(),
      status: "active",
      opening_batta: 5000,
      current_balance: 4300,
      vehicles: {
        id: "veh-1",
        vehicle_number: "TN01AB1234"
      }
    },
    {
      id: "mock-trip-2",
      driver_id: "mock-driver-2",
      trip_code: "TRIP-2002",
      origin: "Bangalore",
      destination: "Chennai",
      status: "active",
      opening_batta: 2000,
      current_balance: 1500,
      vehicles: {
        id: "mock-veh-1",
        vehicle_number: "KA-01-XX-9999"
      }
    }
  ],
  expenses: [
    {
      id: "exp-1",
      trip_id: "mock-trip-1",
      expense_type: "Fuel",
      amount: 4500,
      status: "Pending",
      receipt_url: "https://images.unsplash.com/photo-1621531707921-171804369e96?q=80&w=600&auto=format&fit=crop",
      expense_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: "exp-2",
      trip_id: "mock-trip-1",
      expense_type: "Toll",
      amount: 450,
      status: "Approved",
      expense_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: "exp-3",
      trip_id: "mock-trip-1",
      expense_type: "Food",
      amount: 250,
      status: "Pending",
      expense_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ],
  companies: [
    {
      id: "comp-1",
      name: "Default Company",
      subscription_plan: "plan_pro_1",
      status: "active",
      created_at: new Date().toISOString()
    }
  ],
  subscription_plans: [
    {
      id: "plan_starter_1",
      name: "Starter",
      description: "For small fleets",
      monthly_price: 999,
      annual_price: 9990,
      trial_days: 14,
      currency: "INR",
      status: "active",
      limits: { vehicles: 10, drivers: 10, users: 3, trips: 500, storage: 5 },
      features: {
        vehicles: true, drivers: true, trips: true,
        reports: "Basic Reports",
        maintenance: false, gps: false, fuel: false,
        analytics: false, api: false, multi_branch: false, white_label: false
      },
      stats: { active_subscribers: 142, revenue: 141858 },
      created_at: new Date().toISOString()
    },
    {
      id: "plan_pro_1",
      name: "Professional",
      description: "For growing fleets",
      monthly_price: 2999,
      annual_price: 29990,
      trial_days: 14,
      currency: "INR",
      status: "active",
      limits: { vehicles: 50, drivers: 50, users: 10, trips: -1, storage: 20 },
      features: {
        vehicles: true, drivers: true, trips: true,
        reports: "Advanced Reports",
        maintenance: true, gps: false, fuel: false,
        analytics: false, api: false, multi_branch: false, white_label: false
      },
      stats: { active_subscribers: 312, revenue: 935688 },
      created_at: new Date().toISOString()
    },
    {
      id: "plan_business_1",
      name: "Business",
      description: "For large operations",
      monthly_price: 7999,
      annual_price: 79990,
      trial_days: 14,
      currency: "INR",
      status: "active",
      limits: { vehicles: 200, drivers: 200, users: 25, trips: -1, storage: 100 },
      features: {
        vehicles: true, drivers: true, trips: true,
        reports: "Advanced Reports",
        maintenance: true, gps: true, fuel: true,
        analytics: true, api: false, multi_branch: false, white_label: false
      },
      stats: { active_subscribers: 85, revenue: 679915 },
      created_at: new Date().toISOString()
    },
    {
      id: "plan_enterprise_1",
      name: "Enterprise",
      description: "For massive fleets",
      monthly_price: 0,
      annual_price: 0,
      trial_days: 0,
      currency: "INR",
      status: "active",
      limits: { vehicles: -1, drivers: -1, users: -1, trips: -1, storage: -1 },
      features: {
        vehicles: true, drivers: true, trips: true,
        reports: "Advanced Reports",
        maintenance: true, gps: true, fuel: true,
        analytics: true, api: true, multi_branch: true, white_label: true
      },
      stats: { active_subscribers: 12, revenue: 0 },
      created_at: new Date().toISOString()
    }
  ],
  subscription_invoices: [
    {
      id: "inv_1",
      company_id: "comp-1",
      amount_due: 4999,
      amount_paid: 4999,
      status: "paid",
      invoice_pdf: "https://example.com/invoice.pdf",
      created_at: new Date().toISOString()
    }
  ],
  subscription_payments: [
    {
      id: "pay_1",
      invoice_id: "inv_1",
      company_id: "comp-1",
      amount: 4999,
      status: "succeeded",
      payment_method: "card",
      created_at: new Date().toISOString()
    }
  ],
  ledger_entries: [],
  whatsapp_messages: [],
  invoices: [],
  vehicles: [
    {
      id: "veh-1",
      vehicle_number: "TN01AB1234",
      type: "Truck",
      make: "Tata",
      model: "Prima 4928.S",
      year: 2021,
      capacity_tons: 25,
      status: "active",
      branch: "Chennai",
      rc_expiry: "2035-06-01",
      insurance_expiry: "2026-09-15",
      permit_expiry: "2027-03-01",
      fitness_expiry: "2026-12-01",
      puc_expiry: "2026-08-10",
      created_at: new Date().toISOString()
    }
  ],
  vehicle_assignments: [
    {
      id: "assign-1",
      driver_id: "mock-178",
      vehicle_id: "veh-1",
      effective_date: "2026-01-01",
      end_date: null,
      status: "active",
      created_at: new Date().toISOString()
    }
  ]
};

function getMockClient() {
  return {
    from: (table) => ({
      select: (cols) => {
        let results = mockDB[table] ? [...mockDB[table]] : [];
        if (table === 'trips') {
          results = results.map(t => ({
            ...t,
            vehicles: t.vehicles || { vehicle_number: t.vehicle_no || "Unknown" },
            drivers: t.drivers || (mockDB.drivers || []).find(d => d.id === t.driver_id)
          }));
        }
        const chain = {
          eq: (col, val) => {
            results = results.filter(r => r[col] === val);
            return chain;
          },
          or: (query) => {
            const conditions = query.split(',');
            results = results.filter(row => {
              return conditions.some(cond => {
                const [c, v] = cond.split('.eq.');
                return row[c] === v;
              });
            });
            return chain;
          },
          limit: (n) => {
            results = results.slice(0, n);
            return chain;
          },
          order: () => chain,
          single: async () => {
            const item = results[0];
            return { data: item || null, error: item ? null : { message: "Not found" } };
          },
          then: (resolve) => resolve({ data: results, error: null })
        };
        return chain;
      },
      insert: (rows) => ({
        select: () => {
          const row = Array.isArray(rows) ? rows[0] : rows;
          const newRow = { id: `mock-${Date.now()}`, ...row, created_at: new Date().toISOString() };
          if (mockDB[table]) mockDB[table].unshift(newRow);
          return {
            single: async () => ({ data: newRow, error: null }),
            then: (resolve) => resolve({ data: [newRow], error: null })
          };
        },
      }),
      update: (data) => {
        let conditions = [];
        const chain = {
          eq: (col, val) => {
            conditions.push({ col, val });
            return chain;
          },
          select: () => chain,
          single: async () => {
            const idx = mockDB[table]?.findIndex((r) => 
              conditions.every(c => r[c.col] === c.val)
            );
            if (idx >= 0) {
              mockDB[table][idx] = { ...mockDB[table][idx], ...data };
              return { data: mockDB[table][idx], error: null };
            }
            return { data: null, error: { message: "Not found" } };
          },
          then: (resolve) => {
            const idx = mockDB[table]?.findIndex((r) => 
              conditions.every(c => r[c.col] === c.val)
            );
            if (idx >= 0) {
              mockDB[table][idx] = { ...mockDB[table][idx], ...data };
              resolve({ data: mockDB[table][idx], error: null });
            } else {
              resolve({ data: null, error: null });
            }
          }
        };
        return chain;
      },
    }),
  };
}

const client = supabase || getMockClient();
const isMock = !supabase;

if (isMock) {
  logger.warn("🔧 Using in-memory mock database — configure SUPABASE_URL for persistence");
}

module.exports = { supabase: client, supabasePublic, isMock, mockDB };
