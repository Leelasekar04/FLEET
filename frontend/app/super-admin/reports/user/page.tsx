"use client";

import { Users, Download, UserCheck, UserPlus, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function UserReportsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">User Reports</h1>
          <p className="cmd-banner-sub">
            Monitor user activity, roles distribution, and authentication metrics.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={16} /> {isExporting ? "Exporting..." : "Export Data"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Users</div>
              <div className="text-2xl font-black text-slate-900 mt-1">45,200</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <UserCheck size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Today</div>
              <div className="text-2xl font-black text-slate-900 mt-1">12,840</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">New This Week</div>
              <div className="text-2xl font-black text-slate-900 mt-1">+854</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Failed Logins</div>
              <div className="text-2xl font-black text-slate-900 mt-1">23</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <Users size={64} className="text-slate-200 mb-4" />
        <h3 className="text-xl font-black text-slate-900">User Demographics Processing</h3>
        <p className="text-slate-500 mt-2 max-w-md">
          Role distribution and active usage patterns are currently being processed and will appear here shortly.
        </p>
      </div>
    </div>
  );
}
