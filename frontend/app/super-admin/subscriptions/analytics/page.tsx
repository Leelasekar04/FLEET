"use client";

import { BarChart3, TrendingUp, DollarSign, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600" />
            Subscription Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">High-level insights into your MRR, Churn, and Growth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <DollarSign className="text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Monthly Recurring Revenue (MRR)</div>
            <div className="text-2xl font-black text-slate-900">₹1,24,500</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> +12.5% this month
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Users className="text-indigo-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Active Subscribers</div>
            <div className="text-2xl font-black text-slate-900">342</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> +24 new this month
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500">Churn Rate</div>
            <div className="text-2xl font-black text-slate-900">2.1%</div>
            <div className="text-xs font-bold text-rose-600 mt-1">
              -0.4% from last month
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
        <BarChart3 size={48} className="text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Detailed charts loading...</h3>
        <p className="text-sm text-slate-500">Connect to your analytics provider to see historical data.</p>
      </div>
    </div>
  );
}
