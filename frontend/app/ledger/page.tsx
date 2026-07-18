"use client";
import { useState } from "react";
import { useFleetStore } from "@/lib/store";
import { BookOpen, TrendingDown, TrendingUp, Download, FileText } from "lucide-react";

const fmt = {
  currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}`,
  dt: (d: string) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
};

// ─── Constants ─────────────────────────────────────────────

const txColor: Record<string, string> = {
  opening: "#00d4aa", credit: "#22c55e", topup: "#3b82f6",
  debit: "#ef4444", settlement: "#f59e0b",
};

const txIcon = (type: string) =>
  ["debit"].includes(type)
    ? <TrendingDown size={14} color={txColor[type]} />
    : <TrendingUp size={14} color={txColor[type]} />;

export default function LedgerPage() {
  const trips = useFleetStore(state => state.trips);
  const ledger = useFleetStore(state => state.ledger);
  
  // Try to default to the first available trip if "1" doesn't exist
  const [selectedTrip, setSelectedTrip] = useState(trips.length > 0 ? trips[0].id : "1");
  
  const entries = ledger.filter(e => e.trip_id === selectedTrip);
  const lastEntry = entries[entries.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ledger</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Full transaction history per trip</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm"><FileText size={14} /> Export PDF</button>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export Excel</button>
        </div>
      </div>

      {/* Trip Selector */}
      <div className="glass-card p-4">
        <label className="form-label mb-2">Select Trip</label>
        <div className="flex flex-wrap gap-2">
          {trips.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrip(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedTrip === t.id ? "bg-[#00d4aa] text-black" : "btn btn-secondary"
              }`}
            >
              <span className="font-mono">{t.code}</span>
              <span className="ml-2 opacity-70">{t.driver}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Bar */}
      {lastEntry && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Opening Batta",   value: fmt.currency(entries[0]?.amount || 0),    color: "#00d4aa" },
            { label: "Total Debited",   value: fmt.currency(entries.filter(e => e.type === "debit").reduce((s, e) => s + e.amount, 0)), color: "#ef4444" },
            { label: "Current Balance", value: fmt.currency(lastEntry.balance),           color: "#3b82f6" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className="text-xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[#6b7280]">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Ledger Timeline */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <BookOpen size={16} className="text-[#00d4aa]" />
          Transaction History
        </h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/8" />
          <div className="space-y-1">
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className="relative flex items-start gap-4 p-3 rounded-xl hover:bg-white/4 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Dot */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                  style={{
                    background: `${txColor[entry.type]}15`,
                    borderColor: `${txColor[entry.type]}30`,
                  }}
                >
                  {txIcon(entry.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{entry.desc}</span>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div
                        className="text-sm font-bold"
                        style={{ color: entry.type === "debit" ? "#ef4444" : "#00d4aa" }}
                      >
                        {entry.type === "debit" ? "−" : "+"}{fmt.currency(entry.amount)}
                      </div>
                      <div className="text-xs text-[#6b7280]">Bal: {fmt.currency(entry.balance)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="badge"
                      style={{
                        background: `${txColor[entry.type]}15`,
                        color: txColor[entry.type],
                        border: `1px solid ${txColor[entry.type]}30`,
                      }}
                    >
                      {entry.type}
                    </span>
                    <span className="text-xs text-[#4b5563]">{fmt.dt(entry.at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
