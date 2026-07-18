"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Loader2, ArrowRight } from "lucide-react";

export default function AccountantDashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accountant_token");
    if (!token) {
      router.push("/accountant/login");
      return;
    }
    fetchReports(token);
  }, [router]);

  const fetchReports = async (token: string) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_BASE}/api/portal/accountant/expenses/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      } else {
        if(res.status === 401 || res.status === 403) router.push("/accountant/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={32} />
      </div>
    );
  }

  return (
    <div className="cmd-root max-w-[1200px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Financial Overview</h1>
          <p className="cmd-banner-sub">
            Monitor approved expenses, pending approvals, and category breakdowns.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <Link href="/accountant/expenses" className="btn btn-primary btn-sm">
            Review All Expenses <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Approved</div>
            <div className="text-4xl font-black text-slate-900">₹{reports?.total_approved?.toLocaleString('en-IN') || 0}</div>
          </div>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
            <CheckCircle size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex items-center justify-between border-l-4 border-l-amber-400">
          <div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Approval</div>
            <div className="text-4xl font-black text-slate-900">₹{reports?.total_pending?.toLocaleString('en-IN') || 0}</div>
          </div>
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Clock size={32} />
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 p-8 animate-fade-in stagger-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8 pb-4 border-b border-slate-100">Approved Expenses by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {reports?.categories && Object.entries(reports.categories).map(([key, val]: any) => (
            <div key={key} className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{key}</div>
              <div className="text-2xl font-black text-slate-800">₹{val.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
