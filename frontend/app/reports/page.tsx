"use client";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { BarChart3, Fuel, Truck, TrendingDown } from "lucide-react";

const fmt = {
  currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}`,
};

// ─── Mock Data ─────────────────────────────────────────────
const driverSummary = [
  { driver: "Ramesh K", diesel: 15200, toll: 540, food: 700, repair: 800, other: 350 },
  { driver: "Suresh B",  diesel: 18400, toll: 720, food: 1100, repair: 0,   other: 200 },
  { driver: "Muthu R",   diesel: 8900,  toll: 480, food: 650, repair: 2400, other: 100 },
  { driver: "Arjun S",   diesel: 22100, toll: 960, food: 1800, repair: 1200, other: 750 },
  { driver: "Karthik M", diesel: 12300, toll: 360, food: 450, repair: 600,  other: 0 },
];

const monthlyFuel = [
  { month: "Jan", amount: 145000 }, { month: "Feb", amount: 132000 },
  { month: "Mar", amount: 178000 }, { month: "Apr", amount: 165000 },
  { month: "May", amount: 189000 }, { month: "Jun", amount: 201000 },
  { month: "Jul", amount: 85000  },
];

const tripProfitability = [
  { trip: "TRIP-8821", revenue: 45000, expenses: 12500, profit: 32500 },
  { trip: "TRIP-8820", revenue: 60000, expenses: 18200, profit: 41800 },
  { trip: "TRIP-8819", revenue: 35000, expenses: 9800,  profit: 25200 },
  { trip: "TRIP-8818", revenue: 72000, expenses: 28100, profit: 43900 },
  { trip: "TRIP-8817", revenue: 48000, expenses: 19500, profit: 28500 },
];

const categoryBreakdown = [
  { name: "Diesel",      value: 77900, color: "#00d4aa" },
  { name: "Toll",        value: 3060,  color: "#3b82f6" },
  { name: "Food",        value: 4700,  color: "#8b5cf6" },
  { name: "Tyre Repair", value: 4200,  color: "#f59e0b" },
  { name: "Maintenance", value: 2800,  color: "#f97316" },
  { name: "Other",       value: 1400,  color: "#6b7280" },
];

const totalCategorySpend = categoryBreakdown.reduce((s, c) => s + c.value, 0);

const TOOLTIP_STYLE = {
  contentStyle: { background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 },
  labelStyle: { color: "#9ca3af" },
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("This Month");
  const periods = ["This Week", "This Month", "This Quarter", "This Year"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Expense analytics & fleet profitability</p>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p ? "bg-[#00d4aa] text-black" : "btn btn-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Fleet Spend",    value: fmt.currency(totalCategorySpend), icon: TrendingDown, color: "#ef4444" },
          { label: "Fuel Cost",            value: fmt.currency(77900),             icon: Fuel,         color: "#f59e0b" },
          { label: "Avg Spend / Trip",     value: fmt.currency(18740),             icon: Truck,        color: "#3b82f6" },
          { label: "Fuel % of Total",      value: "82.4%",                          icon: BarChart3,    color: "#00d4aa" },
        ].map((s, i) => (
          <div key={s.label} className="kpi-card animate-fade-in" style={{ "--card-accent": s.color, animationDelay: `${i * 50}ms` } as React.CSSProperties}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
              <s.icon size={16} color={s.color} />
            </div>
            <div className="text-xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-xs text-[#9ca3af]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Driver Summary + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Driver Stacked Bar */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-semibold text-white mb-1">Driver-wise Expense Summary</h3>
          <p className="text-xs text-[#6b7280] mb-4">Breakdown by category per driver</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={driverSummary} margin={{ left: -20, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="driver" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any, n: any) => [fmt.currency(v || 0), n]} />
              <Bar dataKey="diesel" stackId="a" fill="#00d4aa" radius={[0, 0, 0, 0]} name="Diesel" />
              <Bar dataKey="toll"   stackId="a" fill="#3b82f6" name="Toll" />
              <Bar dataKey="food"   stackId="a" fill="#8b5cf6" name="Food" />
              <Bar dataKey="repair" stackId="a" fill="#f59e0b" name="Repair" />
              <Bar dataKey="other"  stackId="a" fill="#6b7280" name="Other" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={8}
                formatter={(v) => <span style={{ color: "#9ca3af", fontSize: 11 }}>{v}</span>} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Donut */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-1">Expense Categories</h3>
          <p className="text-xs text-[#6b7280] mb-3">Total: {fmt.currency(totalCategorySpend)}</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                paddingAngle={2} dataKey="value">
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [fmt.currency(v || 0), ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-[#9ca3af]">{c.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{fmt.currency(c.value)}</div>
                  <div className="text-[#4b5563]">{((c.value / totalCategorySpend) * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Fuel + Trip Profitability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Fuel Trend */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-1">Fuel Cost Analysis</h3>
          <p className="text-xs text-[#6b7280] mb-4">Monthly diesel & petrol spend</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyFuel} margin={{ left: -20, right: 0 }}>
              <defs>
                <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [fmt.currency(v || 0), "Fuel"]} />
              <Area type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={2}
                fill="url(#fuelGrad)" dot={{ fill: "#f59e0b", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trip Profitability */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-1">Trip Profitability</h3>
          <p className="text-xs text-[#6b7280] mb-4">Revenue vs expenses per trip</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tripProfitability} margin={{ left: -20, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="trip" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any, n: any) => [fmt.currency(v || 0), n]} />
              <Bar dataKey="revenue"  fill="#3b82f620" stroke="#3b82f6" strokeWidth={1} radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#ef444420" stroke="#ef4444" strokeWidth={1} radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="profit"   fill="#00d4aa"   radius={[4, 4, 0, 0]} name="Net Profit" />
              <Legend iconType="circle" iconSize={8}
                formatter={(v) => <span style={{ color: "#9ca3af", fontSize: 11 }}>{v}</span>} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
