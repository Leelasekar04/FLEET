"use client";
import { useState } from "react";
import { Wrench, Plus, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const fmt = { currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}` };

const mockMaintenance = [
  { id: "1", vehicle: "TN01AB1234", type: "scheduled",  service: "Engine Oil Change",    date: "2026-06-01", next_date: "2026-12-01", cost: 3500,  status: "completed", garage: "Tata Service, Chennai" },
  { id: "2", vehicle: "TN02CD5678", type: "breakdown",  service: "Clutch Replacement",  date: "2026-07-03", next_date: null,          cost: 18000, status: "completed", garage: "M.K. Garage, Pune" },
  { id: "3", vehicle: "TN03EF9012", type: "scheduled",  service: "Annual Service",       date: "2026-07-07", next_date: null,          cost: 0,     status: "in_progress", garage: "Eicher Service, Salem" },
  { id: "4", vehicle: "KA02IJ7890", type: "scheduled",  service: "Tyre Rotation",       date: "2026-08-15", next_date: null,          cost: 0,     status: "pending",  garage: null },
  { id: "5", vehicle: "DL01GH3456", type: "accident",   service: "Body Repair",          date: "2026-06-20", next_date: null,          cost: 45000, status: "completed", garage: "Delhi Auto Works" },
  { id: "6", vehicle: "MH04MN5678", type: "scheduled",  service: "Air Filter Change",   date: "2026-07-10", next_date: null,          cost: 0,     status: "pending",  garage: null },
];

const typeColor: Record<string, string> = {
  scheduled: "#3b82f6", breakdown: "#ef4444", accident: "#8b5cf6",
};
const statusColor: Record<string, string> = {
  completed: "#00d4aa", in_progress: "#f59e0b", pending: "#6b7280",
};

export default function MaintenancePage() {
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockMaintenance.filter(m => typeFilter === "all" || m.type === typeFilter);
  const totalCost = mockMaintenance.filter(m => m.status === "completed").reduce((s, m) => s + m.cost, 0);
  const pending = mockMaintenance.filter(m => m.status === "pending").length;
  const inProgress = mockMaintenance.filter(m => m.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Service schedule, breakdowns & repair tracking</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Log Service
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Completed (This Month)", value: fmt.currency(totalCost), color: "#00d4aa" },
          { label: "In Progress",            value: inProgress,               color: "#f59e0b" },
          { label: "Pending Scheduled",      value: pending,                  color: "#3b82f6" },
          { label: "Breakdowns (This Month)", value: mockMaintenance.filter(m => m.type === "breakdown").length, color: "#ef4444" },
        ].map((s, i) => (
          <div key={i} className="kpi-card" style={{ "--card-accent": s.color } as React.CSSProperties}>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#9ca3af]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "scheduled", "breakdown", "accident"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === t ? "bg-[#00d4aa] text-black" : "btn btn-secondary"
            }`}
          >
            {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="space-y-3">
        {filtered.map((m, i) => (
          <div key={m.id} className="glass-card p-4 flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${typeColor[m.type]}15` }}>
              <Wrench size={17} color={typeColor[m.type]} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-white">{m.service}</span>
                <span className="badge text-[9px]"
                  style={{ background: `${typeColor[m.type]}15`, color: typeColor[m.type], border: `1px solid ${typeColor[m.type]}30` }}>
                  {m.type}
                </span>
              </div>
              <div className="text-xs font-mono text-[#00d4aa]">{m.vehicle}</div>
              {m.garage && <div className="text-xs text-[#6b7280] mt-0.5">{m.garage}</div>}
            </div>
            <div className="text-right">
              {m.cost > 0
                ? <div className="text-sm font-bold text-white">{fmt.currency(m.cost)}</div>
                : <div className="text-sm text-[#4b5563]">—</div>}
              <div className="text-xs text-[#6b7280] flex items-center gap-1 justify-end mt-0.5">
                <Calendar size={10} />{m.date}
              </div>
              {m.next_date && (
                <div className="text-xs text-[#3b82f6] mt-0.5">Next: {m.next_date}</div>
              )}
            </div>
            <span className="badge ml-2"
              style={{
                background: `${statusColor[m.status]}15`,
                color: statusColor[m.status],
                border: `1px solid ${statusColor[m.status]}30`,
              }}>
              {m.status === "in_progress" ? "In Progress" : m.status.charAt(0).toUpperCase() + m.status.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Full Screen Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm shrink-0" style={{ padding: '0 24px' }}>
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <Wrench className="text-[#2563eb]" /> Log Service / Breakdown
            </h2>
            <button className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none" onClick={() => setShowModal(false)}>×</button>
          </div>
          
          {/* Content Centered */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center" style={{ padding: '24px' }}>
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ maxWidth: '800px', padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Vehicle</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all">
                    <option>TN01AB1234</option><option>TN02CD5678</option><option>TN03EF9012</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Service Type</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all">
                    <option>Scheduled</option><option>Breakdown</option><option>Accident</option>
                  </select>
                </div>
                {[
                  { label: "Service Description", placeholder: "e.g. Engine Oil Change", colSpan: true },
                  { label: "Garage Name",         placeholder: "e.g. Tata Service, Chennai", colSpan: true },
                  { label: "Cost (₹)",            placeholder: "e.g. 3500" },
                ].map(f => (
                  <div key={f.label} style={f.colSpan ? { gridColumn: '1 / -1' } : {}}>
                    <label className="block text-sm font-semibold text-[#334155] mb-1.5">{f.label}</label>
                    <input className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all" placeholder={f.placeholder} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Service Date</label>
                  <input type="date" className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all" defaultValue="2026-07-07" />
                </div>
              </div>
              <div className="flex gap-4 border-t border-gray-100" style={{ marginTop: '32px', paddingTop: '24px' }}>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#475569] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all" onClick={() => setShowModal(false)}>Save Record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
