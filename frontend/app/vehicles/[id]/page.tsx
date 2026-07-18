"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck, ArrowLeft, FileText, AlertTriangle, CheckCircle2,
  Calendar, Wrench, Upload, Plus, MapPin, Fuel,
  User, Phone, Route, Activity, TrendingUp, Clock,
  Edit2, MoreVertical, XCircle
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────
const mockVehicle = {
  id: "1", number: "TN01AB1234", type: "Truck", make: "Tata", model: "Prima 4928.S",
  year: 2021, capacity: 25, fuel_type: "Diesel", engine_no: "TATAA12345678",
  chassis_no: "MAT445884M1A12345", color: "White", status: "active",
  current_driver: { name: "Ramesh Kumar", phone: "+91 98765 43210" },
  current_trip: { code: "TRIP-8821", route: "Chennai → Hyderabad", balance: 12500 },
  documents: [
    { type: "RC Book",         number: "TN2021010001",  expiry: "2035-06-01", status: "valid"   },
    { type: "Insurance",       number: "OG-26-123456",  expiry: "2026-09-15", status: "valid"   },
    { type: "Permit",          number: "NPTM-2024-001", expiry: "2027-03-01", status: "valid"   },
    { type: "Fitness",         number: "FIT-2024-789",  expiry: "2026-12-01", status: "valid"   },
    { type: "Pollution (PUC)", number: "PUC-2026-456",  expiry: "2026-08-10", status: "warning" },
  ],
  maintenance: [
    { date: "2026-05-10", type: "Oil Change",     cost: 3500,  status: "completed", garage: "Tata Service, Chennai" },
    { date: "2026-03-22", type: "Tyre Rotation",  cost: 1200,  status: "completed", garage: "MRF Dealer, Vellore"   },
    { date: "2026-06-01", type: "Engine Service", cost: 12000, status: "completed", garage: "Tata Service, Chennai" },
    { date: "2026-08-15", type: "Annual Service", cost: 0,     status: "pending",   garage: null                    },
  ],
  stats: { total_trips: 84, total_km: 142850, total_fuel_cost: 285000, avg_mileage: 8.4 },
  fuel_history: [
    { date: "07 Jul 2026", liters: 120, amount: 10440, station: "HP, Chennai",  mileage: 8.5 },
    { date: "03 Jul 2026", liters: 140, amount: 12180, station: "IOC, Vellore", mileage: 8.2 },
    { date: "28 Jun 2026", liters: 110, amount: 9570,  station: "BPCL, Salem",  mileage: 8.7 },
  ],
};

const MOCK_NOW = new Date("2026-07-07").getTime();

// ─── Helpers ───────────────────────────────────────────────
function docDays(expiry: string) {
  return Math.floor((new Date(expiry).getTime() - MOCK_NOW) / 86400000);
}

function DocBadge({ expiry }: { expiry: string }) {
  const days = docDays(expiry);
  if (days < 0)  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">Expired</span>;
  if (days < 30) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">{days}d left</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Valid</span>;
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center py-1 border-b border-slate-100 last:border-b-0">
      <span className="text-[12px] text-slate-500 font-medium w-[140px] flex-shrink-0">{label}</span>
      <span className="text-[12.5px] font-semibold text-slate-800">{value}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────
export default function VehicleDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "maintenance" | "fuel">("overview");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const v = mockVehicle;

  const statusColor = { active: "#10b981", inactive: "#94a3b8", maintenance: "#f59e0b", in_trip: "#3b82f6" }[v.status] ?? "#94a3b8";
  const statusLabel = { active: "Active", inactive: "Inactive", maintenance: "Maintenance", in_trip: "On Trip" }[v.status] ?? v.status;

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#f1f5f9]">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        {/* Breadcrumb */}
        <Link href="/vehicles" className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-600 transition-colors mb-3 font-medium">
          <ArrowLeft size={13} /> Back to Vehicles
        </Link>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <Truck size={22} className="text-blue-600" />
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">{v.number}</h1>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border"
                  style={{ background: statusColor + "18", color: statusColor, borderColor: statusColor + "40" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                  {statusLabel}
                </span>
              </div>
              <p className="text-[12.5px] text-slate-500 mt-0.5">
                {v.make} {v.model} · {v.year} · {v.capacity}T
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="h-9 flex items-center gap-1.5 px-4 rounded-lg border border-slate-200 bg-white text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Upload size={13} /> Upload Doc
            </button>
            <button 
              onClick={() => setShowServiceModal(true)}
              className="h-9 flex items-center gap-1.5 px-4 rounded-lg border border-slate-200 bg-white text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Wrench size={13} /> Log Service
            </button>
            <button 
              onClick={() => setShowEditModal(true)}
              className="h-9 flex items-center gap-1.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-semibold transition-all shadow-sm"
            >
              <Edit2 size={13} /> Edit Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">

        {/* ── ASSIGNMENT STRIP ───────────────────────────── */}
        {v.current_driver && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-3 flex items-center gap-6">
            {/* Driver */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                {v.current_driver.name[0]}
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Current Driver</div>
                <div className="text-[13px] font-bold text-slate-800">{v.current_driver.name}</div>
                <div className="text-[11px] text-slate-400">{v.current_driver.phone}</div>
              </div>
            </div>

            {v.current_trip && (
              <>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Active Trip</div>
                  <div className="text-[13px] font-bold text-blue-600">{v.current_trip.code}</div>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Route</div>
                  <div className="flex items-center gap-1 text-[13px] font-semibold text-slate-800">
                    <MapPin size={12} className="text-slate-400" />{v.current_trip.route}
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Batta Balance</div>
                  <div className="text-[13px] font-bold text-emerald-600">
                    ₹{v.current_trip.balance.toLocaleString("en-IN")}
                  </div>
                </div>
              </>
            )}

            <div className="flex-1" />
            <a 
              href={`tel:${v.current_driver.phone}`}
              className="h-8 px-3 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Phone size={12} /> Call Driver
            </a>
            <button 
              onClick={() => router.push(`/trips/${v.current_trip?.code}`)}
              className="h-8 px-3 rounded-lg border border-blue-200 bg-blue-50 text-[12px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
            >
              <Route size={12} /> View Trip
            </button>
          </div>
        )}

        {/* ── KPI STATS ──────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Trips",  value: v.stats.total_trips,                                   unit: "trips",  icon: Activity,    color: "#2563eb", bg: "#eff6ff" },
            { label: "Total KMs",    value: `${(v.stats.total_km / 1000).toFixed(1)}k`,            unit: "km",     icon: Route,       color: "#10b981", bg: "#f0fdf4" },
            { label: "Fuel Cost",    value: `₹${(v.stats.total_fuel_cost / 100000).toFixed(1)}L`,  unit: "",       icon: Fuel,        color: "#f59e0b", bg: "#fffbeb" },
            { label: "Avg Mileage",  value: v.stats.avg_mileage,                                   unit: "km/L",   icon: TrendingUp,  color: "#8b5cf6", bg: "#f5f3ff" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-[22px] font-extrabold leading-none" style={{ color: s.color }}>
                  {s.value}
                  {s.unit && <span className="text-[12px] text-slate-400 font-medium ml-1">{s.unit}</span>}
                </div>
                <div className="text-[11.5px] text-slate-500 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ───────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {(["overview", "documents", "maintenance", "fuel"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-[13px] font-semibold border-b-2 transition-all -mb-px
                  ${activeTab === tab
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ─────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-6 p-5">
              {/* Vehicle Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-[13px] font-bold text-slate-700 mb-3">Vehicle Details</h3>
                <div>
                  {[
                    ["Vehicle Number", v.number],
                    ["Type",           v.type],
                    ["Make / Brand",   v.make],
                    ["Model",          v.model],
                    ["Year",           v.year],
                    ["Capacity",       `${v.capacity} Tons`],
                    ["Fuel Type",      v.fuel_type],
                    ["Engine Number",  v.engine_no],
                    ["Chassis Number", v.chassis_no],
                    ["Color",          v.color],
                  ].map(([label, value]) => (
                    <InfoRow key={label as string} label={label as string} value={value as string} />
                  ))}
                </div>
              </div>

              {/* Document Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-[13px] font-bold text-slate-700 mb-3">Document Summary</h3>
                <div>
                  {v.documents.map(doc => {
                    const days = docDays(doc.expiry);
                    const barColor = days < 0 ? "#ef4444" : days < 30 ? "#f59e0b" : "#10b981";
                    return (
                      <div key={doc.type} className="flex items-center py-1 border-b border-slate-100 last:border-b-0">
                        <div className="flex items-center gap-2.5 w-[140px] flex-shrink-0">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: barColor + "18" }}>
                            <FileText size={13} style={{ color: barColor }} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12.5px] font-semibold text-slate-800 truncate">{doc.type}</div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">{doc.number}</div>
                          </div>
                        </div>
                        <div className="text-left ml-4">
                          <div className="flex items-center gap-2 mb-0.5">
                            <DocBadge expiry={doc.expiry} />
                          </div>
                          <div className="text-[11.5px] font-semibold text-slate-700">
                            {new Date(doc.expiry).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}


          {/* ── DOCUMENTS ────────────────────────────────── */}
          {activeTab === "documents" && (
            <div className="p-5 space-y-3">
              <div className="flex justify-end">
                <button 
                  onClick={() => alert("Upload document modal would open here.")}
                  className="h-9 flex items-center gap-1.5 px-4 rounded-lg bg-blue-600 text-white text-[12.5px] font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Upload size={13} /> Upload Document
                </button>
              </div>
              {v.documents.map(doc => {
                const days = docDays(doc.expiry);
                const color = days < 0 ? "#ef4444" : days < 30 ? "#f59e0b" : "#10b981";
                return (
                  <div key={doc.type} className="flex items-center gap-4 p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "15" }}>
                      <FileText size={18} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-slate-800">{doc.type}</div>
                      <div className="text-[11.5px] text-slate-400 font-mono mt-0.5">{doc.number}</div>
                    </div>
                    <div className="text-right">
                      <DocBadge expiry={doc.expiry} />
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 justify-end">
                        <Calendar size={10} />
                        {new Date(doc.expiry).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors ml-1">
                      <Upload size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── MAINTENANCE ──────────────────────────────── */}
          {activeTab === "maintenance" && (
            <div className="p-5 space-y-3">
              <div className="flex justify-end">
                <button 
                  onClick={() => alert("Log service modal would open here.")}
                  className="h-9 flex items-center gap-1.5 px-4 rounded-lg bg-blue-600 text-white text-[12.5px] font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus size={13} /> Log Service
                </button>
              </div>
              {v.maintenance.map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${m.status === "pending" ? "bg-amber-50" : "bg-emerald-50"}`}>
                    <Wrench size={17} className={m.status === "pending" ? "text-amber-500" : "text-emerald-500"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-800">{m.type}</div>
                    {m.garage && <div className="text-[11.5px] text-slate-400 mt-0.5">{m.garage}</div>}
                  </div>
                  <div className="text-right">
                    {m.cost > 0
                      ? <div className="text-[13px] font-bold text-slate-800">₹{m.cost.toLocaleString("en-IN")}</div>
                      : <div className="text-[13px] text-slate-300">—</div>}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                      <Calendar size={10} />{m.date}
                    </div>
                  </div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ml-1
                    ${m.status === "pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                    {m.status === "pending" ? "Pending" : "Done"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── FUEL ─────────────────────────────────────── */}
          {activeTab === "fuel" && (
            <div className="p-5 space-y-3">
              {v.fuel_history.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Fuel size={17} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-800">{f.station}</div>
                    <div className="text-[11.5px] text-slate-400 mt-0.5">
                      {f.liters}L · {f.mileage} km/L mileage
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-slate-800">₹{f.amount.toLocaleString("en-IN")}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{f.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ─────────────────────────────────────── */}
      
      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 w-full max-w-md overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Upload Document</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Add a new RC, Insurance, or Permit</p>
                </div>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowUploadModal(false); alert("Document uploaded successfully!"); }} className="p-7 space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Document Type <span className="text-red-500">*</span></label>
                <select className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                  <option>RC Book</option>
                  <option>Insurance</option>
                  <option>Permit</option>
                  <option>Fitness Certificate</option>
                  <option>PUC (Pollution)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Expiry Date</label>
                <input type="date" className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center py-8 px-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                <Upload size={24} className="text-slate-300 mb-2" />
                <div className="text-[13px] font-bold text-slate-700">Click to upload file</div>
                <div className="text-[11.5px] text-slate-400 mt-1">PDF, JPG, or PNG (max 5MB)</div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13px]">Cancel</button>
                <button type="submit" className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] border border-blue-500/20 text-[13px] flex items-center justify-center gap-2"><Upload size={16} /> Upload Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 w-full max-w-lg overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Wrench size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Log Service</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Record maintenance for {v.number}</p>
                </div>
              </div>
              <button onClick={() => setShowServiceModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowServiceModal(false); alert("Service logged successfully!"); }} className="p-7 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Service Type <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="e.g. Oil Change" className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Date</label>
                  <input type="date" defaultValue="2026-07-08" className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Garage / Provider</label>
                <input type="text" placeholder="e.g. Tata Authorized Service" className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Total Cost (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-semibold text-[14px]">₹</span>
                  </div>
                  <input type="number" placeholder="0" className="w-full h-11 pl-8 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-800 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13px]">Cancel</button>
                <button type="submit" className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] border border-blue-500/20 text-[13px] flex items-center justify-center gap-2"><Wrench size={16} /> Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 w-full max-w-lg overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Edit2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Edit Vehicle</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Update details for {v.number}</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); alert("Vehicle updated successfully!"); }} className="p-7 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Vehicle Number</label>
                  <input type="text" defaultValue={v.number} className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Status</label>
                  <select defaultValue={v.status} className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Make</label>
                  <input type="text" defaultValue={v.make} className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 ml-1">Model</label>
                  <input type="text" defaultValue={v.model} className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13px]">Cancel</button>
                <button type="submit" className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] border border-blue-500/20 text-[13px] flex items-center justify-center gap-2"><Edit2 size={16} /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
