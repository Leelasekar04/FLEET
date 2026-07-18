"use client";
import { useState } from "react";
import { useFleetStore } from "@/lib/store";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { Receipt, Search, Filter, MapPin, Clock, MessageSquare, Mic, Image as ImageIcon, Eye, X } from "lucide-react";

const fmt = {
  currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}`,
  datetime: (d: string) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
};

const expenseTypes = ["All", "Batta Top-up", "Diesel", "Tyre Repair", "Toll", "Food", "Maintenance", "Loading", "Parking", "Police", "Miscellaneous"];

// ─── Helpers ───────────────────────────────────────────────

const ViaIcon = ({ via }: { via: string }) => {
  if (via === "image")  return <ImageIcon size={12} />;
  if (via === "audio")  return <Mic size={12} />;
  return <MessageSquare size={12} />;
};

const viaColor: Record<string, string> = { text: "#3b82f6", audio: "#8b5cf6", image: "#00d4aa" };
const typeColors: Record<string, string> = {
  "Batta Top-up": "#14b8a6", Diesel: "#00d4aa", Petrol: "#10b981", "Tyre Repair": "#3b82f6", Toll: "#f59e0b",
  Food: "#8b5cf6", Maintenance: "#f97316", Loading: "#ec4899", Parking: "#06b6d4", Police: "#ef4444", Miscellaneous: "#6b7280",
};

export default function ExpensesPage() {
  const expenses = useFleetStore(state => state.expenses);
  const setExpenses = useFleetStore(state => state.setExpenses);
  
  useEffect(() => {
    api.getExpenses().then(res => {
      if (res && res.expenses) {
        const backendMapped = res.expenses.map((exp: any) => ({
          id: exp.id,
          driver: exp.trips?.drivers?.name || "Driver",
          trip: exp.trips?.trip_code || exp.trip_id || "N/A",
          type: exp.expense_type,
          amount: parseFloat(exp.amount),
          location: "Unknown",
          via: exp.receipt_url ? "image" : "text",
          confidence: 1.0,
          created_at: exp.created_at,
          notes: exp.description || ""
        }));
        
        const currentExpenses = useFleetStore.getState().expenses;
        const existingIds = new Set(currentExpenses.map(p => p.id));
        const newExpenses = backendMapped.filter((b: any) => !existingIds.has(b.id));
        
        if (newExpenses.length > 0) {
          setExpenses([...newExpenses, ...currentExpenses]);
        }
      }
    }).catch(console.error);
  }, [setExpenses]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);

  const filtered = expenses.filter((e) => {
    const matchSearch = e.driver.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) || e.trip.includes(search);
    const matchType = typeFilter === "All" || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{filtered.length} entries · {fmt.currency(total)} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
            <input className="form-input pl-9 py-2 text-sm" placeholder="Search driver, trip, location..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-[#6b7280]" />
            {expenseTypes.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === t ? "bg-[#00d4aa] text-black" : "btn btn-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-bold text-black">{filtered.length} Expenses</span>
          <span className="text-sm font-bold text-slate-900">{fmt.currency(total)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver / Trip</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Source</th>
                <th>Confidence</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td>
                    <div className="text-sm font-bold text-slate-900">{e.driver}</div>
                    <div className="text-xs font-mono text-emerald-600">{e.trip}</div>
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: typeColors[e.type] || "#6b7280" }} />
                      <span className="text-sm text-[#9ca3af]">{e.type}</span>
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-bold text-slate-900">{fmt.currency(e.amount)}</span>
                  </td>
                  <td>
                    {e.location && (
                      <span className="flex items-center gap-1 text-sm text-[#9ca3af]">
                        <MapPin size={11} className="text-[#6b7280]" />{e.location}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className="badge flex items-center gap-1"
                      style={{
                        background: `${(viaColor as any)[e.via]}20`,
                        color: (viaColor as any)[e.via],
                        border: `1px solid ${(viaColor as any)[e.via]}40`,
                      }}
                    >
                      <ViaIcon via={e.via} />
                      {e.via.charAt(0).toUpperCase() + e.via.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-[#00d4aa]"
                          style={{ width: `${(e.confidence || 0) * 100}%` }} />
                      </div>
                      <span className="text-xs text-[#6b7280]">{Math.round((e.confidence || 0) * 100)}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                      <Clock size={10} />{fmt.datetime(e.created_at)}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedExpense(e)}>
                      <Eye size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-[#6b7280]">No expenses found</div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedExpense(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                <Receipt size={18} className="text-[#00d4aa]" /> Expense Details
              </h3>
              <button onClick={() => setSelectedExpense(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ["Driver", selectedExpense.driver],
                ["Trip", selectedExpense.trip],
                ["Type", selectedExpense.type],
                ["Amount", fmt.currency(selectedExpense.amount)],
                ["Location", selectedExpense.location || "—"],
                ["Submitted via", selectedExpense.via],
                ["AI Confidence", `${Math.round((selectedExpense.confidence || 0) * 100)}%`],
                ["Notes", selectedExpense.notes || "—"],
                ["Timestamp", fmt.datetime(selectedExpense.created_at)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-white/6">
                  <span className="text-sm text-[#6b7280]">{label}</span>
                  <span className="text-sm font-medium text-white text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
