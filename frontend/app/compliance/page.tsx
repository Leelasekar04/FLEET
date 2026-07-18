"use client";
import { useState, useEffect, useRef } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, FileText, Truck, Users, Bell, Upload } from "lucide-react";

const mockItems = [
  // Vehicles
  { category: "Vehicle", entity: "TN01AB1234", type: "Insurance",        expiry: "2026-09-15", number: "OG-26-123456" },
  { category: "Vehicle", entity: "TN02CD5678", type: "Fitness",          expiry: "2026-07-15", number: "FIT-2026-002" },
  { category: "Vehicle", entity: "TN02CD5678", type: "Pollution (PUC)", expiry: "2026-07-25", number: "PUC-2026-099" },
  { category: "Vehicle", entity: "TN03EF9012", type: "Permit",           expiry: "2026-08-01", number: "NPTM-2024-003" },
  { category: "Vehicle", entity: "KA02IJ7890", type: "Insurance",        expiry: "2025-12-01", number: "OG-25-987654" }, // expired
  { category: "Vehicle", entity: "KA02IJ7890", type: "Fitness",          expiry: "2026-06-01", number: "FIT-2026-004" }, // expired
  { category: "Vehicle", entity: "AP03KL1234", type: "Pollution (PUC)", expiry: "2026-07-28", number: "PUC-2026-101" },
  // Drivers
  { category: "Driver",  entity: "Muthu Raja",   type: "Medical Certificate", expiry: "2026-08-15", number: "MED-2025-001" },
  { category: "Driver",  entity: "Venkat Reddy", type: "Driving License",     expiry: "2026-07-20", number: "AP7890123" },
  { category: "Driver",  entity: "Balu Naidu",   type: "Driving License",     expiry: "2027-03-01", number: "TN9012345" },
];

const mockToday = new Date("2026-07-07").getTime();
const daysFromNow = (d: string) => Math.floor((new Date(d).getTime() - mockToday) / 86400000);

const getStatus = (expiry: string) => {
  const d = daysFromNow(expiry);
  if (d < 0)  return { label: "Expired",       color: "#ef4444", bg: "#ef444415", icon: "🔴", sort: 0 };
  if (d < 15) return { label: `${d}d left`,    color: "#ef4444", bg: "#ef444415", icon: "🔴", sort: 1 };
  if (d < 30) return { label: `${d}d left`,    color: "#f59e0b", bg: "#f59e0b15", icon: "🟡", sort: 2 };
  if (d < 90) return { label: `${d}d left`,    color: "#3b82f6", bg: "#3b82f615", icon: "🔵", sort: 3 };
  return         { label: "Valid",              color: "#00d4aa", bg: "#00d4aa15", icon: "🟢", sort: 4 };
};

export default function CompliancePage() {
  const [categoryFilter, setCategoryFilter] = useState<"all" | "Vehicle" | "Driver">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "expired" | "warning" | "ok">("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const processed = mockItems.map(item => ({ ...item, status: getStatus(item.expiry), days: daysFromNow(item.expiry) }))
    .sort((a, b) => a.status.sort - b.status.sort);

  const filtered = processed.filter(item => {
    const matchCat = categoryFilter === "all" || item.category === categoryFilter;
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "expired" && item.days < 0) ||
      (statusFilter === "warning" && item.days >= 0 && item.days < 30) ||
      (statusFilter === "ok" && item.days >= 30);
    return matchCat && matchStatus;
  });

  const expired = processed.filter(i => i.days < 0).length;
  const critical = processed.filter(i => i.days >= 0 && i.days < 15).length;
  const warning  = processed.filter(i => i.days >= 15 && i.days < 30).length;
  const ok       = processed.filter(i => i.days >= 30).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Document expiry tracking for vehicles & drivers</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm"><Bell size={13} /> Set Alerts</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Expired",   count: expired,  color: "#ef4444", filter: "expired" },
          { label: "< 15 Days", count: critical, color: "#ef4444", filter: "expired" },
          { label: "< 30 Days", count: warning,  color: "#f59e0b", filter: "warning" },
          { label: "Valid",     count: ok,        color: "#00d4aa", filter: "ok" },
        ].map((s, i) => (
          <button key={i} onClick={() => setStatusFilter(s.filter as any)}
            className="glass-card p-4 text-left hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-1">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</div>
              {s.count > 0 && (s.label === "Expired" || s.label === "< 15 Days") && (
                <AlertTriangle size={16} color={s.color} />
              )}
              {s.label === "Valid" && <CheckCircle size={16} color={s.color} />}
            </div>
            <div className="text-xs text-[#6b7280]">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {(["all", "Vehicle", "Driver"] as const).map(f => (
            <button key={f} onClick={() => setCategoryFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === f ? "bg-[#00d4aa] text-black" : "btn btn-secondary"
              }`}>
              {f === "Vehicle" && <Truck size={11} />}
              {f === "Driver" && <Users size={11} />}
              {f}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex gap-2">
          {[
            { key: "all",     label: "All Status" },
            { key: "expired", label: "Expired / Critical" },
            { key: "warning", label: "Warning" },
            { key: "ok",      label: "Valid" },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.key ? "bg-[#00d4aa] text-black" : "btn btn-secondary"
              }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Compliance Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr>
              <th>Status</th><th>Category</th><th>Entity</th>
              <th>Document Type</th><th>Number</th><th>Expiry Date</th><th>Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td>
                    <span className="badge flex items-center gap-1 w-fit"
                      style={{ background: item.status.bg, color: item.status.color, border: `1px solid ${item.status.color}30` }}>
                      {item.days < 0
                        ? <><AlertTriangle size={10} />Expired</>
                        : <><CheckCircle size={10} />{item.status.label}</>}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                      {item.category === "Vehicle" ? <Truck size={12} /> : <Users size={12} />}
                      {item.category}
                    </span>
                  </td>
                  <td><span className="text-sm font-medium text-white font-mono">{item.entity}</span></td>
                  <td>
                    <span className="flex items-center gap-1.5 text-sm">
                      <FileText size={12} className="text-[#6b7280]" />{item.type}
                    </span>
                  </td>
                  <td><span className="font-mono text-xs text-[#6b7280]">{item.number}</span></td>
                  <td>
                    <span className="text-sm" style={{ color: item.status.color }}>
                      {new Date(item.expiry).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary btn-sm text-xs gap-1.5 font-semibold"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={12} />
                      Renew / Upload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-[#6b7280]">No items found</div>
          )}
        </div>
      </div>

      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            showToast(`Document uploaded successfully: ${e.target.files[0].name}`);
            e.target.value = ''; // Reset
          }
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-sm transition-all duration-300 translate-y-0 opacity-100 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-white/50 hover:text-white transition-colors ml-2 font-light text-xl leading-none">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
