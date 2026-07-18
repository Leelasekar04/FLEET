"use client";
import { 
  Truck, Route, MapPin, Navigation, Map, Timer, Fuel, CheckCircle2, AlertTriangle, 
  Wallet, FileText, Settings, CalendarDays, Key, Plus
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const stats = {
  totalTrips: 124,
  completedTrips: 118,
  pendingTrips: 6,
  fuelExpenses: 12450,
  docsUploaded: 12
};

const recentTrips = [
  { id: "TRP-2023-081", route: "Chennai -> Bangalore", vehicle: "TN 01 AB 1234", date: "24 Oct 2023", status: "completed" },
  { id: "TRP-2023-082", route: "Bangalore -> Hyderabad", vehicle: "TN 01 AB 1234", date: "26 Oct 2023", status: "completed" },
  { id: "TRP-2023-083", route: "Hyderabad -> Pune", vehicle: "TN 01 AB 1234", date: "28 Oct 2023", status: "completed" },
  { id: "TRP-2023-084", route: "Pune -> Mumbai", vehicle: "TN 01 AB 1234", date: "30 Oct 2023", status: "pending" },
];

const activities = [
  { id: 1, type: "trip", desc: "Started trip to Mumbai", time: "2 hours ago" },
  { id: 2, type: "fuel", desc: "Refueled 150L Diesel", time: "5 hours ago" },
  { id: 3, type: "doc", desc: "Uploaded Toll Receipt", time: "1 day ago" },
  { id: 4, type: "alert", desc: "Maintenance scheduled tomorrow", time: "2 days ago" }
];

function StatCard({ label, value, trend, icon: Icon, accent }: { label: string, value: string|number, trend: string, icon: any, accent: string }) {
  return (
    <div className="stat-card" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon" style={{ color: accent, background: `${accent}18` }}>
          <Icon size={15} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend">{trend}</div>
    </div>
  );
}

function QuickBtn({ label, href, icon: Icon, primary }: { label: string; href: string; icon: any; primary?: boolean }) {
  return (
    <Link href={href} className={`quick-btn ${primary ? "quick-btn-primary" : "quick-btn-secondary"}`}>
      <Icon size={13} />
      {label}
    </Link>
  );
}

export default function DriverDashboard() {
  const [profile, setProfile] = useState<{name: string} | null>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem("driver_profile");
      if (p) setProfile(JSON.parse(p));
    } catch (err) {}
  }, []);

  return (
    <div className="cmd-root">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Driver Dashboard</h1>
          <p className="cmd-banner-sub">
            Welcome back, {profile?.name || "Driver"}. Here is your trip and vehicle overview.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <QuickBtn label="Start Trip" href="/driver/trips" icon={Navigation} primary />
          <QuickBtn label="Fuel Entry" href="/driver/fuel" icon={Fuel} />
          <QuickBtn label="Report Issue" href="/driver/support" icon={AlertTriangle} />
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="cmd-grid animate-fade-in stagger-1">
        <StatCard label="TOTAL TRIPS" value={stats.totalTrips} trend="Lifetime trips" icon={Route} accent="#2563eb" />
        <StatCard label="COMPLETED" value={stats.completedTrips} trend="Successfully delivered" icon={CheckCircle2} accent="#10b981" />
        <StatCard label="PENDING" value={stats.pendingTrips} trend="Upcoming/Ongoing" icon={Timer} accent="#f59e0b" />
        <StatCard label="ASSIGNED VEHICLE" value="1" trend="Active truck" icon={Truck} accent="#8b5cf6" />
        <StatCard label="FUEL EXPENSES" value={`₹${stats.fuelExpenses}`} trend="This month" icon={Wallet} accent="#ef4444" />
        <StatCard label="DOCUMENTS" value={stats.docsUploaded} trend="Uploaded" icon={FileText} accent="#06b6d4" />
      </div>

      <div className="cmd-charts animate-fade-in stagger-2">
        {/* Left Column - 2/3 width */}
        <div className="cmd-chart-card lg-col-2">
          <div className="cmd-chart-header">
            <div className="cmd-chart-title">Recent Trips</div>
            <div className="cmd-chart-sub">Your latest trip history and statuses</div>
          </div>
          <table className="data-table mt-4">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Vehicle</th>
                <th>Route</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map(t => (
                <tr key={t.id}>
                  <td className="font-semibold text-slate-700">{t.id}</td>
                  <td>{t.vehicle}</td>
                  <td>{t.route}</td>
                  <td>{t.date}</td>
                  <td>
                    <span className={`badge ${t.status === 'completed' ? 'badge-active' : 'badge-warning'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="flex flex-col gap-4">
          <div className="cmd-chart-card h-full">
            <div className="cmd-chart-title mb-4">Assigned Vehicle</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                <Truck className="text-indigo-600" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">TN 01 AB 1234</h3>
                <p className="text-sm text-slate-500 font-medium">Volvo FH16 - Heavy Duty</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Registration</span>
                <span className="font-semibold text-slate-700">Valid till 2025</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Last Service</span>
                <span className="font-semibold text-slate-700">12 Oct 2023</span>
              </div>
            </div>
          </div>

          <div className="cmd-chart-card h-full">
            <div className="cmd-chart-title mb-4">Recent Activities</div>
            <div className="activity-list">
              {activities.map((e) => (
                <div key={e.id} className="activity-row">
                  <div className="activity-icon" style={{ background: "#2563eb18" }}>
                    {e.type === 'trip' && <Route size={13} color="#2563eb" />}
                    {e.type === 'fuel' && <Fuel size={13} color="#ef4444" />}
                    {e.type === 'doc' && <FileText size={13} color="#10b981" />}
                    {e.type === 'alert' && <AlertTriangle size={13} color="#f59e0b" />}
                  </div>
                  <div className="activity-body">
                    <div className="activity-driver">{e.desc}</div>
                  </div>
                  <div className="activity-right">
                    <div className="activity-amount text-[11px] text-slate-400">{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
