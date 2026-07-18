"use client";

import { 
  BarChart2, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  Filter,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useState } from "react";

const fmt = { 
  currency: (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
};

// Mock data for the chart
const chartData = [
  { month: 'Jan', revenue: 45000, expenses: 28000 },
  { month: 'Feb', revenue: 52000, expenses: 31000 },
  { month: 'Mar', revenue: 48000, expenses: 29000 },
  { month: 'Apr', revenue: 61000, expenses: 34000 },
  { month: 'May', revenue: 59000, expenses: 32000 },
  { month: 'Jun', revenue: 75000, expenses: 38000 },
];

const maxRevenue = Math.max(...chartData.map(d => Math.max(d.revenue, d.expenses)));

// Mock data for recent transactions
const recentTransactions = [
  { id: "INV-2026-001", client: "Metro Transit Authority", type: "Subscription", amount: 1490.00, status: "paid", date: "2026-07-15" },
  { id: "INV-2026-002", client: "Swift Delivery Co.", type: "One-time", amount: 350.00, status: "pending", date: "2026-07-14" },
  { id: "INV-2026-003", client: "Apex Logistics", type: "Subscription", amount: 2999.00, status: "paid", date: "2026-07-12" },
  { id: "INV-2026-004", client: "City Cabs Inc.", type: "Overage Fee", amount: 125.50, status: "overdue", date: "2026-07-10" },
  { id: "INV-2026-005", client: "Global Freight", type: "Subscription", amount: 1490.00, status: "paid", date: "2026-07-09" },
];

export default function RevenueReportsPage() {
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [toastMessage, setToastMessage] = useState("");

  const handleExport = () => {
    setToastMessage("Generating revenue report...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return <span className="badge badge-completed">Paid</span>;
    if (status === 'pending') return <span className="badge badge-warning">Pending</span>;
    if (status === 'overdue') return <span className="badge badge-error">Overdue</span>;
    return <span className="badge">{status}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Revenue Reports</h1>
          <p className="cmd-banner-sub">
            Analyze income streams, recurring revenue, and financial growth.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input !h-10 text-sm w-40 cursor-pointer font-medium"
          >
            <option>This Month</option>
            <option>Last Quarter</option>
            <option>Last 6 Months</option>
            <option>Year to Date</option>
          </select>
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="cmd-stat-card group hover:border-emerald-200 transition-colors">
          <div className="cmd-stat-icon bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <DollarSign size={20} />
          </div>
          <div className="cmd-stat-label">Total Revenue</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(340000)}</div>
          <div className="flex items-center gap-1.5 mt-2 text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
            <ArrowUpRight size={14} /> 12.5% vs last period
          </div>
        </div>

        <div className="cmd-stat-card group hover:border-blue-200 transition-colors">
          <div className="cmd-stat-icon bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <RefreshCw size={20} />
          </div>
          <div className="cmd-stat-label">Monthly Recurring (MRR)</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(85000)}</div>
          <div className="flex items-center gap-1.5 mt-2 text-sm font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-md">
            <ArrowUpRight size={14} /> 4.2% growth
          </div>
        </div>

        <div className="cmd-stat-card group hover:border-amber-200 transition-colors">
          <div className="cmd-stat-icon bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <AlertCircle size={20} />
          </div>
          <div className="cmd-stat-label">Outstanding Invoices</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(12450)}</div>
          <div className="flex items-center gap-1.5 mt-2 text-sm font-bold text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded-md">
            18 invoices pending
          </div>
        </div>
      </div>

      {/* ── Chart Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Revenue vs Expenses</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Financial overview for {dateRange.toLowerCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00d4aa]"></div>
              <span className="text-xs font-bold text-slate-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <span className="text-xs font-bold text-slate-600">Expenses</span>
            </div>
          </div>
        </div>
        
        {/* CSS Flex Chart */}
        <div className="relative h-64 flex items-end justify-between gap-2 px-2 mt-4 border-b border-slate-100 pb-2">
          {/* Y-axis grid lines (purely visual) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 z-0">
            {[4, 3, 2, 1, 0].map(i => (
              <div key={i} className="w-full border-t border-slate-100 border-dashed flex items-start h-0">
                <span className="text-[10px] font-bold text-slate-400 -mt-2 -ml-8 bg-[#f8fafc] pr-2">
                  {i === 0 ? '0' : `${(maxRevenue * (i/4) / 1000).toFixed(0)}k`}
                </span>
              </div>
            ))}
          </div>

          {chartData.map((data, idx) => (
            <div key={idx} className="relative flex-1 flex flex-col justify-end items-center group h-full z-10 pt-4">
              <div className="w-full flex justify-center items-end gap-1 sm:gap-2 h-full">
                {/* Expense Bar */}
                <div 
                  className="w-1/3 max-w-[32px] bg-slate-200 rounded-t-sm transition-all duration-500 relative"
                  style={{ height: `${(data.expenses / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    {fmt.currency(data.expenses)}
                  </div>
                </div>
                {/* Revenue Bar */}
                <div 
                  className="w-1/3 max-w-[32px] bg-[#00d4aa] rounded-t-sm transition-all duration-500 relative"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#00d4aa] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {fmt.currency(data.revenue)}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{data.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transactions Table ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-3">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 tracking-tight">Recent Revenue Streams</h2>
          <button className="text-sm font-bold text-[#00d4aa] hover:text-[#00b38f] transition-colors flex items-center gap-1">
            View All <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Client</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="font-bold text-slate-900 text-sm tracking-wide">{tx.id}</div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{tx.client}</div>
                  </td>
                  <td>
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 uppercase">
                      {tx.type}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                      <Calendar size={14} className="text-slate-400" /> {tx.date}
                    </div>
                  </td>
                  <td>
                    <div className="font-black text-slate-900 text-sm">{fmt.currency(tx.amount)}</div>
                  </td>
                  <td className="text-right">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <FileSpreadsheet size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
