"use client";

import { Search, MoreVertical, FileSpreadsheet, Eye, Filter, LayoutTemplate, Send, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockExpiring = [
  { id: "exp_1", company: "Metro Transit Authority", users: 450, date: "2026-07-20", risk: "high", owner: "Sarah Jenkins" },
  { id: "exp_2", company: "Swift Delivery Co.", users: 120, date: "2026-07-22", risk: "moderate", owner: "Mike Chen" },
  { id: "exp_3", company: "Apex Logistics", users: 15, date: "2026-07-25", risk: "high", owner: "David Ross" },
  { id: "exp_4", company: "City Cabs Inc.", users: 300, date: "2026-08-01", risk: "low", owner: "Sarah Jenkins" },
];

export default function ExpiryTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredExpiring = mockExpiring.filter(e => {
    const matchesSearch = e.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.risk === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getRiskBadge = (risk: string) => {
    if (risk === 'high') return <span className="badge badge-error"><ShieldAlert size={12} className="mr-1" /> High Risk</span>;
    if (risk === 'moderate') return <span className="badge badge-warning"><Clock size={12} className="mr-1" /> Moderate Risk</span>;
    if (risk === 'low') return <span className="badge badge-completed"><ShieldAlert size={12} className="mr-1" /> Low Risk</span>;
    return <span className="badge">{risk}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Expiry Tracking</h1>
          <p className="cmd-banner-sub">
            Monitor and manage at-risk subscriptions nearing expiration.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm">
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
            placeholder="Search company..."
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
            <option value="all">All Risks</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Users</th>
                <th>Expiration Date</th>
                <th>Risk Level</th>
                <th>Account Owner</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpiring.map((item) => {
                const daysAway = Math.ceil((new Date(item.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                
                return (
                  <tr key={item.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black shadow-sm">
                          {item.company.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.company}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-700 text-sm">{item.users}</div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-700 text-sm">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className={`text-xs font-bold mt-0.5 tracking-wider ${
                        daysAway <= 7 ? 'text-red-500' : 
                        daysAway <= 14 ? 'text-orange-500' : 'text-slate-400'
                      }`}>
                        {daysAway} days away
                      </div>
                    </td>
                    <td>
                      {getRiskBadge(item.risk)}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 shadow-sm">
                          {item.owner.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-600">{item.owner}</span>
                      </div>
                    </td>
                    <td className="text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeDropdown === item.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                        >
                          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Eye size={16} className="text-slate-400" /> View Company
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Send size={16} className="text-blue-500" /> Send Reminder
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                            <ArrowRight size={16} /> View Playbook
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredExpiring.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No expirations found</h3>
              <p className="text-sm max-w-sm mx-auto">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
