"use client";

import { Search, FileSpreadsheet, Filter, LayoutTemplate, Droplet, Fuel, Calendar } from "lucide-react";
import { useState } from "react";

const mockFuelLogs = [
  { id: "FL-501", vehicle: "KA-01-HD-1234", company: "Logistics Pro", quantity: "45 L", cost: "$55.00", station: "Shell Bangalore", date: "2026-07-15", status: "verified" },
  { id: "FL-502", vehicle: "MH-12-AB-9876", company: "Swift Movers", quantity: "60 L", cost: "$73.50", station: "BPCL Pune", date: "2026-07-14", status: "flagged" },
  { id: "FL-503", vehicle: "DL-04-CD-5678", company: "Urban Delivery", quantity: "30 L", cost: "$36.80", station: "IOCL Delhi", date: "2026-07-15", status: "verified" },
  { id: "FL-504", vehicle: "TN-09-EF-3456", company: "TransCorp", quantity: "100 L", cost: "$122.00", station: "HP Chennai", date: "2026-07-13", status: "pending" },
  { id: "FL-505", vehicle: "GJ-01-GH-7890", company: "Quick Ship", quantity: "25 L", cost: "$30.50", station: "Reliance Surat", date: "2026-07-12", status: "verified" },
];

export default function FuelAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");

  const filteredFuelLogs = mockFuelLogs.filter(f => {
    const matchesSearch = f.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'verified') return <span className="badge badge-completed">Verified</span>;
    if (status === 'pending') return <span className="badge badge-warning">Pending</span>;
    if (status === 'flagged') return <span className="badge badge-error">Flagged</span>;
    return <span className="badge">{status}</span>;
  };

  const handleExport = () => {
    setToastMessage("Exporting fuel data to Excel...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Fuel Analytics</h1>
          <p className="cmd-banner-sub">
            Track fuel consumption, costs, and fill-up verifications across fleets.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search vehicle or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !pl-10 !h-10 text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
            <Filter size={14} /> Filters:
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-auto min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID & Vehicle</th>
                <th>Fuel Details</th>
                <th>Tenant Company</th>
                <th>Date & Station</th>
                <th className="text-right">Verification</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuelLogs.map((log) => (
                <tr key={log.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Droplet size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-wide">{log.id}</div>
                        <div className="text-[11px] font-bold text-slate-500 mt-0.5 tracking-wider bg-slate-100 inline-block px-1.5 py-0.5 rounded">{log.vehicle}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-black text-slate-700 text-sm">{log.quantity}</div>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5">{log.cost}</div>
                  </td>
                  <td>
                    <div className="font-bold text-blue-600 text-sm">{log.company}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm font-bold">
                      <Calendar size={14} className="text-slate-400" /> {log.date}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5 ml-5">{log.station}</div>
                  </td>
                  <td className="text-right">
                    {getStatusBadge(log.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFuelLogs.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No fuel logs found</h3>
              <p className="text-sm max-w-sm mx-auto">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Fuel size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
