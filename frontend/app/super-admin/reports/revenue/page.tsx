"use client";

import { BarChart3, Download, DollarSign, TrendingUp, CreditCard, Receipt } from "lucide-react";
import { useState } from "react";

export default function RevenueReportsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Revenue Reports</h1>
          <p className="cmd-banner-sub">
            Comprehensive breakdown of MRR, total earnings, and payment history.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={16} /> {isExporting ? "Exporting..." : "Download Report"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total MRR</div>
              <div className="text-2xl font-black text-slate-900 mt-1">$45,250</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">YTD Revenue</div>
              <div className="text-2xl font-black text-slate-900 mt-1">$315,800</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Payouts</div>
              <div className="text-2xl font-black text-slate-900 mt-1">$2,450</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Receipt size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tax Collected</div>
              <div className="text-2xl font-black text-slate-900 mt-1">$12,890</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <BarChart3 size={64} className="text-slate-200 mb-4" />
        <h3 className="text-xl font-black text-slate-900">Revenue Charts Rendering</h3>
        <p className="text-slate-500 mt-2 max-w-md">
          Connecting to the financial data warehouse to generate your real-time revenue breakdowns.
        </p>
      </div>
    </div>
  );
}
