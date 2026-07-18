"use client";

import { 
  Activity, Search, Filter, Server, Database, Cloud, AlertCircle, CheckCircle2, Clock, 
  ArrowUpRight, ArrowDownRight, Zap
} from "lucide-react";
import { useState } from "react";

const mockStatus = [
  { 
    id: 1, company: "Express Logistics", code: "EXP-001", server: "US-East (Active)", 
    dbSize: "45.2 GB", apiUsage: "1.2M / day", lastBackup: "10 mins ago", 
    health: "healthy", latency: "45ms", alerts: 0
  },
  { 
    id: 2, company: "City Transit Movers", code: "CTM-082", server: "US-West (Active)", 
    dbSize: "12.8 GB", apiUsage: "340K / day", lastBackup: "1 hour ago", 
    health: "healthy", latency: "62ms", alerts: 0
  },
  { 
    id: 3, company: "Apex Freight", code: "APX-993", server: "EU-Central (Suspended)", 
    dbSize: "3.4 GB", apiUsage: "0 / day", lastBackup: "2 weeks ago", 
    health: "offline", latency: "-", alerts: 2
  },
  { 
    id: 4, company: "Global Supply Co", code: "GSC-442", server: "US-East (Active)", 
    dbSize: "120.5 GB", apiUsage: "5.4M / day", lastBackup: "5 mins ago", 
    health: "warning", latency: "210ms", alerts: 3
  },
  { 
    id: 5, company: "Local Delivery Bros", code: "LDB-115", server: "US-East (Inactive)", 
    dbSize: "8.1 GB", apiUsage: "12K / day", lastBackup: "3 days ago", 
    health: "offline", latency: "-", alerts: 1
  },
];

export default function CompanyStatusPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");

  const filteredStatus = mockStatus.filter(s => {
    const matchesSearch = s.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHealth = healthFilter === "all" || s.health === healthFilter;
    return matchesSearch && matchesHealth;
  });

  const getHealthBadge = (health: string) => {
    if (health === 'healthy') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1"/> Healthy</span>;
    if (health === 'warning') return <span className="badge badge-warning"><AlertCircle size={12} className="mr-1"/> High Load</span>;
    return <span className="badge badge-danger"><Cloud size={12} className="mr-1"/> Offline</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">System & Company Status</h1>
          <p className="cmd-banner-sub">
            Monitor infrastructure health, database sizes, and API usage across all tenants.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm">
            <Activity size={16} /> Run Diagnostics
          </button>
        </div>
      </div>

      {/* ── Global Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 animate-fade-in stagger-1">
        <div className="stat-card">
          <div className="stat-card-title">Total Active Tenants</div>
          <div className="stat-card-value">1,248</div>
          <div className="stat-card-trend trend-up"><ArrowUpRight size={14}/> 12 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Global API Requests</div>
          <div className="stat-card-value">12.4M</div>
          <div className="stat-card-trend text-slate-500">Per day average</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Avg System Latency</div>
          <div className="stat-card-value">54ms</div>
          <div className="stat-card-trend trend-up"><ArrowUpRight size={14}/> 2ms from yesterday</div>
        </div>
        <div className="stat-card border-amber-200 bg-amber-50">
          <div className="stat-card-title text-amber-700">Active Alerts</div>
          <div className="stat-card-value text-amber-600">6</div>
          <div className="stat-card-trend text-amber-600 font-semibold">Requires attention</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-2">
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search company or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !pl-10 !h-10 text-sm"
          />
        </div>
        
        <div className="flex flex-nowrap items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5 shrink-0">
            <Filter size={14} /> Filters:
          </div>
          
          <select 
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="form-input !h-10 text-sm shrink-0 w-auto min-w-[150px]"
          >
            <option value="all">All Health Status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning / High Load</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-3">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company (Tenant)</th>
                <th>Infrastructure</th>
                <th>Storage & Usage</th>
                <th>Performance</th>
                <th>Last Backup</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStatus.map((s) => (
                <tr key={s.id} className="group">
                  
                  {/* Company */}
                  <td>
                    <div className="font-bold text-slate-900 text-sm">{s.company}</div>
                    <div className="text-[11px] font-bold text-slate-500 mt-0.5 tracking-wider bg-slate-100 inline-block px-1.5 py-0.5 rounded">{s.code}</div>
                  </td>
                  
                  {/* Infrastructure */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Server size={14} className="text-slate-400" />
                      <span className="font-semibold text-slate-700 text-sm">{s.server}</span>
                    </div>
                  </td>
                  
                  {/* Storage & Usage */}
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><Database size={12} className="text-slate-400"/> {s.dbSize}</div>
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><Zap size={12} className="text-slate-400"/> {s.apiUsage}</div>
                    </div>
                  </td>

                  {/* Performance */}
                  <td>
                    <div className="text-sm font-black text-slate-700">{s.latency}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Latency</div>
                  </td>

                  {/* Last Backup */}
                  <td>
                    <div className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      {s.lastBackup}
                    </div>
                  </td>
                  
                  {/* Health Status */}
                  <td>
                    <div className="flex flex-col items-start gap-1.5">
                      {getHealthBadge(s.health)}
                      {s.alerts > 0 && (
                        <div className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1">
                          <AlertCircle size={10} /> {s.alerts} active alerts
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {filteredStatus.length === 0 && (
            <div className="empty-state p-12">
              <Activity size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No infrastructure data found</h3>
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
