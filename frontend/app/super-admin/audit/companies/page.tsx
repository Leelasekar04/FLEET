"use client";

import { 
  Search, 
  Filter, 
  LayoutTemplate, 
  Building,
  MoreVertical,
  Eye,
  CheckCircle2,
  Clock,
  Activity,
  Calendar,
  Building2,
  X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockActivities = [
  { id: "CLOG-4099", company: "City Cabs Inc.", action: "Subscription upgraded to Enterprise Custom", admin: "SuperAdmin System", timestamp: "2026-07-15 14:30:00", impact: "High" },
  { id: "CLOG-4098", company: "Kumar Transport Co.", action: "Onboarded 50 new drivers", admin: "System Integration", timestamp: "2026-07-14 09:15:22", impact: "Medium" },
  { id: "CLOG-4097", company: "Swift Delivery", action: "Tenant settings customized (Theme)", admin: "Sarah J. (Support)", timestamp: "2026-07-12 11:20:00", impact: "Low" },
  { id: "CLOG-4096", company: "Apex Freight", action: "API key regenerated", admin: "Mike T. (Support)", timestamp: "2026-07-10 16:45:11", impact: "High" },
];

export default function CompanyActivitiesPage() {
  const [activities, setActivities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
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
    a.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImpactBadge = (impact: string) => {
    if (impact === 'High') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-100 text-red-600 uppercase">High</span>;
    if (impact === 'Medium') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-100 text-amber-600 uppercase">Medium</span>;
    if (impact === 'Low') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-100 text-slate-600 uppercase">Low</span>;
    return null;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Company Activities</h1>
          <p className="cmd-banner-sub">
            Macro-level audit log of tenant configuration changes and major events.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-[500px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by company, action, or admin..." 
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
                <th>Company</th>
                <th>System Action</th>
                <th>Initiated By</th>
                <th>Impact</th>
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
                    <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                      <Building2 size={16} className="text-blue-500" />
                      {log.company}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-semibold text-slate-900 max-w-sm truncate" title={log.action}>
                      {log.action}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{log.id}</div>
                  </td>
                  <td>
                    <div className="font-medium text-slate-600 text-sm">
                      {log.admin}
                    </div>
                  </td>
                  <td>
                    {getImpactBadge(log.impact)}
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
                        <button 
                          onClick={() => { setSelectedLog(log); setActiveDropdown(null); }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Eye size={16} className="text-slate-400" /> View Details
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

      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Activity size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Activity Details</h2>
                  <div className="text-xs text-slate-500 font-medium">{selectedLog.id}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Company</label>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 size={16} className="text-slate-400" />
                  {selectedLog.company}
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Action</label>
                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedLog.action}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Initiated By</label>
                  <div className="text-sm font-semibold text-slate-700">{selectedLog.admin}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Timestamp</label>
                  <div className="text-sm font-semibold text-slate-700">{selectedLog.timestamp}</div>
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Impact Level</label>
                <div>{getImpactBadge(selectedLog.impact)}</div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
