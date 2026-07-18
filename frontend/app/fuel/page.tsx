"use client";
import { useState, useEffect } from "react";
import { FuelEntry } from "@/lib/store";
import { api } from "@/lib/api";
import { Fuel, Plus, TrendingUp, TrendingDown, BarChart2, Droplets } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

const fmt = { currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}` };

// ─── Constants ─────────────────────────────────────────────

const mileageData = [
  { date: "Jun 30", avg: 8.2 }, { date: "Jul 1", avg: 8.5 }, { date: "Jul 2", avg: 8.3 },
  { date: "Jul 3", avg: 8.6 }, { date: "Jul 4", avg: 8.4 }, { date: "Jul 5", avg: 8.7 },
  { date: "Jul 6", avg: 8.3 }, { date: "Jul 7", avg: 8.5 },
];

const fuelByVehicle = [
  { vehicle: "TN01AB",  liters: 260.5, amount: 22727 },
  { vehicle: "TN02CD",  liters: 150.0, amount: 13020 },
  { vehicle: "TN03EF",  liters: 100.0, amount: 8710  },
  { vehicle: "DL01GH",  liters: 180.0, amount: 15570 },
  { vehicle: "KA02IJ",  liters: 90.0,  amount: 7920  },
];

const TOOLTIP = {
  contentStyle: { background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 },
  labelStyle: { color: "#9ca3af" },
};

export default function FuelPage() {
  const [fuelEntries, setFuelEntries] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ station: "", liters: "", rate: "", odometer: "", trip: "" });
  const [loading, setLoading] = useState(true);

  const fetchFuel = async () => {
    try {
      const res = await api.getExpenses();
      const allExpenses = res.expenses || res || [];
      // Filter expenses for type Fuel and format them
      const fuels = allExpenses
        .filter((e: any) => e.expense_type === "Fuel")
        .map((e: any) => ({
          id: e.id,
          date: new Date(e.created_at || e.expense_date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          driver: e.trips?.drivers?.name || "Unknown",
          vehicle: e.trips?.drivers?.vehicle_no || "Unknown",
          trip: e.trips?.trip_code || null,
          station: e.description || "Station",
          amount: parseFloat(e.amount) || 0,
          liters: Math.round((parseFloat(e.amount) || 0) / 95), // mock
          rate: 95, // mock rate
          mileage: 8.5
        }));
      setFuelEntries(fuels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuel();
  }, []);

  const totalLiters = fuelEntries.reduce((s, f) => s + f.liters, 0);
  const totalAmount = fuelEntries.reduce((s, f) => s + f.amount, 0);
  const avgMileage = fuelEntries.length ? fuelEntries.reduce((s, f) => s + f.mileage, 0) / fuelEntries.length : 8.5;

  const handleLogFuel = async () => {
    if (!form.station || !form.liters || !form.rate) return;
    const liters = parseFloat(form.liters) || 0;
    const rate = parseFloat(form.rate) || 0;
    const amount = liters * rate;
    
    try {
      await api.createExpense({
        expense_type: "Fuel",
        amount: amount,
        description: form.station,
        status: "Approved",
        expense_date: new Date().toISOString()
      });
      fetchFuel();
    } catch (err) {
      console.error(err);
    }

    setForm({ station: "", liters: "", rate: "", odometer: "", trip: "" });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fuel Management</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Track fuel consumption, mileage & cost analytics</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Log Fuel Entry
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Liters",   value: `${totalLiters.toFixed(0)}L`, color: "#f59e0b" },
          { label: "Total Spend",    value: fmt.currency(totalAmount),     color: "#ef4444" },
          { label: "Avg Mileage",    value: `${avgMileage.toFixed(1)} km/L`, color: "#00d4aa" },
          { label: "Cost per KM",    value: `₹${(totalAmount / (totalLiters * avgMileage)).toFixed(2)}`, color: "#3b82f6" },
        ].map((s, i) => (
          <div key={i} className="kpi-card" style={{ "--card-accent": s.color } as React.CSSProperties}>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#9ca3af]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-1 text-sm">Fleet Mileage Trend</h3>
          <p className="text-xs text-[#6b7280] mb-4">Average km/L per day</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={mileageData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[7.5, 9.5]} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip {...TOOLTIP} formatter={(v: any) => [`${v} km/L`, "Mileage"]} />
              <Line type="monotone" dataKey="avg" stroke="#00d4aa" strokeWidth={2}
                dot={{ fill: "#00d4aa", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-1 text-sm">Fuel by Vehicle</h3>
          <p className="text-xs text-[#6b7280] mb-4">Liters consumed this week</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={fuelByVehicle} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="vehicle" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip {...TOOLTIP} formatter={(v: any) => [`${v}L`, "Liters"]} />
              <Bar dataKey="liters" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fuel Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/8 flex items-center justify-between">
          <span className="font-semibold text-white text-sm">Fuel Log</span>
          <span className="text-sm text-[#6b7280]">{fuelEntries.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr>
              <th>Date</th><th>Driver / Vehicle</th><th>Station</th>
              <th>Quantity</th><th>Rate</th><th>Amount</th><th>Mileage</th>
            </tr></thead>
            <tbody>
              {fuelEntries.map((f, i) => (
                <tr key={f.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td><span className="text-xs">{f.date}</span></td>
                  <td>
                    <div className="text-sm font-medium text-white">{f.driver}</div>
                    <div className="text-xs font-mono text-[#00d4aa]">{f.vehicle}</div>
                  </td>
                  <td><span className="text-sm">{f.station}</span></td>
                  <td>
                    <div className="flex items-center gap-1 text-sm font-semibold text-[#f59e0b]">
                      <Droplets size={12} />{f.liters}L
                    </div>
                  </td>
                  <td><span className="text-sm">₹{f.rate}/L</span></td>
                  <td><span className="text-sm font-bold text-white">{fmt.currency(f.amount)}</span></td>
                  <td>
                    <div className="flex items-center gap-1 text-sm">
                      {f.mileage >= 8.5
                        ? <TrendingUp size={12} color="#00d4aa" />
                        : <TrendingDown size={12} color="#f59e0b" />}
                      <span className={f.mileage >= 8.5 ? "text-[#00d4aa]" : "text-[#fbbf24]"}>
                        {f.mileage} km/L
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Screen Add Fuel Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm shrink-0" style={{ padding: '0 24px' }}>
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <Fuel className="text-[#2563eb]" /> Log Fuel Entry
            </h2>
            <button className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none" onClick={() => setShowModal(false)}>×</button>
          </div>
          
          {/* Content Centered */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center" style={{ padding: '24px' }}>
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ maxWidth: '800px', padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                  { label: "Trip Code (Optional)", placeholder: "e.g. TRIP-8821", colSpan: true, key: "trip" },
                  { label: "Fuel Station", placeholder: "e.g. HP Petrol Pump", colSpan: true, key: "station" },
                  { label: "Quantity (Liters)", placeholder: "120.5", key: "liters" },
                  { label: "Rate (₹/L)", placeholder: "87.30", key: "rate" },
                  { label: "Odometer Reading", placeholder: "142850", colSpan: true, key: "odometer" },
                ].map(f => (
                  <div key={f.key} style={f.colSpan ? { gridColumn: '1 / -1' } : {}}>
                    <label className="block text-sm font-semibold text-[#334155] mb-1.5">{f.label}</label>
                    <input className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 border-t border-gray-100" style={{ marginTop: '32px', paddingTop: '24px' }}>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#475569] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all" onClick={handleLogFuel}>Save Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
