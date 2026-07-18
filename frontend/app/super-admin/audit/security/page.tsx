"use client";

import { 
  Search, 
  Filter, 
  LayoutTemplate, 
  ShieldAlert,
  MoreVertical,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertOctagon,
  ShieldX,
  KeyRound,
  Ban
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockLogs = [
  { id: "SEC-9005", event: "Multiple Failed Login Attempts", user: "unknown", ip: "45.22.19.102", location: "Russia", severity: "critical", timestamp: "2026-07-15 15:45:11" },
  { id: "SEC-9004", event: "Password Reset Requested", user: "sarahsmith", ip: "10.0.0.12", location: "United States", severity: "low", timestamp: "2026-07-15 11:05:00" },
  { id: "SEC-9003", event: "New IP Login Detected", user: "mike_manager", ip: "192.168.1.100", location: "Canada", severity: "medium", timestamp: "2026-07-14 20:22:15" },
  { id: "SEC-9002", event: "API Key Compromised Warning", user: "system_bot", ip: "Internal", location: "Server", severity: "high", timestamp: "2026-07-14 16:30:00" },
  { id: "SEC-9001", event: "User Account Locked", user: "john_doe_99", ip: "172.16.2.55", location: "United Kingdom", severity: "high", timestamp: "2026-07-13 09:12:44" },
];

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.ip.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || l.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    if (severity === 'critical') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-100 text-red-700 uppercase flex items-center gap-1 w-fit"><AlertOctagon size={10} /> Critical</span>;
    if (severity === 'high') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-orange-100 text-orange-600 uppercase flex items-center gap-1 w-fit"><ShieldX size={10} /> High</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-100 text-amber-600 uppercase">Medium</span>;
    if (severity === 'low') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-100 text-slate-600 uppercase">Low</span>;
    return null;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Security Logs</h1>
          <p className="cmd-banner-sub">
            Monitor authentication events, suspicious activities, and system threats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="cmd-stat-card group hover:border-red-200 transition-colors">
          <div className="cmd-stat-icon bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <ShieldAlert size={20} />
          </div>
          <div className="cmd-stat-label">Critical Alerts (24h)</div>
          <div className="cmd-stat-value text-slate-900">{logs.filter(l => l.severity === 'critical').length}</div>
        </div>

        <div className="cmd-stat-card group hover:border-amber-200 transition-colors">
          <div className="cmd-stat-icon bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Ban size={20} />
          </div>
          <div className="cmd-stat-label">Failed Logins (24h)</div>
          <div className="cmd-stat-value text-slate-900">142</div>
        </div>

        <div className="cmd-stat-card group hover:border-blue-200 transition-colors">
          <div className="cmd-stat-icon bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <KeyRound size={20} />
          </div>
          <div className="cmd-stat-label">Password Resets</div>
          <div className="cmd-stat-value text-slate-900">18</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-2">
        <div className="relative w-full sm:w-[500px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by event, IP, or user..." 
            className="form-input !pl-10 !h-10 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              className="form-input !pl-9 !h-10 w-full cursor-pointer text-sm font-medium text-slate-700"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-3">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Security Event</th>
                <th>Target User</th>
                <th>Origin</th>
                <th>Severity</th>
                <th className="text-right">Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-bold text-slate-900 max-w-[300px] truncate" title={log.event}>
                      {log.event}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{log.id}</div>
                  </td>
                  <td>
                    <div className="font-medium text-slate-600 text-sm bg-slate-100 w-fit px-2 py-0.5 rounded">
                      @{log.user}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                        {log.ip}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <MapPin size={10} /> {log.location}
                      </div>
                    </div>
                  </td>
                  <td>
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === log.id ? null : log.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === log.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> View Log Details
                        </button>
                        {log.ip !== 'Internal' && (
                          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <Ban size={16} /> Block IP Address
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="empty-state p-12 flex flex-col items-center">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No events found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
