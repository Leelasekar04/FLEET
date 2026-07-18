"use client";

import { 
  Search, 
  Filter, 
  LayoutTemplate, 
  UserCheck,
  MoreVertical,
  Eye,
  CheckCircle2,
  Clock,
  Activity,
  User,
  MapPin,
  Calendar
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockActivities = [
  { id: "LOG-2099", user: "johndoe", name: "John Doe", company: "City Cabs Inc.", action: "Updated vehicle DL-01 registration", timestamp: "2026-07-15 14:32:11", ip: "192.168.1.45" },
  { id: "LOG-2098", user: "sarahsmith", name: "Sarah Smith", company: "Kumar Transport Co.", action: "Deleted trip TRP-5002", timestamp: "2026-07-15 11:10:05", ip: "10.0.0.12" },
  { id: "LOG-2097", user: "mike_manager", name: "Mike Manager", company: "Swift Delivery", action: "Generated monthly revenue report", timestamp: "2026-07-15 09:45:22", ip: "172.16.0.4" },
  { id: "LOG-2096", user: "alex_admin", name: "Alex Admin", company: "System", action: "Modified global permissions for Accountant role", timestamp: "2026-07-14 16:20:00", ip: "192.168.1.10" },
  { id: "LOG-2095", user: "johndoe", name: "John Doe", company: "City Cabs Inc.", action: "Logged in successfully", timestamp: "2026-07-14 08:00:12", ip: "192.168.1.45" },
];

export default function UserActivitiesPage() {
  const [activities, setActivities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  const filteredActivities = activities.filter(a => 
    a.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">User Activities</h1>
          <p className="cmd-banner-sub">
            Comprehensive audit trail of all individual user actions across the platform.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-[500px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by username, name, action, or company..." 
            className="form-input !pl-10 !h-10 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              className="form-input !pl-9 !h-10 w-full cursor-pointer text-sm font-medium text-slate-700"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Company context</th>
                <th>Action details</th>
                <th>IP Address</th>
                <th className="text-right">Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {log.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{log.name}</div>
                        <div className="text-[11px] font-semibold text-slate-500">@{log.user}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-700 text-sm">
                      {log.company}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-medium text-slate-700 max-w-sm truncate" title={log.action}>
                      {log.action}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded">
                      <MapPin size={12} /> {log.ip}
                    </div>
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
                          <Eye size={16} className="text-slate-400" /> View Raw JSON
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <User size={16} className="text-slate-400" /> View User Profile
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredActivities.length === 0 && (
            <div className="empty-state p-12 flex flex-col items-center">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No logs found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
