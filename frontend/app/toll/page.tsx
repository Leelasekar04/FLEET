"use client";
import { useState } from "react";
import { Milestone, Plus, MapPin, CreditCard, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = { currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}` };

const mockTolls = [
  { id: "1", date: "Jul 7, 2026 12:30", driver: "Ramesh Kumar", vehicle: "TN01AB1234", trip: "TRIP-8821", toll_name: "Krishnagiri Toll Plaza",  highway: "NH-44",   amount: 180, method: "fastag", location: "Krishnagiri, TN" },
  { id: "2", date: "Jul 7, 2026 08:15", driver: "Suresh Babu",  vehicle: "TN02CD5678", trip: "TRIP-8820", toll_name: "Pune-Mumbai Expressway",    highway: "NH-48",   amount: 305, method: "fastag", location: "Pune, MH" },
  { id: "3", date: "Jul 6, 2026 18:00", driver: "Muthu Raja",   vehicle: "TN03EF9012", trip: "TRIP-8819", toll_name: "Nashik Toll",               highway: "NH-160",  amount: 240, method: "fastag", location: "Nashik, MH" },
  { id: "4", date: "Jul 6, 2026 09:00", driver: "Arjun Singh",  vehicle: "DL01GH3456", trip: "TRIP-8818", toll_name: "Nagpur-Hyderabad Toll",     highway: "NH-44",   amount: 420, method: "fastag", location: "Nagpur, MH" },
  { id: "5", date: "Jul 5, 2026 22:00", driver: "Ramesh Kumar", vehicle: "TN01AB1234", trip: "TRIP-8821", toll_name: "Vellore Bypass",            highway: "NH-48",   amount: 120, method: "cash",   location: "Vellore, TN" },
  { id: "6", date: "Jul 5, 2026 15:30", driver: "Suresh Babu",  vehicle: "TN02CD5678", trip: "TRIP-8820", toll_name: "Bengaluru-Pune Toll",       highway: "NH-48",   amount: 285, method: "fastag", location: "Tumkur, KA" },
];

const tollByRoute = [
  { route: "Chennai-Hyd", amount: 1820 },
  { route: "Bangalore-Mumbai", amount: 2340 },
  { route: "Madurai-Pune",    amount: 1560 },
  { route: "Coimbatore-Delhi",amount: 3240 },
];

const TOOLTIP = {
  contentStyle: { background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 },
  labelStyle: { color: "#9ca3af" },
};

export default function TollPage() {
  const [showModal, setShowModal] = useState(false);
  const totalAmount = mockTolls.reduce((s, t) => s + t.amount, 0);
  const fastagCount = mockTolls.filter(t => t.method === "fastag").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Toll Management</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Track toll payments, FASTag usage & route-wise costs</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Log Toll Entry
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Toll (This Week)", value: fmt.currency(totalAmount), color: "#3b82f6" },
          { label: "Total Entries",          value: mockTolls.length,           color: "#9ca3af" },
          { label: "FASTag Usage",           value: `${Math.round((fastagCount / mockTolls.length) * 100)}%`, color: "#00d4aa" },
          { label: "Avg per Trip",           value: fmt.currency(Math.round(totalAmount / 4)), color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} className="kpi-card" style={{ "--card-accent": s.color } as React.CSSProperties}>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#9ca3af]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Route Chart */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-1 text-sm">Toll Cost by Route</h3>
        <p className="text-xs text-[#6b7280] mb-4">Cumulative toll per active route</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={tollByRoute} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="route" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${v}`} />
            <Tooltip {...TOOLTIP} formatter={(v: any) => [fmt.currency(v || 0), "Toll"]} />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Toll Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <span className="font-semibold text-white text-sm">Toll Entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr>
              <th>Toll Plaza</th><th>Driver / Vehicle</th><th>Highway</th>
              <th>Amount</th><th>Payment</th><th>Date & Time</th>
            </tr></thead>
            <tbody>
              {mockTolls.map((t, i) => (
                <tr key={t.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td>
                    <div className="text-sm font-medium text-white">{t.toll_name}</div>
                    <div className="text-xs text-[#6b7280] flex items-center gap-1"><MapPin size={10} />{t.location}</div>
                  </td>
                  <td>
                    <div className="text-sm text-white">{t.driver}</div>
                    <div className="text-xs font-mono text-[#00d4aa]">{t.vehicle}</div>
                  </td>
                  <td><span className="font-mono text-xs text-[#9ca3af]">{t.highway}</span></td>
                  <td><span className="text-sm font-bold text-white">{fmt.currency(t.amount)}</span></td>
                  <td>
                    <span className={`badge flex items-center gap-1 w-fit ${
                      t.method === "fastag" ? "badge-active" : ""
                    }`}
                      style={t.method === "cash" ? { background: "#f59e0b15", color: "#fbbf24", border: "1px solid #f59e0b30" } : {}}>
                      {t.method === "fastag" ? <Zap size={10} /> : <CreditCard size={10} />}
                      {t.method === "fastag" ? "FASTag" : "Cash"}
                    </span>
                  </td>
                  <td><span className="text-xs text-[#6b7280]">{t.date}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Screen Add Toll Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm shrink-0" style={{ padding: '0 24px' }}>
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <Milestone className="text-[#2563eb]" /> Log Toll Entry
            </h2>
            <button className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none" onClick={() => setShowModal(false)}>×</button>
          </div>
          
          {/* Content Centered */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center" style={{ padding: '24px' }}>
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ maxWidth: '800px', padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                  { label: "Toll Plaza Name", placeholder: "e.g. Krishnagiri Toll Plaza", colSpan: true },
                  { label: "Location", placeholder: "e.g. Krishnagiri, TN" },
                  { label: "Highway", placeholder: "e.g. NH-44" },
                  { label: "Amount (₹)", placeholder: "180" },
                ].map(f => (
                  <div key={f.label} style={f.colSpan ? { gridColumn: '1 / -1' } : {}}>
                    <label className="block text-sm font-semibold text-[#334155] mb-1.5">{f.label}</label>
                    <input className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all" placeholder={f.placeholder} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Payment Method</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all">
                    <option value="fastag">FASTag</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 border-t border-gray-100" style={{ marginTop: '32px', paddingTop: '24px' }}>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#475569] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all" onClick={() => setShowModal(false)}>Save Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
