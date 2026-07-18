"use client";
import { useState } from "react";
import { Wallet, Plus, CheckCircle, Clock, TrendingDown, TrendingUp, ChevronRight, User } from "lucide-react";

const fmt = { currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}` };

const mockSettlements = [
  {
    trip: "TRIP-8821", driver: "Ramesh Kumar", status: "active",
    opening: 20000, expenses: 7500, topups: 5000, closing: 17500,
    driver_payable: 0, driver_receivable: 17500,
    breakdown: [
      { type: "General Advance", amount: 10000, txType: "credit" },
      { type: "Fuel Advance",    amount: 5000,  txType: "credit" },
      { type: "Toll Advance",    amount: 2000,  txType: "credit" },
      { type: "Food Advance",    amount: 3000,  txType: "credit" },
      { type: "Top-up",          amount: 5000,  txType: "credit" },
      { type: "Expenses Deducted", amount: -7500, txType: "debit" },
    ],
  },
  {
    trip: "TRIP-8820", driver: "Suresh Babu", status: "active",
    opening: 18000, expenses: 9800, topups: 0, closing: 8200,
    driver_payable: 0, driver_receivable: 8200,
    breakdown: [
      { type: "Opening Batta",    amount: 18000, txType: "credit" },
      { type: "Expenses Deducted",amount: -9800, txType: "debit" },
    ],
  },
  {
    trip: "TRIP-8817", driver: "Karthik M", status: "completed",
    opening: 22000, expenses: 24500, topups: 5000, closing: 2500,
    driver_payable: 2500, driver_receivable: 0,  // Driver owes ₹2500 back (over-spent)
    // Wait — that can't happen if we deduct. Let's say driver_payable means company owes driver
    // Actually this represents final settlement amount
    breakdown: [
      { type: "Opening Batta",    amount: 22000, txType: "credit" },
      { type: "Top-up",           amount: 5000,  txType: "credit" },
      { type: "Expenses Deducted",amount: -24500, txType: "debit" },
    ],
  },
];

export default function BattaPage() {
  const [settlements, setSettlements] = useState(mockSettlements);
  const [selected, setSelected] = useState(0);
  const [settleModal, setSettleModal] = useState(false);
  const [allocateModal, setAllocateModal] = useState(false);
  const [allocateForm, setAllocateForm] = useState({ tripId: mockSettlements[0].trip, type: "General Advance", amount: "" });

  const trip = settlements[selected] || settlements[0];

  const totalOutstanding = settlements
    .filter(t => t.status === "active")
    .reduce((s, t) => s + t.closing, 0);

  const handleAllocate = () => {
    if (!allocateForm.amount) return;
    const amount = parseInt(allocateForm.amount) || 0;
    
    setSettlements(prev => prev.map(s => {
      if (s.trip === allocateForm.tripId) {
        return {
          ...s,
          closing: s.closing + amount,
          driver_receivable: s.driver_receivable + amount,
          breakdown: [
            ...s.breakdown,
            { type: allocateForm.type, amount, txType: "credit" }
          ]
        };
      }
      return s;
    }));
    
    setAllocateModal(false);
    setAllocateForm({ tripId: settlements[0]?.trip || "", type: "General Advance", amount: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Batta Management</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Advance allocation, deductions & driver settlement</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAllocateModal(true)}><Plus size={16} /> Allocate Batta</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Outstanding",    value: fmt.currency(totalOutstanding), color: "#00d4aa", icon: Wallet },
          { label: "Pending Settlements",  value: "3 trips",                       color: "#f59e0b", icon: Clock },
          { label: "Settled This Month",   value: fmt.currency(285000),            color: "#3b82f6", icon: CheckCircle },
        ].map((s, i) => (
          <div key={i} className="kpi-card" style={{ "--card-accent": s.color } as React.CSSProperties}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <s.icon size={16} color={s.color} />
              </div>
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-[#9ca3af] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trip Selector */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#9ca3af] px-1">Trips</h3>
          {settlements.map((t, i) => (
            <button key={t.trip} onClick={() => setSelected(i)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selected === i ? "border-[#00d4aa]/40 bg-[#00d4aa]/8" : "border-white/8 bg-white/4 hover:border-white/20"
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-[#00d4aa] font-semibold">{t.trip}</span>
                <span className={`badge ${t.status === "active" ? "badge-active" : "badge-completed"}`}>{t.status}</span>
              </div>
              <div className="text-sm font-medium text-white">{t.driver}</div>
              <div className="text-xs text-[#6b7280] mt-0.5">Balance: {fmt.currency(t.closing)}</div>
            </button>
          ))}
        </div>

        {/* Ledger Detail */}
        <div className="col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-lg font-bold text-white">{trip.driver}</div>
              <div className="text-xs font-mono text-[#00d4aa]">{trip.trip}</div>
            </div>
            {trip.status === "active" && (
              <button className="btn btn-primary btn-sm" onClick={() => setSettleModal(true)}>
                Settle Trip
              </button>
            )}
          </div>

          {/* Batta Flow */}
          <div className="space-y-2 mb-5">
            {trip.breakdown.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/6">
                <div className="flex items-center gap-2">
                  {b.txType === "credit"
                    ? <TrendingUp size={13} color="#00d4aa" />
                    : <TrendingDown size={13} color="#ef4444" />}
                  <span className="text-sm text-[#9ca3af]">{b.type}</span>
                </div>
                <span className={`text-sm font-semibold ${b.amount > 0 ? "text-[#00d4aa]" : "text-[#f87171]"}`}>
                  {b.amount > 0 ? "+" : ""}{fmt.currency(Math.abs(b.amount))}
                </span>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-white/4 border border-white/8">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-[#6b7280] mb-0.5">Opening Batta</div>
                <div className="text-base font-bold text-white">{fmt.currency(trip.opening)}</div>
              </div>
              <div>
                <div className="text-xs text-[#6b7280] mb-0.5">Total Expenses</div>
                <div className="text-base font-bold text-[#ef4444]">{fmt.currency(trip.expenses)}</div>
              </div>
              <div>
                <div className="text-xs text-[#6b7280] mb-0.5">Closing Balance</div>
                <div className="text-base font-bold text-[#00d4aa]">{fmt.currency(trip.closing)}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
              <span className="text-sm text-[#9ca3af]">
                {trip.driver_receivable > 0 ? "Amount to Collect from Driver" : "Amount Payable to Driver"}
              </span>
              <span className={`text-lg font-bold ${trip.driver_receivable > 0 ? "text-[#00d4aa]" : "text-[#f59e0b]"}`}>
                {fmt.currency(trip.driver_receivable || trip.driver_payable)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Allocate Batta Modal */}
      {allocateModal && (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col overflow-hidden">
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm shrink-0" style={{ padding: '0 24px' }}>
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <Wallet className="text-[#2563eb]" /> Allocate Batta
            </h2>
            <button className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none" onClick={() => setAllocateModal(false)}>×</button>
          </div>
          
          <div className="flex-1 overflow-y-auto flex items-center justify-center" style={{ padding: '24px' }}>
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ maxWidth: '800px', padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Trip</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all" value={allocateForm.tripId} onChange={(e) => setAllocateForm({ ...allocateForm, tripId: e.target.value })}>
                    {settlements.map(t => (
                      <option key={t.trip} value={t.trip}>{t.trip} ({t.driver})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Advance Type</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all" value={allocateForm.type} onChange={(e) => setAllocateForm({ ...allocateForm, type: e.target.value })}>
                    <option>General Advance</option>
                    <option>Fuel Advance</option>
                    <option>Toll Advance</option>
                    <option>Food Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Amount (₹)</label>
                  <input type="number" className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all" placeholder="e.g. 5000" value={allocateForm.amount} onChange={(e) => setAllocateForm({ ...allocateForm, amount: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4 border-t border-gray-100" style={{ marginTop: '32px', paddingTop: '24px' }}>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#475569] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors" onClick={() => setAllocateModal(false)}>Cancel</button>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all" onClick={handleAllocate}>Allocate</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Settle Modal */}
      {settleModal && (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col overflow-hidden">
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm shrink-0" style={{ padding: '0 24px' }}>
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <CheckCircle className="text-[#2563eb]" /> Final Settlement
            </h2>
            <button className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none" onClick={() => setSettleModal(false)}>×</button>
          </div>
          
          <div className="flex-1 overflow-y-auto flex items-center justify-center" style={{ padding: '24px' }}>
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ maxWidth: '600px', padding: '32px' }}>
              <div className="space-y-4 mb-6">
                {[
                  ["Driver", trip.driver],
                  ["Trip", trip.trip],
                  ["Closing Balance", fmt.currency(trip.closing)],
                  ["Settlement Amount", fmt.currency(trip.driver_receivable)],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-[#475569] font-medium">{l}</span>
                    <span className="text-sm font-bold text-[#0f172a]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 border-t border-gray-100" style={{ paddingTop: '24px' }}>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#475569] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors" onClick={() => setSettleModal(false)}>Cancel</button>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all" onClick={() => setSettleModal(false)}>Confirm Settlement</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
