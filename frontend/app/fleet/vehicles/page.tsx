"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Truck, Plus, Search, SlidersHorizontal, AlertTriangle, CheckCircle2,
  Wrench, Eye, Edit2, Download, Upload, RefreshCw,
  LayoutGrid, List as ListIcon, MapPin, Phone, FileText,
  SearchX, MoreVertical, Power, Users, Route, TrendingUp,
  TrendingDown, ChevronRight, Shield, Settings2, UserPlus, XCircle
} from "lucide-react";
import { api } from "@/lib/api";

// ─────────────────────────────────────────────────────────
// DATA & CONSTANTS
// ─────────────────────────────────────────────────────────

type VStatus = "active" | "in_trip" | "maintenance" | "inactive";

const STATUS_CONFIG: Record<VStatus, {
  label: string; dot: string; bg: string; ring: string; text: string;
}> = {
  active:      { label: "Active",      dot: "#10b981", bg: "#f0fdf4", ring: "#bbf7d0", text: "#065f46" },
  in_trip:     { label: "On Trip",     dot: "#3b82f6", bg: "#eff6ff", ring: "#bfdbfe", text: "#1e40af" },
  maintenance: { label: "Maintenance", dot: "#f59e0b", bg: "#fffbeb", ring: "#fde68a", text: "#92400e" },
  inactive:    { label: "Inactive",    dot: "#94a3b8", bg: "#f8fafc", ring: "#e2e8f0", text: "#475569" },
};

const DOC_KEYS = ["rc", "insurance", "permit", "fitness", "puc"] as const;
const MOCK_NOW = 1783382400000;

function calcDocHealth(docs: Record<string, string>) {
  let valid = 0, expiring = 0, expired = 0;
  for (const k of DOC_KEYS) {
    const d = Math.floor((new Date(docs[k]).getTime() - MOCK_NOW) / 86400000);
    if (d < 0) expired++;
    else if (d < 30) expiring++;
    else valid++;
  }
  const pct = Math.round((valid / DOC_KEYS.length) * 100);
  return { valid, expiring, expired, pct };
}

function docStatusFor(expiry: string) {
  const d = Math.floor((new Date(expiry).getTime() - MOCK_NOW) / 86400000);
  if (d < 0)  return { color: "#ef4444", label: "Expired",       days: `${Math.abs(d)}d ago` };
  if (d < 30) return { color: "#f59e0b", label: "Expiring Soon", days: `${d}d left`           };
  return         { color: "#10b981", label: "Valid",         days: `${d}d left`           };
}

const VEHICLES = [
  { id:"1", number:"TN01AB1234", type:"Truck",     make:"Tata",          model:"Prima 4928.S", year:2021, cap:25, status:"active"      as VStatus, driver:"Ramesh Kumar",  driverPhone:"+91 98400 11111", trip:"TRIP-8821", branch:"Chennai",   docs:{rc:"2035-06-01",insurance:"2026-09-15",permit:"2027-03-01",fitness:"2026-12-01",puc:"2026-08-10"} },
  { id:"2", number:"TN02CD5678", type:"Container", make:"Ashok Leyland", model:"Boss 1616",    year:2020, cap:20, status:"in_trip"     as VStatus, driver:"Suresh Babu",   driverPhone:"+91 98400 22222", trip:"TRIP-8820", branch:"Mumbai",    docs:{rc:"2034-08-01",insurance:"2026-07-20",permit:"2026-11-01",fitness:"2026-07-15",puc:"2026-07-25"} },
  { id:"3", number:"TN03EF9012", type:"Truck",     make:"Eicher",        model:"Pro 6031",     year:2022, cap:15, status:"maintenance" as VStatus, driver:null,             driverPhone:null,              trip:null,        branch:"Delhi",     docs:{rc:"2036-01-01",insurance:"2027-02-01",permit:"2027-06-01",fitness:"2027-01-01",puc:"2027-01-10"} },
  { id:"4", number:"KA02IJ7890", type:"Tanker",    make:"Tata",          model:"LPT 3118",     year:2019, cap:18, status:"active"      as VStatus, driver:"Karthik M",     driverPhone:"+91 98400 44444", trip:null,        branch:"Bangalore", docs:{rc:"2033-05-01",insurance:"2025-12-01",permit:"2026-08-01",fitness:"2026-06-01",puc:"2026-07-05"} },
  { id:"5", number:"MH04MN5678", type:"Truck",     make:"BharatBenz",    model:"3528R",        year:2023, cap:28, status:"active"      as VStatus, driver:"Ravi Shankar",  driverPhone:"+91 98400 55555", trip:null,        branch:"Pune",      docs:{rc:"2037-03-01",insurance:"2027-05-01",permit:"2028-01-01",fitness:"2027-04-01",puc:"2027-04-01"} },
  { id:"6", number:"AP03KL1234", type:"Trailer",   make:"Tata",          model:"Signa 4625",   year:2020, cap:35, status:"inactive"    as VStatus, driver:null,             driverPhone:null,              trip:null,        branch:"Hyderabad", docs:{rc:"2034-11-01",insurance:"2026-08-05",permit:"2026-09-01",fitness:"2026-08-01",puc:"2026-07-28"} },
  { id:"7", number:"TN05GH2345", type:"Truck",     make:"Tata",          model:"LPT 2516",     year:2022, cap:22, status:"active"      as VStatus, driver:"Muthu Raja",    driverPhone:"+91 98400 77777", trip:"TRIP-8819", branch:"Chennai",   docs:{rc:"2036-04-01",insurance:"2027-01-01",permit:"2027-08-01",fitness:"2027-02-01",puc:"2027-02-10"} },
  { id:"8", number:"MH12JK3456", type:"Container", make:"Volvo",         model:"FH16",         year:2021, cap:30, status:"in_trip"     as VStatus, driver:"Arjun Singh",   driverPhone:"+91 98400 88888", trip:"TRIP-8818", branch:"Mumbai",    docs:{rc:"2035-09-01",insurance:"2026-10-01",permit:"2027-04-01",fitness:"2026-11-01",puc:"2026-09-15"} },
];

const STATUS_TABS = [
  { key:"all",         label:"All"         },
  { key:"active",      label:"Active"      },
  { key:"in_trip",     label:"On Trip"     },
  { key:"maintenance", label:"Maintenance" },
  { key:"inactive",    label:"Inactive"    },
];

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.ring}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

function DocHealthBar({ docs }: { docs: Record<string, string> }) {
  const { valid, expiring, expired, pct } = calcDocHealth(docs);
  const color = pct === 100 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  const label = pct === 100 ? "Healthy" : pct >= 60 ? "Attention" : "Critical";

  return (
    <div className="flex flex-col gap-1 min-w-[90px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold" style={{ color }}>{pct}%</span>
        <span className="text-[10px] text-slate-400 font-medium">{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex gap-1 text-[10px] text-slate-400">
        {expired > 0 && <span className="text-red-500 font-semibold">{expired} exp</span>}
        {expiring > 0 && <span className="text-amber-500 font-semibold">{expiring} soon</span>}
        <span className="text-emerald-600 font-semibold">{valid} ok</span>
      </div>
    </div>
  );
}

function DocTooltip({ docs }: { docs: Record<string, string> }) {
  return (
    <div className="absolute bottom-full right-0 mb-2 w-52 bg-slate-900 rounded-lg shadow-2xl p-3 z-50">
      <div className="text-[11px] font-bold text-white mb-2 border-b border-slate-700 pb-1.5">Document Status</div>
      <div className="space-y-1.5">
        {DOC_KEYS.map(k => {
          const ds = docStatusFor(docs[k]);
          return (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 uppercase font-medium w-16">{k}</span>
              <span className="text-[10px] font-semibold" style={{ color: ds.color }}>{ds.label}</span>
              <span className="text-[10px] text-slate-500">{ds.days}</span>
            </div>
          );
        })}
      </div>
      <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-900" />
    </div>
  );
}

function ContextMenu({ items }: { items: { icon: React.ElementType; label: string; danger?: boolean; disabled?: boolean; onClick?: () => void }[] }) {
  return (
    <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-200 py-1.5 z-50">
      {items.map(({ icon: Icon, label, danger, disabled, onClick }, i) => (
        <button
          key={i}
          disabled={disabled}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium transition-colors text-left
            ${disabled ? "text-slate-300 cursor-not-allowed"
              : danger  ? "text-red-600 hover:bg-red-50"
              : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"}`}
        >
          <Icon size={13} className="flex-shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────
function KpiCard({
  label, value, trend, trendUp, icon: Icon, iconColor, iconBg, onClick, isActive
}: {
  label: string; value: number; trend: string; trendUp: boolean;
  icon: React.ElementType; iconColor: string; iconBg: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 flex flex-col gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${isActive ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200"}
      `}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{ background: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div
          className={`flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md
            ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}
        >
          {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      </div>
      <div>
        <div className="text-[28px] font-extrabold text-slate-900 leading-none">{value}</div>
        <div className="text-[12px] text-slate-500 font-medium mt-1">{label}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function VehiclesPage() {
  const [mounted,      setMounted]      = useState(false);
  const [vehicles,     setVehicles]     = useState<any[]>([]);
  const [drivers,      setDrivers]      = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [viewMode,     setViewMode]     = useState<"table" | "grid">("table");
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [showFilter,   setShowFilter]   = useState(false);
  const [showColumns,  setShowColumns]  = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [columns, setColumns] = useState({
    type: true,
    status: true,
    driver: true,
    branchTrip: true,
    documents: true,
  });
  const [spinning,     setSpinning]     = useState(false);
  const [menuId,       setMenuId]       = useState<string | null>(null);
  const [docTipId,     setDocTipId]     = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Add Modal Form State
  const [formData, setFormData] = useState({
    vehicle_number: "", make: "", model: "", year: "",
    type: "", capacity_tons: "", branch: "Chennai",
    rc_number: "", rc_expiry: "",
    insurance_number: "", insurance_expiry: "",
    permit_number: "", permit_expiry: "",
    fitness_number: "", fitness_expiry: "",
    puc_number: "", puc_expiry: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.getVehicles();
      setVehicles(res.vehicles || []);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    } finally {
      setLoading(false);
      setSpinning(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await api.getDrivers();
      setDrivers(res.drivers || []);
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    }
  };

  const handleAssignDriver = async (vehicleId: string, driverId: string) => {
    try {
      if (driverId) {
        await api.createAssignment({ vehicle_id: vehicleId, driver_id: driverId });
      }
      fetchVehicles();
    } catch (err) {
      console.error("Failed to assign driver", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchVehicles();
    fetchDrivers();
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      setMenuId(null);
      setDocTipId(null);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
      if (columnsRef.current && !columnsRef.current.contains(e.target as Node)) {
        setShowColumns(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setShowViewMenu(false);
      }
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  if (!mounted) return null;

  // ── Derived stats ──────────────────────────────────────
  const total       = vehicles.length;
  const activeCount = vehicles.filter(v => v.status === "active").length;
  const onTripCount = vehicles.filter(v => v.status === "in_trip").length;
  const maintCount  = vehicles.filter(v => v.status === "maintenance").length;
  const inactCount  = vehicles.filter(v => v.status === "inactive").length;
  const expiredDocs = vehicles.reduce((n, v) => {
    const docsObj = v.docs || { rc: v.rc_expiry, insurance: v.insurance_expiry, permit: v.permit_expiry, fitness: v.fitness_expiry, puc: v.puc_expiry };
    return n + Object.values(docsObj).filter((d: any) => new Date(d).getTime() < MOCK_NOW).length;
  }, 0);

  const kpis = [
    { label: "Total Fleet",       value: total,       trend: "+2",    trendUp: true,  icon: Truck,         iconColor: "#2563eb", iconBg: "#eff6ff", filter: "all" },
    { label: "Active Vehicles",   value: activeCount, trend: "+12%",  trendUp: true,  icon: CheckCircle2,  iconColor: "#10b981", iconBg: "#f0fdf4", filter: "active" },
    { label: "On Trip",           value: onTripCount, trend: "+1",    trendUp: true,  icon: Route,         iconColor: "#3b82f6", iconBg: "#eff6ff", filter: "in_trip" },
    { label: "In Maintenance",    value: maintCount,  trend: "-1",    trendUp: false, icon: Wrench,        iconColor: "#f59e0b", iconBg: "#fffbeb", filter: "maintenance" },
    { label: "Inactive",          value: inactCount,  trend: "same",  trendUp: false, icon: Power,         iconColor: "#94a3b8", iconBg: "#f8fafc", filter: "inactive" },
    { label: "Expired Documents", value: expiredDocs, trend: "-3",    trendUp: false, icon: AlertTriangle, iconColor: "#ef4444", iconBg: "#fef2f2", filter: null },
  ];

  // ── Filter ──────────────────────────────────────────────
  const rows = vehicles.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = (
      (v.vehicle_number || "").toLowerCase().includes(q) ||
      (v.make || "").toLowerCase().includes(q)   ||
      (v.driver || "").toLowerCase().includes(q) ||
      (v.branch || "").toLowerCase().includes(q)
    );
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    const matchBranch = branchFilter === "all" || v.branch === branchFilter;
    
    return matchSearch && matchStatus && matchBranch;
  });

  const refresh = () => { setSpinning(true); fetchVehicles(); };

  return (
    <div className="space-y-5">

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Truck size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-[17px] font-bold text-slate-900 leading-tight">Vehicle Fleet</h1>
                <p className="text-[11.5px] text-slate-400 mt-0.5">Manage and monitor fleet vehicles across all branches and operations</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={refresh}
              title="Refresh data"
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <RefreshCw size={14} className={spinning ? "animate-spin" : ""} />
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <button 
              onClick={() => setShowImportModal(true)}
              className="h-9 flex items-center gap-1.5 px-3.5 rounded-lg border border-slate-200 bg-white text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Upload size={13} /> Import
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="h-9 flex items-center gap-1.5 px-3.5 rounded-lg border border-slate-200 bg-white text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Download size={13} /> Export
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="h-9 flex items-center gap-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-semibold transition-all shadow-sm hover:shadow-blue-200 hover:shadow-md"
            >
              <Plus size={15} className="flex-shrink-0" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-6 py-4 space-y-4">

          {/* ── KPI GRID ─────────────────────────────────── */}
          <div className="grid grid-cols-6 gap-4">
            {kpis.map(k => (
              <KpiCard 
                key={k.label} 
                {...k} 
                isActive={statusFilter === k.filter}
                onClick={k.filter ? () => setStatusFilter(k.filter) : undefined}
              />
            ))}
          </div>

          {/* ── TOOLBAR ──────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3 flex items-center gap-3">

            {/* Search */}
            <div className="relative w-64 flex-shrink-0">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search vehicle, driver, branch…"
                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg text-[12.5px] text-slate-800
                           pl-3 pr-3 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2
                           focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Segmented status tabs */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5 flex-shrink-0">
              {STATUS_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`h-8 px-5 rounded-md text-[12px] font-semibold transition-all whitespace-nowrap
                    ${statusFilter === key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Result count */}
            <span className="text-[12px] text-slate-400 font-medium">
              {rows.length} of {vehicles.length} vehicles
            </span>

            <div className="h-5 w-px bg-slate-200" />

            {/* Advanced filter */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`h-9 flex items-center gap-1.5 px-3 rounded-lg border transition-colors flex-shrink-0 text-[12px] font-semibold
                  ${showFilter || branchFilter !== "all" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                <SlidersHorizontal size={13} className={showFilter || branchFilter !== "all" ? "text-blue-500" : "text-slate-400"} />
                Filter {branchFilter !== "all" && <span className="ml-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">1</span>}
              </button>

              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <h3 className="text-[13px] font-bold text-slate-800 mb-3">Filter by Branch</h3>
                  <div className="space-y-2">
                    {["all", "Chennai", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"].map(b => (
                      <label key={b} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="branch" 
                          checked={branchFilter === b}
                          onChange={() => setBranchFilter(b)}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className={`text-[13px] font-medium transition-colors ${branchFilter === b ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800"}`}>
                          {b === "all" ? "All Branches" : b}
                        </span>
                      </label>
                    ))}
                  </div>
                  {branchFilter !== "all" && (
                    <button 
                      onClick={() => setBranchFilter("all")}
                      className="mt-4 w-full h-8 rounded-lg bg-slate-100 text-slate-600 text-[12px] font-bold hover:bg-slate-200 transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Column settings */}
            <div className="relative" ref={columnsRef}>
              <button 
                onClick={() => setShowColumns(!showColumns)}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-colors flex-shrink-0
                  ${showColumns ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
              >
                <Settings2 size={14} className={showColumns ? "text-blue-500" : "text-slate-500"} />
              </button>

              {showColumns && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <h3 className="text-[13px] font-bold text-slate-800 mb-3">Visible Columns</h3>
                  <div className="space-y-3">
                    {[
                      { key: "type", label: "Type" },
                      { key: "status", label: "Status" },
                      { key: "driver", label: "Driver" },
                      { key: "branchTrip", label: "Branch / Trip" },
                      { key: "documents", label: "Documents" },
                    ].map(col => (
                      <label key={col.key} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={columns[col.key as keyof typeof columns]}
                          onChange={(e) => setColumns(prev => ({ ...prev, [col.key]: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                          {col.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View options */}
            <div className="relative" ref={viewMenuRef}>
              <button 
                onClick={() => setShowViewMenu(!showViewMenu)}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-colors flex-shrink-0
                  ${showViewMenu ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
              >
                {viewMode === "table" ? <ListIcon size={14} className={showViewMenu ? "text-blue-500" : "text-slate-500"} /> : <LayoutGrid size={14} className={showViewMenu ? "text-blue-500" : "text-slate-500"} />}
              </button>

              {showViewMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { setViewMode("table"); setShowViewMenu(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${viewMode === "table" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <ListIcon size={14} />
                    Table View
                  </button>
                  <button 
                    onClick={() => { setViewMode("grid"); setShowViewMenu(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors mt-1 ${viewMode === "grid" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <LayoutGrid size={14} />
                    Grid View
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── CONTENT ──────────────────────────────────── */}
          {rows.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-20 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                <SearchX size={28} className="text-slate-300" />
              </div>
              <p className="text-[15px] font-bold text-slate-700 mb-1">No vehicles found</p>
              <p className="text-[13px] text-slate-400 mb-5">Adjust your search or filter to find vehicles.</p>
              <button
                onClick={() => { setSearch(""); setStatusFilter("all"); setBranchFilter("all"); }}
                className="h-9 px-5 bg-blue-600 text-white rounded-lg text-[12.5px] font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            </div>

          ) : viewMode === "table" ? (

            /* ══ TABLE ══════════════════════════════════════ */
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[960px]">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50">
                      {[
                        { id: "vehicle",    label: "Vehicle",       cls: "w-[220px]", show: true },
                        { id: "type",       label: "Type",          cls: "w-[120px]", show: columns.type },
                        { id: "status",     label: "Status",        cls: "w-[120px]", show: columns.status },
                        { id: "driver",     label: "Driver",        cls: "w-[160px]", show: columns.driver },
                        { id: "branchTrip", label: "Branch / Trip", cls: "w-[150px]", show: columns.branchTrip },
                        { id: "documents",  label: "Documents",     cls: "w-[130px]", show: columns.documents },
                        { id: "actions",    label: "Actions",       cls: "w-[110px] text-center", show: true },
                      ].filter(h => h.show).map(h => (
                        <th
                          key={h.id}
                          className={`px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${h.cls}`}
                        >
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((v, idx) => {
                      const isOpen    = menuId === v.id;
                      const isDocOpen = docTipId === v.id;
                      const init      = (v.driver ?? v.vehicle_number ?? "?")[0].toUpperCase();

                      return (
                        <tr
                          key={v.id}
                          className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors
                            ${idx === rows.length - 1 ? "border-b-0" : ""}`}
                        >
                          {/* ── Vehicle ── */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-[14px] flex-shrink-0 shadow-sm">
                                {init}
                              </div>
                              <div>
                                <div className="text-[13px] font-bold text-slate-900 leading-tight">{v.vehicle_number}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">{v.make} {v.model} · {v.year}</div>
                              </div>
                            </div>
                          </td>

                          {/* ── Type ── */}
                          {columns.type && (
                            <td className="px-4 py-3">
                              <div className="text-[12.5px] font-semibold text-slate-700">{v.type}</div>
                              <div className="text-[11px] text-slate-400">{v.capacity_tons || v.cap}T capacity</div>
                            </td>
                          )}

                          {/* ── Status ── */}
                          {columns.status && (
                            <td className="px-4 py-3">
                              <StatusBadge status={v.status} />
                            </td>
                          )}

                          {/* ── Driver ── */}
                          {columns.driver && (
                            <td className="px-4 py-3">
                              <select
                                value={v.driver_id || ""}
                                onChange={(e) => handleAssignDriver(v.id, e.target.value)}
                                className="text-xs border border-slate-200 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 w-36"
                              >
                                <option value="">Unassigned</option>
                                {drivers.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          )}

                          {/* ── Branch / Trip ── */}
                          {columns.branchTrip && (
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-[12.5px] font-semibold text-slate-700">
                                <MapPin size={11} className="text-slate-400 flex-shrink-0" />
                                {v.branch}
                              </div>
                              {v.trip ? (
                                <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-0.5">
                                  <Route size={10} className="flex-shrink-0" />
                                  {v.trip}
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-300 mt-0.5">No active trip</div>
                              )}
                            </td>
                          )}

                          {/* ── Documents ── */}
                          {columns.documents && (
                            <td className="px-4 py-3">
                              <div
                                className="relative cursor-pointer"
                                onClick={e => { e.stopPropagation(); setDocTipId(isDocOpen ? null : v.id); }}
                              >
                                <DocHealthBar docs={v.docs || { rc: v.rc_expiry, insurance: v.insurance_expiry, permit: v.permit_expiry, fitness: v.fitness_expiry, puc: v.puc_expiry }} />
                                {isDocOpen && <DocTooltip docs={v.docs || { rc: v.rc_expiry, insurance: v.insurance_expiry, permit: v.permit_expiry, fitness: v.fitness_expiry, puc: v.puc_expiry }} />}
                              </div>
                            </td>
                          )}

                          {/* ── Actions ── */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-0.5 relative">
                              <button
                                title="View Details"
                                onClick={() => router.push(`/vehicles/${v.id}`)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                title="Edit Vehicle"
                                onClick={() => router.push(`/vehicles/${v.id}?edit=true`)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                title="More Options"
                                onClick={e => { e.stopPropagation(); setMenuId(isOpen ? null : v.id); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              >
                                <MoreVertical size={14} />
                              </button>
                              {isOpen && (
                                <ContextMenu items={[
                                  { icon: Eye,       label: "View Details", onClick: () => router.push(`/fleet/vehicles/${v.id}`) },
                                  { icon: Edit2,     label: "Edit Vehicle", onClick: () => { setFormData(v as any); setEditingId(v.id); setShowAddModal(true); setMenuId(null); } },
                                  { icon: UserPlus,  label: "Assign Driver", disabled: !!v.driver, onClick: () => console.log("Assigning driver") },
                                  { icon: Phone,     label: "Call Driver",   disabled: !v.driver, onClick: () => console.log("Calling driver") },
                                  { icon: FileText,  label: "Open Trip",     disabled: !v.trip, onClick: () => console.log("Opening trip") },
                                  { icon: Wrench,    label: "Service History", onClick: () => console.log("Viewing service history") },
                                  { icon: Shield,    label: "View Documents", onClick: () => console.log("Viewing documents") },
                                  { icon: Download,  label: "Export Vehicle", onClick: () => console.log("Exporting vehicle") },
                                ]} />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-[11.5px] text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-700">{rows.length}</span> of <span className="font-bold text-slate-700">{VEHICLES.length}</span> vehicles
                </span>
                <div className="flex items-center gap-1">
                  <button className="shrink-0 h-7 px-3 rounded-lg text-[11.5px] font-semibold text-slate-500 hover:bg-slate-200 border border-slate-200 bg-white transition-colors">← Prev</button>
                  <button className="shrink-0 h-7 px-3 rounded-lg text-[11.5px] font-semibold bg-blue-600 text-white shadow-sm">1</button>
                  <button className="shrink-0 h-7 px-3 rounded-lg text-[11.5px] font-semibold text-slate-500 hover:bg-slate-200 border border-slate-200 bg-white transition-colors">Next →</button>
                </div>
              </div>
            </div>

          ) : (

            /* ══ GRID ════════════════════════════════════════ */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {rows.map(v => {
                const st     = STATUS_CONFIG[v.status as VStatus] || STATUS_CONFIG["active"];
                const health = calcDocHealth(v.docs);
                const isOpen = menuId === v.id;

                return (
                  <div key={v.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group">

                    {/* Card top strip */}
                    <div className="h-1" style={{ background: st.dot }} />

                    {/* Card header */}
                    <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Truck size={20} className="text-slate-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14px] font-extrabold text-slate-900 truncate">{v.vehicle_number}</div>
                          <div className="text-[11px] text-slate-400 truncate">{v.make} {v.model} · {v.year}</div>
                        </div>
                      </div>
                      <div className="relative flex-shrink-0">
                        <StatusBadge status={v.status} />
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-4 pb-3 space-y-2 border-t border-slate-100 pt-3">
                      {[
                        { label: "Type",    value: `${v.type} · ${v.capacity_tons || v.cap}T` },
                        { label: "Branch",  value: v.branch                 },
                        { label: "Driver",  value: v.driver ?? "Unassigned" },
                        { label: "Trip",    value: v.trip    ?? "—"          },
                      ].map(r => (
                        <div key={r.label} className="flex items-center justify-between text-[12px]">
                          <span className="text-slate-400 font-medium w-12 flex-shrink-0">{r.label}</span>
                          <span className={`font-semibold text-right truncate ml-2
                            ${r.label === "Trip" && v.trip ? "text-blue-600" : "text-slate-700"}
                            ${r.label === "Driver" && !v.driver ? "text-slate-400 italic" : ""}`}>
                            {r.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Card footer */}
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <DocHealthBar docs={v.docs || { rc: v.rc_expiry, insurance: v.insurance_expiry, permit: v.permit_expiry, fitness: v.fitness_expiry, puc: v.puc_expiry }} />
                      <div className="flex items-center gap-0.5 relative">
                        <button
                          onClick={() => router.push(`/vehicles/${v.id}`)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => router.push(`/vehicles/${v.id}?edit=true`)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setMenuId(isOpen ? null : v.id); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 transition-colors"
                        >
                          <MoreVertical size={13} />
                        </button>
                        {isOpen && (
                          <ContextMenu items={[
                            { icon: Eye,      label: "View Details", onClick: () => router.push(`/fleet/vehicles/${v.id}`) },
                            { icon: Edit2,    label: "Edit Vehicle", onClick: () => { setFormData(v as any); setEditingId(v.id); setShowAddModal(true); setMenuId(null); } },
                            { icon: UserPlus, label: "Assign Driver", disabled: !!v.driver, onClick: () => console.log("Assigning driver") },
                            { icon: Wrench,   label: "Service History", onClick: () => console.log("Viewing service history") },
                            { icon: Download, label: "Export", onClick: () => console.log("Exporting vehicle") },
                          ]} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── ADD VEHICLE MODAL (OLD STYLE) ────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm shrink-0" style={{ padding: '0 24px' }}>
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <Truck className="text-[#2563eb]" /> Add New Vehicle
            </h2>
            <button className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none" onClick={() => setShowAddModal(false)}>×</button>
          </div>
          {/* Content Centered */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 px-4">
            <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm shrink-0" style={{ maxWidth: '800px', padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                  { label: "Vehicle Number *", key: "vehicle_number", placeholder: "e.g. TN01AB1234", colSpan: true },
                  { label: "Make / Brand", key: "make", placeholder: "e.g. Tata" },
                  { label: "Model", key: "model", placeholder: "e.g. Prima 4928.S" },
                  { label: "Vehicle Type", key: "type", placeholder: "e.g. Truck, Trailer" },
                  { label: "Capacity (Tons)", key: "capacity_tons", placeholder: "e.g. 25" },
                ].map(field => (
                  <div key={field.key} style={{ gridColumn: field.colSpan ? '1 / -1' : 'auto' }}>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">{field.label}</label>
                    <input 
                      type="text" 
                      value={formData[field.key as keyof typeof formData]}
                      onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder} 
                      className="w-full h-10 px-3 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                ))}

                <div className="col-span-full h-px bg-slate-100 my-2" style={{ gridColumn: '1 / -1' }} />
                <div className="col-span-full font-bold text-slate-800 text-[14px] mb-[-8px]" style={{ gridColumn: '1 / -1' }}>Document Details & Expiry</div>

                {[
                  { label: "RC Details *", numKey: "rc_number", dateKey: "rc_expiry", placeholder: "RC Number", colSpan: true },
                  { label: "Insurance Policy", numKey: "insurance_number", dateKey: "insurance_expiry", placeholder: "Policy No" },
                  { label: "Permit Details", numKey: "permit_number", dateKey: "permit_expiry", placeholder: "Permit No" },
                  { label: "Fitness Certificate", numKey: "fitness_number", dateKey: "fitness_expiry", placeholder: "Certificate No" },
                  { label: "PUC (Pollution)", numKey: "puc_number", dateKey: "puc_expiry", placeholder: "PUC No" },
                ].map(field => (
                  <div key={field.numKey} style={{ gridColumn: field.colSpan ? '1 / -1' : 'auto' }}>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">{field.label}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={formData[field.numKey as keyof typeof formData]}
                        onChange={e => setFormData({ ...formData, [field.numKey]: e.target.value })}
                        placeholder={field.placeholder} 
                        className="flex-1 w-full h-10 px-3 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                      />
                      <input 
                        type="date"
                        value={formData[field.dateKey as keyof typeof formData]}
                        onChange={e => setFormData({ ...formData, [field.dateKey]: e.target.value })}
                        title={`${field.label} Expiry Date`}
                        className="w-36 flex-shrink-0 h-10 px-3 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-600 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
                
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    disabled={submitting}
                    className="flex-1 h-10 rounded-full bg-[#f1f5f9] text-[#475569] text-sm font-semibold hover:bg-[#e2e8f0] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={async () => {
                      if (!formData.vehicle_number) return alert("Vehicle Number is required");
                      setSubmitting(true);
                      try {
                        await api.createVehicle({ ...formData, year: 2024, branch: "Chennai" });
                        setShowAddModal(false);
                        setFormData({
                          vehicle_number: "", make: "", model: "", year: "",
                          type: "", capacity_tons: "", branch: "Chennai",
                          rc_number: "", rc_expiry: "",
                          insurance_number: "", insurance_expiry: "",
                          permit_number: "", permit_expiry: "",
                          fitness_number: "", fitness_expiry: "",
                          puc_number: "", puc_expiry: ""
                        });
                        fetchVehicles();
                      } catch (err) {
                        console.error("Failed to add vehicle", err);
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    className="flex-1 h-10 rounded-full bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Add Vehicle"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Import Vehicles</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Upload a CSV or Excel file</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls" />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center py-10 px-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors mb-6"
              >
                <Upload size={32} className="text-slate-300 mb-3" />
                <div className="text-[14px] font-bold text-slate-700">Click to upload file</div>
                <div className="text-[12px] text-slate-400 mt-1">.csv, .xlsx, .xls (max 10MB)</div>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-[11px] font-semibold">
                  Browse Files
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100 mb-6">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  <span className="text-[12px] font-semibold text-blue-700">Need a template?</span>
                </div>
                <button className="text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Download CSV
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert("Import started! This would process the uploaded file.");
                    setShowImportModal(false);
                  }}
                  className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] border border-blue-500/20 text-[13px] flex items-center justify-center gap-2"
                >
                  <Upload size={16} /> Import Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Download size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Export Vehicles</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Download your vehicle data as CSV</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50/50 cursor-pointer transition-colors hover:bg-blue-50">
                  <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <div>
                    <div className="text-[13px] font-bold text-slate-800 leading-none">Basic Details</div>
                    <div className="text-[12px] text-slate-500 mt-1">Vehicle number, make, model, type, and status</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer transition-colors hover:bg-slate-50">
                  <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <div>
                    <div className="text-[13px] font-bold text-slate-800 leading-none">Document Info</div>
                    <div className="text-[12px] text-slate-500 mt-1">RC, Insurance, Permit numbers and expiry dates</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer transition-colors hover:bg-slate-50">
                  <input type="checkbox" className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <div>
                    <div className="text-[13px] font-bold text-slate-800 leading-none">Maintenance History</div>
                    <div className="text-[12px] text-slate-500 mt-1">Recent services, costs, and upcoming maintenance</div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const headers = ["Vehicle Number", "Make", "Model", "Type", "Status", "Driver", "Branch"];
                    const csvRows = [headers.join(",")];
                    for (const v of vehicles) {
                      const row = [
                        `"${v.vehicle_number || ""}"`,
                        `"${v.make || ""}"`,
                        `"${v.model || ""}"`,
                        `"${v.type || ""}"`,
                        `"${v.status || ""}"`,
                        `"${v.driver?.name || v.driver || ""}"`,
                        `"${v.branch || ""}"`
                      ];
                      csvRows.push(row.join(","));
                    }
                    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `vehicles_export_${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    setShowExportModal(false);
                  }}
                  className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] border border-blue-500/20 text-[13px] flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
