"use client";

import { Search, FileSpreadsheet, Filter, LayoutTemplate, Clock, User, LogIn, AlertCircle } from "lucide-react";
import { useState } from "react";

const mockLoginHistory = [
  { id: 1, user: "Admin Master", role: "Super Admin", ip: "192.168.1.1", location: "New York, USA", time: "2026-07-15 14:30:00", status: "success", device: "Chrome / Windows" },
  { id: 2, user: "Support Lead", role: "Support Staff", ip: "10.0.0.45", location: "London, UK", time: "2026-07-15 12:15:00", status: "success", device: "Safari / macOS" },
  { id: 3, user: "Jane Smith", role: "System Auditor", ip: "172.16.0.8", location: "Toronto, Canada", time: "2026-07-14 09:45:00", status: "failed", device: "Firefox / Linux" },
  { id: 4, user: "Billing Manager", role: "Financial Admin", ip: "192.168.1.5", location: "New York, USA", time: "2026-07-13 16:20:00", status: "success", device: "Chrome / macOS" },
  { id: 5, user: "John Doe", role: "Support Staff", ip: "10.0.0.12", location: "Sydney, Australia", time: "2026-07-12 08:10:00", status: "failed", device: "Unknown / Unknown" },
];

export default function LoginHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");

  const filteredHistory = mockLoginHistory.filter(h => {
    const matchesSearch = h.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.ip.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="badge badge-active"><LogIn size={12} className="mr-1" /> Success</span>;
    if (status === 'failed') return <span className="badge badge-error"><AlertCircle size={12} className="mr-1" /> Failed</span>;
    return <span className="badge">{status}</span>;
  };

  const handleExport = () => {
    setToastMessage("Exporting login history data to Excel...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Login History</h1>
          <p className="cmd-banner-sub">
            Track user authentication events, IPs, and session details.
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
            placeholder="Search user or IP..."
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
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>User & Role</th>
                <th>IP & Location</th>
                <th>Device Details</th>
                <th>Timestamp</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((history) => (
                <tr key={history.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{history.user}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{history.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{history.ip}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">{history.location}</div>
                  </td>
                  <td>
                    <div className="text-sm font-medium text-slate-600">{history.device}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-700 text-sm font-bold">
                      <Clock size={14} className="text-slate-400" /> {new Date(history.time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </td>
                  <td className="text-right">
                    {getStatusBadge(history.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredHistory.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No history found</h3>
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
            <Clock size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
