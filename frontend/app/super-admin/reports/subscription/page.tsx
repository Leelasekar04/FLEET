"use client";

import { FileText, Download, TrendingUp, RefreshCw, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { useState } from "react";

export default function SubscriptionReportsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Subscription Reports</h1>
          <p className="cmd-banner-sub">
            Track plan distributions, retention rates, and churn metrics.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={16} /> {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Subs</div>
              <div className="text-2xl font-black text-slate-900 mt-1">984</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ArrowUpCircle size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Upgrades (MTD)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">45</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <RefreshCw size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Renewals Due</div>
              <div className="text-2xl font-black text-slate-900 mt-1">112</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Churn Rate</div>
              <div className="text-2xl font-black text-slate-900 mt-1">2.1%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <FileText size={64} className="text-slate-200 mb-4" />
        <h3 className="text-xl font-black text-slate-900">Subscription Trends Generating</h3>
        <p className="text-slate-500 mt-2 max-w-md">
          Historical data charts for subscription tiers and upgrades are being processed for this quarter.
        </p>
      </div>
    </div>
  );
}
