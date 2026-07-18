"use client";
import { ArrowLeft, Route, MapPin, Clock, Calendar, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TripDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#f1f5f9]">
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <Link href="/trips" className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-600 transition-colors mb-3 font-medium">
          <ArrowLeft size={13} /> Back to Trips
        </Link>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <Route size={22} className="text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">{id}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  In Progress
                </span>
              </div>
              <p className="text-[12.5px] text-slate-500 mt-0.5">
                Chennai → Hyderabad · TN01AB1234 · Ramesh Kumar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
        {/* Placeholder Content */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Route size={28} className="text-blue-500" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-800 mb-2">Trip Details for {id}</h2>
          <p className="text-[13px] text-slate-500 max-w-sm">
            This is a placeholder page for the trip details. The full trip management interface, map tracking, and expense breakdown will be built here.
          </p>
        </div>
      </div>
    </div>
  );
}
