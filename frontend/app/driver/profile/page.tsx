"use client";

import { User, Phone, Mail, FileText, Truck, Calendar, Activity, Star, Route, Wallet, Award, Settings, LogOut, ChevronRight } from "lucide-react";
import { useDriverSync } from "@/hooks/useDriverSync";
import Link from "next/link";

export default function DriverProfilePage() {
  const { driverMe, loading } = useDriverSync();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const d = driverMe?.driver || {};
  const v = driverMe?.assignedVehicle;

  // Mock performance stats
  const stats = {
    rating: 4.8,
    totalDistance: "45,200",
    completedTrips: 124,
    monthlyEarnings: "₹32,500"
  };

  return (
    <div className="cmd-root p-6 max-w-7xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">My Profile</h1>
          <p className="cmd-banner-sub">
            View your personal information, performance metrics, and settings.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        
        {/* Left Column - Profile & Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="cmd-chart-card text-center flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {d.photo_url ? (
                  <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-400" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white" title="Active"></div>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{d.name || "Unknown"}</h2>
            <p className="text-sm font-medium text-slate-500 mb-4">{d.employee_id || d.id}</p>
            <div className={`badge ${d.status === 'active' ? 'badge-completed' : 'badge-danger'}`}>
              {d.status || "Unknown"}
            </div>
          </div>

          <div className="cmd-chart-card p-2">
            <div className="flex flex-col space-y-1">
              <button className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                <div className="flex items-center gap-3 text-slate-700 group-hover:text-blue-600 font-semibold text-sm">
                  <Settings size={18} /> Account Settings
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
              <button className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                <div className="flex items-center gap-3 text-slate-700 group-hover:text-blue-600 font-semibold text-sm">
                  <Award size={18} /> Rewards & Recognition
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
              <button className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                <div className="flex items-center gap-3 text-slate-700 group-hover:text-blue-600 font-semibold text-sm">
                  <FileText size={18} /> Tax Documents
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Performance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card" style={{ "--accent": "#f59e0b" } as React.CSSProperties}>
              <div className="stat-card-top">
                <span className="stat-label">RATING</span>
                <span className="stat-icon" style={{ color: "#f59e0b", background: "#f59e0b18" }}><Star size={15}/></span>
              </div>
              <div className="stat-value text-2xl">{stats.rating}</div>
              <div className="stat-trend">Top 10% Driver</div>
            </div>
            <div className="stat-card" style={{ "--accent": "#3b82f6" } as React.CSSProperties}>
              <div className="stat-card-top">
                <span className="stat-label">DISTANCE (KM)</span>
                <span className="stat-icon" style={{ color: "#3b82f6", background: "#3b82f618" }}><Route size={15}/></span>
              </div>
              <div className="stat-value text-2xl">{stats.totalDistance}</div>
              <div className="stat-trend">Lifetime driven</div>
            </div>
            <div className="stat-card" style={{ "--accent": "#10b981" } as React.CSSProperties}>
              <div className="stat-card-top">
                <span className="stat-label">TRIPS</span>
                <span className="stat-icon" style={{ color: "#10b981", background: "#10b98118" }}><Truck size={15}/></span>
              </div>
              <div className="stat-value text-2xl">{stats.completedTrips}</div>
              <div className="stat-trend">Successfully done</div>
            </div>
            <div className="stat-card" style={{ "--accent": "#8b5cf6" } as React.CSSProperties}>
              <div className="stat-card-top">
                <span className="stat-label">EARNINGS</span>
                <span className="stat-icon" style={{ color: "#8b5cf6", background: "#8b5cf618" }}><Wallet size={15}/></span>
              </div>
              <div className="stat-value text-2xl">{stats.monthlyEarnings}</div>
              <div className="stat-trend">This month (est)</div>
            </div>
          </div>

          <div className="cmd-chart-card">
            <div className="cmd-chart-header border-b border-slate-100 pb-4 mb-4">
              <h3 className="cmd-chart-title flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> Personal Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5"><Phone size={12}/> Mobile Number</label>
                <div className="text-sm font-semibold text-slate-900">{d.phone || "—"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5"><Mail size={12}/> Email Address</label>
                <div className="text-sm font-semibold text-slate-900">{d.email || "—"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5"><FileText size={12}/> License Number</label>
                <div className="text-sm font-semibold text-slate-900">{d.license_no || "—"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5"><Calendar size={12}/> License Expiry</label>
                <div className="text-sm font-semibold text-slate-900">{d.license_expiry ? new Date(d.license_expiry).toLocaleDateString() : "—"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5"><Truck size={12}/> Assigned Vehicle</label>
                <div className="text-sm font-semibold text-slate-900">{v ? v.vehicle_number : d.vehicle_no || "None"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5"><Activity size={12}/> Vehicle Type</label>
                <div className="text-sm font-semibold text-slate-900">{v?.type || "—"}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
