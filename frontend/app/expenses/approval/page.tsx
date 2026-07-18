"use client";
import { useState } from "react";
import {
  CheckCircle, XCircle, Clock, Receipt, MessageSquare, Mic, Image as Img,
  MapPin, Eye, Filter, AlertTriangle,
} from "lucide-react";

const fmt = {
  currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}`,
  dt: (d: string) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
};

type ApprovalStatus = "pending" | "approved" | "rejected";

const mockPending = [
  { id: "1", driver: "Ramesh Kumar", trip: "TRIP-8821", type: "Diesel",     amount: 3500, location: "Chennai",    via: "image", confidence: 0.92, at: "2026-07-07T12:32:00Z", notes: "HP Petrol Pump receipt", duplicate: false },
  { id: "2", driver: "Suresh Babu",  trip: "TRIP-8820", type: "Tyre Repair", amount: 2400, location: "Pune",       via: "audio", confidence: 0.88, at: "2026-07-07T11:15:00Z", notes: "Roadside tyre puncture", duplicate: false },
  { id: "3", driver: "Muthu Raja",   trip: "TRIP-8819", type: "Diesel",     amount: 3500, location: "Chennai",    via: "image", confidence: 0.91, at: "2026-07-07T10:50:00Z", notes: "Shell pump receipt", duplicate: true, duplicate_of: "TRIP-8821" },
  { id: "4", driver: "Arjun Singh",  trip: "TRIP-8818", type: "Food",       amount: 850,  location: "Nagpur",    via: "text",  confidence: 0.97, at: "2026-07-07T10:05:00Z", notes: "Driver lunch", duplicate: false },
  { id: "5", driver: "Karthik M",    trip: "TRIP-8821", type: "Toll",       amount: 340,  location: "Surat",     via: "text",  confidence: 0.99, at: "2026-07-07T09:20:00Z", notes: "Highway toll", duplicate: false },
];

const viaIcon = (via: string) => {
  if (via === "image")  return <Img size={11} />;
  if (via === "audio")  return <Mic size={11} />;
  return <MessageSquare size={11} />;
};
const viaColor: Record<string, string> = { text: "#3b82f6", audio: "#8b5cf6", image: "#00d4aa" };
const typeColor: Record<string, string> = {
  Diesel: "#00d4aa", "Tyre Repair": "#3b82f6", Food: "#8b5cf6",
  Toll: "#f59e0b", Maintenance: "#f97316", Miscellaneous: "#6b7280",
};

export default function ExpenseApprovalPage() {
  const [filter, setFilter] = useState<ApprovalStatus>("pending");
  const [decisions, setDecisions] = useState<Record<string, ApprovalStatus>>({});
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailModal, setDetailModal] = useState<typeof mockPending[0] | null>(null);

  const decide = (id: string, status: ApprovalStatus) => {
    setDecisions(d => ({ ...d, [id]: status }));
  };

  const displayed = mockPending.filter(e => {
    const d = decisions[e.id];
    if (filter === "pending")  return !d;
    if (filter === "approved") return d === "approved";
    if (filter === "rejected") return d === "rejected";
    return true;
  });

  const pendingCount  = mockPending.filter(e => !decisions[e.id]).length;
  const approvedCount = Object.values(decisions).filter(v => v === "approved").length;
  const rejectedCount = Object.values(decisions).filter(v => v === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expense Approval</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Review and approve driver expense submissions</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#fbbf24] text-sm font-medium">
            <Clock size={14} /> {pendingCount} pending review
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {([
          { key: "pending",  label: "Pending",  count: pendingCount,  color: "#f59e0b" },
          { key: "approved", label: "Approved", count: approvedCount, color: "#00d4aa" },
          { key: "rejected", label: "Rejected", count: rejectedCount, color: "#ef4444" },
        ] as { key: ApprovalStatus; label: string; count: number; color: string }[]).map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              filter === t.key
                ? ""
                : "border-white/8 text-[#9ca3af] hover:border-white/20"
            }`}
            style={filter === t.key ? { background: `${t.color}15`, color: t.color, borderColor: `${t.color}30` } : {}}>
            {t.label}
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: `${t.color}25`, color: t.color }}>
              {t.count}
            </span>
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {pendingCount > 0 && (
            <>
              <button className="btn btn-secondary btn-sm text-[#00d4aa] border-[#00d4aa]/30"
                onClick={() => mockPending.forEach(e => !decisions[e.id] && decide(e.id, "approved"))}>
                <CheckCircle size={13} /> Approve All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expense Cards */}
      <div className="space-y-3">
        {displayed.length === 0 && (
          <div className="glass-card p-10 text-center text-[#6b7280]">
            <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No {filter} expenses</p>
          </div>
        )}

        {displayed.map((exp, i) => {
          const status = decisions[exp.id];
          return (
            <div key={exp.id}
              className={`glass-card p-4 animate-fade-in border transition-colors ${
                status === "approved" ? "border-[#00d4aa]/30 bg-[#00d4aa]/5" :
                status === "rejected" ? "border-[#ef4444]/30 bg-[#ef4444]/5" :
                exp.duplicate ? "border-[#f59e0b]/30" : ""
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Expense Type Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${typeColor[exp.type] || "#6b7280"}15` }}>
                  <Receipt size={17} color={typeColor[exp.type] || "#6b7280"} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-white">{exp.type}</span>
                    <span
                      className="badge flex items-center gap-1"
                      style={{ background: `${viaColor[exp.via]}20`, color: viaColor[exp.via], border: `1px solid ${viaColor[exp.via]}30` }}>
                      {viaIcon(exp.via)}{exp.via}
                    </span>
                    {exp.duplicate && (
                      <span className="badge" style={{ background: "#f59e0b15", color: "#fbbf24", border: "1px solid #f59e0b30" }}>
                        <AlertTriangle size={10} /> Possible Duplicate
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                    <span className="font-medium text-[#9ca3af]">{exp.driver}</span>
                    <span className="font-mono text-[#00d4aa]">{exp.trip}</span>
                    {exp.location && <span className="flex items-center gap-1"><MapPin size={10} />{exp.location}</span>}
                  </div>
                  <div className="text-xs text-[#4b5563] mt-0.5">{exp.notes} · {fmt.dt(exp.at)}</div>
                  {/* AI Confidence */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#00d4aa]" style={{ width: `${exp.confidence * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#6b7280]">AI {Math.round(exp.confidence * 100)}% confident</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-white">{fmt.currency(exp.amount)}</div>

                  {/* Action Buttons */}
                  {!status ? (
                    <div className="flex gap-2 mt-2">
                      <button className="btn btn-sm flex items-center gap-1 text-xs"
                        style={{ background: "#ef444415", color: "#f87171", border: "1px solid #ef444430" }}
                        onClick={() => { setRejectModal(exp.id); setRejectReason(""); }}>
                        <XCircle size={12} /> Reject
                      </button>
                      <button className="btn btn-sm flex items-center gap-1 text-xs"
                        style={{ background: "#00d4aa15", color: "#00d4aa", border: "1px solid #00d4aa30" }}
                        onClick={() => decide(exp.id, "approved")}>
                        <CheckCircle size={12} /> Approve
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className={`badge ${status === "approved" ? "badge-active" : ""}`}
                        style={status === "rejected" ? { background: "#ef444415", color: "#f87171", border: "1px solid #ef444430" } : {}}>
                        {status === "approved" ? "✓ Approved" : "✗ Rejected"}
                      </span>
                    </div>
                  )}
                </div>

                <button className="btn btn-secondary btn-sm ml-1 self-start" onClick={() => setDetailModal(exp)}>
                  <Eye size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-sm mx-4">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <XCircle size={16} color="#ef4444" /> Reject Expense
            </h3>
            <label className="form-label">Reason for rejection</label>
            <textarea className="form-input h-24 resize-none" placeholder="e.g. Duplicate entry, receipt unclear..."
              value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="flex gap-3 mt-4">
              <button className="btn btn-secondary flex-1" onClick={() => setRejectModal(null)}>Cancel</button>
              <button
                className="btn btn-danger flex-1"
                onClick={() => { decide(rejectModal, "rejected"); setRejectModal(null); }}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
