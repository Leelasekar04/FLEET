"use client";

import { Truck, Loader2, Info, Navigation, Calendar, Settings, ShieldAlert, Droplet, Wrench, AlertTriangle, FileText } from "lucide-react";
import { useDriverSync } from "@/hooks/useDriverSync";
import Link from "next/link";

export default function DriverVehiclesPage() {
  const { driverMe, loading } = useDriverSync();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const v = driverMe?.assignedVehicle;

  return (
    <div className="cmd-root p-6 max-w-7xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Assigned Vehicle</h1>
          <p className="cmd-banner-sub">
            Complete vehicle profile, specifications, compliance, and history.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <Link href="/driver/support" className="btn btn-secondary btn-sm">
            <AlertTriangle size={16} className="text-amber-500 mr-2" /> Report Issue
          </Link>
        </div>
      </div>
      
      {!v ? (
        <div className="empty-state mt-6">
          <Truck size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No assigned vehicles</h3>
          <p className="max-w-sm mx-auto">
            You don't have any vehicles assigned to your current active trips.
          </p>
        </div>
      ) : (
        <>
          {/* ── Overview Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 animate-fade-in stagger-1">
            {/* Primary Hero Card */}
            <div className="md:col-span-1 bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Truck size={160} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2">
                  <Truck size={14} /> Active Assignment
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-1">{v.vehicle_number}</h2>
                <div className="text-sm font-medium text-slate-400">{v.make || "Unknown"} {v.model || ""}</div>
              </div>
              <div className="relative z-10 mt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  {v.status || "Active"}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="stat-card" style={{ "--accent": "#3b82f6" } as React.CSSProperties}>
                <div className="stat-card-top">
                  <span className="stat-label">CURRENT ODOMETER</span>
                  <span className="stat-icon" style={{ color: "#3b82f6", background: "#3b82f618" }}><Navigation size={15}/></span>
                </div>
                <div className="stat-value">{v.current_km || "0"} <span className="text-sm text-slate-500 font-medium">km</span></div>
                <div className="stat-trend">Last updated today</div>
              </div>
              <div className="stat-card" style={{ "--accent": "#10b981" } as React.CSSProperties}>
                <div className="stat-card-top">
                  <span className="stat-label">FUEL EFFICIENCY</span>
                  <span className="stat-icon" style={{ color: "#10b981", background: "#10b98118" }}><Droplet size={15}/></span>
                </div>
                <div className="stat-value">5.2 <span className="text-sm text-slate-500 font-medium">km/l</span></div>
                <div className="stat-trend">Avg. for this month</div>
              </div>
              <div className="stat-card" style={{ "--accent": "#f59e0b" } as React.CSSProperties}>
                <div className="stat-card-top">
                  <span className="stat-label">NEXT SERVICE</span>
                  <span className="stat-icon" style={{ color: "#f59e0b", background: "#f59e0b18" }}><Wrench size={15}/></span>
                </div>
                <div className="stat-value">1,200 <span className="text-sm text-slate-500 font-medium">km</span></div>
                <div className="stat-trend">Or in 14 days</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in stagger-2">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div className="cmd-chart-card">
                <div className="cmd-chart-title mb-4 flex items-center gap-2"><Info size={18} className="text-blue-600" /> Vehicle Information</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">Vehicle Type</span>
                    <span className="text-sm font-bold text-slate-900">{v.type || "Heavy Commercial"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">Fuel Type</span>
                    <span className="text-sm font-bold text-slate-900">{v.fuel_type || "Diesel"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">Chassis Number</span>
                    <span className="text-sm font-bold text-slate-900 uppercase">CHK{Math.floor(Math.random()*1000000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-semibold text-slate-500">Engine Number</span>
                    <span className="text-sm font-bold text-slate-900 uppercase">ENG{Math.floor(Math.random()*1000000)}</span>
                  </div>
                </div>
              </div>

              <div className="cmd-chart-card">
                <div className="cmd-chart-header">
                  <div className="cmd-chart-title flex items-center gap-2"><Wrench size={18} className="text-indigo-600" /> Service History</div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="activity-list mt-4">
                  {[
                    { date: "12 Oct 2023", desc: "Regular Oil Change & Filter Replacement", cost: "₹4,500" },
                    { date: "05 Sep 2023", desc: "Brake Pad Replacement", cost: "₹12,200" },
                  ].map((srv, i) => (
                    <div key={i} className="activity-row">
                      <div className="activity-icon bg-indigo-50"><Wrench size={12} className="text-indigo-600" /></div>
                      <div className="activity-body">
                        <div className="activity-driver">{srv.desc}</div>
                        <div className="activity-meta">{srv.date}</div>
                      </div>
                      <div className="activity-right text-xs font-bold text-slate-700">{srv.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="cmd-chart-card">
                <div className="cmd-chart-title mb-4 flex items-center gap-2"><ShieldAlert size={18} className="text-amber-500" /> Compliance & Documents</div>
                <div className="space-y-4">
                  {[
                    { label: "Registration (RC)", expiry: v.rc_expiry, status: "Valid" },
                    { label: "Insurance Policy", expiry: v.insurance_expiry, status: "Expiring Soon", warn: true },
                    { label: "Fitness Certificate", expiry: v.fitness_expiry, status: "Valid" },
                    { label: "National Permit", expiry: v.permit_expiry, status: "Valid" },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${doc.warn ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          <FileText size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.label}</div>
                          <div className="text-[11px] font-semibold text-slate-500">Exp: {doc.expiry ? new Date(doc.expiry).toLocaleDateString() : "31 Dec 2024"}</div>
                        </div>
                      </div>
                      <span className={`badge ${doc.warn ? 'badge-warning' : 'badge-completed'}`}>{doc.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
