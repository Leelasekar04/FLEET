"use client";
import {
  Truck, Users, Receipt, TrendingUp, TrendingDown,
  MapPin, Clock, ChevronRight, Fuel, Wrench, AlertTriangle,
  CheckCircle2, DollarSign, Plus,
  CreditCard, Activity, Timer, Shield, Route, LucideIcon,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";

// ─── Mock fleet data ──────────────────────────────────────
const stats = {
  total_vehicles: 48,
  active_vehicles: 34,
  vehicles_in_maintenance: 5,
  idle_vehicles: 9,
  total_drivers: 52,
  drivers_on_duty: 34,
  active_trips: 28,
  trips_completed_today: 14,
  revenue_ytd: 14200000,
  expenses_ytd: 9800000,
  profit_ytd: 4400000,
  cash_flow: 1800000,
  outstanding_batta: 328500,
  pending_approvals: 7,
  fuel_entries_today: 18,
  maintenance_due: 6,
};

const spendData = [
  { day: "Mon", revenue: 620000, expense: 380000 },
  { day: "Tue", revenue: 850000, expense: 510000 },
  { day: "Wed", revenue: 720000, expense: 440000 },
  { day: "Thu", revenue: 940000, expense: 590000 },
  { day: "Fri", revenue: 1100000, expense: 670000 },
  { day: "Sat", revenue: 780000, expense: 480000 },
  { day: "Sun", revenue: 430000, expense: 260000 },
];

const expenseBreakdown = [
  { name: "Diesel", value: 48, color: "#2563eb" },
  { name: "Maintenance", value: 22, color: "#10b981" },
  { name: "Toll", value: 15, color: "#f59e0b" },
  { name: "Driver Batta", value: 10, color: "#8b5cf6" },
  { name: "Other", value: 5, color: "#94a3b8" },
];

const recentActivity = [
  { id: 1, driver: "Ramesh Kumar", type: "Diesel Fill", amount: 3500, location: "Chennai", time: "12:32 PM", status: "approved" },
  { id: 2, driver: "Suresh Babu", type: "Toll Payment", amount: 180, location: "Krishnagiri", time: "11:54 AM", status: "pending" },
  { id: 3, driver: "Muthu Raja", type: "Tyre Repair", amount: 1200, location: "Vellore", time: "10:20 AM", status: "approved" },
  { id: 4, driver: "Arjun Singh", type: "Food & Rest", amount: 350, location: "Coimbatore", time: "09:45 AM", status: "approved" },
  { id: 5, driver: "Karthik M", type: "Diesel Fill", amount: 4200, location: "Madurai", time: "08:15 AM", status: "pending" },
];

const fmt = {
  currency: (v: number) =>
    v >= 10000000
      ? `₹${(v / 10000000).toFixed(1)}Cr`
      : v >= 100000
      ? `₹${(v / 100000).toFixed(1)}L`
      : v >= 1000
      ? `₹${(v / 1000).toFixed(1)}K`
      : `₹${v}`,
  number: (v: number) => v.toLocaleString("en-IN"),
};

// ─── Stat Card Component ──────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendUp?: boolean | null;
  icon: LucideIcon;
  accent: string;
  href?: string;
}

function StatCard({ label, value, trend, trendUp, icon: Icon, accent, href }: StatCardProps) {
  const card = (
    <div className="stat-card" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon" style={{ color: accent, background: `${accent}18` }}>
          <Icon size={15} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div
        className="stat-trend"
        style={{
          color:
            trendUp === true ? "#16a34a" : trendUp === false ? "#dc2626" : "#64748b",
        }}
      >
        {trendUp === true && <TrendingUp size={11} />}
        {trendUp === false && <TrendingDown size={11} />}
        {trend}
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{card}</Link> : card;
}

// ─── Quick Action Button ──────────────────────────────────
function QuickBtn({ label, href, primary }: { label: string; href: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`quick-btn ${primary ? "quick-btn-primary" : "quick-btn-secondary"}`}
    >
      <Plus size={13} />
      {label}
    </Link>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
export default function Dashboard() {

  const row1: StatCardProps[] = [
    { label: "TOTAL VEHICLES",      value: stats.total_vehicles,          trend: "+3 from last month",    trendUp: true,  icon: Truck,        accent: "#2563eb", href: "/vehicles"    },
    { label: "ACTIVE VEHICLES",     value: stats.active_vehicles,         trend: "+2 from last period",   trendUp: true,  icon: Activity,     accent: "#10b981", href: "/vehicles"    },
    { label: "IN MAINTENANCE",      value: stats.vehicles_in_maintenance, trend: "-1 from last period",   trendUp: false, icon: Wrench,       accent: "#ef4444", href: "/maintenance" },
    { label: "ACTIVE TRIPS",        value: stats.active_trips,            trend: "+4 from last period",   trendUp: true,  icon: Route,        accent: "#f59e0b", href: "/trips"       },
    { label: "TOTAL DRIVERS",       value: stats.total_drivers,           trend: "+2 from last month",    trendUp: true,  icon: Users,        accent: "#8b5cf6", href: "/drivers"     },
    { label: "DRIVERS ON DUTY TODAY",value: stats.drivers_on_duty,        trend: "88% from last period",  trendUp: null,  icon: Shield,       accent: "#06b6d4", href: "/drivers"     },
    { label: "FUEL ENTRIES TODAY",  value: stats.fuel_entries_today,      trend: "+5 from last period",   trendUp: true,  icon: Fuel,         accent: "#0ea5e9", href: "/fuel"        },
  ];

  const row2: StatCardProps[] = [
    { label: "MAINTENANCE DUE",   value: stats.maintenance_due,              trend: "95% from last period",  trendUp: null,  icon: Timer,         accent: "#f97316", href: "/maintenance" },
    { label: "REVENUE (YTD)",     value: fmt.currency(stats.revenue_ytd),    trend: "+12% from last period", trendUp: true,  icon: DollarSign,    accent: "#10b981", href: "/reports"     },
    { label: "EXPENSES (YTD)",    value: fmt.currency(stats.expenses_ytd),   trend: "+8% from last period",  trendUp: false, icon: TrendingDown,  accent: "#ef4444", href: "/expenses"    },
    { label: "PROFIT (YTD)",      value: fmt.currency(stats.profit_ytd),     trend: "+15% from last period", trendUp: true,  icon: TrendingUp,    accent: "#2563eb", href: "/reports"     },
    { label: "CASH FLOW",         value: fmt.currency(stats.cash_flow),      trend: "+5% from last period",  trendUp: true,  icon: CreditCard,    accent: "#8b5cf6", href: "/ledger"      },
    { label: "COMPLETED TRIPS",   value: stats.trips_completed_today,        trend: "This period vs last",   trendUp: null,  icon: CheckCircle2,  accent: "#10b981", href: "/trips"       },
    { label: "PENDING APPROVALS", value: stats.pending_approvals,            trend: "Urgent from last period",trendUp: null,  icon: AlertTriangle, accent: "#f59e0b", href: "/expenses"    },
  ];

  return (
    <div className="cmd-root">
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Fleet Command Center</h1>
          <p className="cmd-banner-sub">
            Enterprise overview across all vehicles, operations, finances, and drivers.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <QuickBtn label="New Trip" href="/trips" primary />
          <QuickBtn label="Add Vehicle" href="/vehicles" />
          <QuickBtn label="Fuel Entry" href="/fuel" />
          <QuickBtn label="Expense" href="/expenses" />
          <QuickBtn label="Batta" href="/batta" />
        </div>
      </div>

      {/* ── Row 1: Operations ───────────────────────────── */}
      <div className={`cmd-grid animate-fade-in stagger-1`}>
        {row1.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── Row 2: Finance ──────────────────────────────── */}
      <div className={`cmd-grid animate-fade-in stagger-2`}>
        {row2.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── Bottom Charts ───────────────────────────────── */}
      <div className="cmd-charts animate-fade-in stagger-3">
        {/* Revenue vs Expense Chart */}
        <div className="cmd-chart-card lg-col-2">
          <div className="cmd-chart-header">
            <div>
              <div className="cmd-chart-title">Weekly Revenue vs Expenses</div>
              <div className="cmd-chart-sub">7-day performance overview</div>
            </div>
            <div className="cmd-chart-legend">
              <span className="legend-dot" style={{ background: "#2563eb" }} />
              <span className="legend-label">Revenue</span>
              <span className="legend-dot" style={{ background: "#ef4444", marginLeft: 12 }} />
              <span className="legend-label">Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13 }}
                labelStyle={{ color: "#64748b", fontWeight: 600 }}
                formatter={(v: any, name: any) => [
                  fmt.currency(v || 0),
                  name === "revenue" ? "Revenue" : "Expenses",
                ]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2}
                fill="url(#gradRev)" dot={false} activeDot={{ r: 4, fill: "#2563eb" }} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2}
                fill="url(#gradExp)" dot={false} activeDot={{ r: 4, fill: "#ef4444" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="cmd-chart-card">
          <div className="cmd-chart-title">Expense Breakdown</div>
          <div className="cmd-chart-sub" style={{ marginBottom: 8 }}>By category this month</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={44} outerRadius={72}
                paddingAngle={3} dataKey="value">
                {expenseBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`, ""]}
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {expenseBreakdown.map((e) => (
              <div key={e.name} className="pie-legend-row">
                <div className="pie-legend-left">
                  <span className="pie-dot" style={{ background: e.color }} />
                  <span className="pie-label">{e.name}</span>
                </div>
                <span className="pie-value">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="cmd-chart-card">
          <div className="cmd-chart-header" style={{ marginBottom: 14 }}>
            <div className="cmd-chart-title">Recent Activity</div>
            <Link href="/expenses" className="view-all-link">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="activity-list">
            {recentActivity.map((e) => (
              <div key={e.id} className="activity-row">
                <div className="activity-icon" style={{ background: e.status === "approved" ? "#10b98118" : "#f59e0b18" }}>
                  <Receipt size={13} color={e.status === "approved" ? "#10b981" : "#f59e0b"} />
                </div>
                <div className="activity-body">
                  <div className="activity-driver">{e.driver}</div>
                  <div className="activity-meta">
                    {e.type} · <MapPin size={9} style={{ display: "inline", marginBottom: -1 }} /> {e.location}
                  </div>
                </div>
                <div className="activity-right">
                  <div className="activity-amount">₹{e.amount.toLocaleString("en-IN")}</div>
                  <div className={`activity-badge ${e.status}`}>{e.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
