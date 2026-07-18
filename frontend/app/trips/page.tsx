"use client";
import { useState, useEffect } from "react";
import { useFleetStore, Trip } from "@/lib/store";
import { 
  Plus, 
  MapPin, 
  Wallet,
  CheckCircle,
  Truck,
  ArrowRight,
  Calendar,
  BarChart3,
  StopCircle,
  TrendingUp,
  XCircle,
  Route as RouteIcon,
  ChevronRight
} from "lucide-react";

const fmt = { currency: (n: number) => `₹${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` };

import { api } from "@/lib/api";

// ─────────────────────────────────────────────────────────
// TRIP CARD COMPONENT
// ─────────────────────────────────────────────────────────
function TripCard({ trip, onTopUp, onEndTrip }: { trip: Trip, onTopUp: () => void, onEndTrip: () => void }) {
  const remaining = trip.opening_batta - trip.spent;
  const pctUsed = Math.min(100, Math.max(0, (trip.spent / trip.opening_batta) * 100));
  const pctRemaining = 100 - pctUsed;
  
  let progressColor = "bg-red-500"; 
  if (pctRemaining >= 80) progressColor = "bg-emerald-500"; 
  else if (pctRemaining >= 50) progressColor = "bg-blue-500"; 
  else if (pctRemaining >= 25) progressColor = "bg-orange-500"; 

  const initials = trip.driver.split(" ").map(n => n[0]).join("");

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow overflow-hidden">
      
      {/* CARD BODY */}
      <div className="p-5 flex-1 flex flex-col gap-5">
        
        {/* HEADER: ID & Financials */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[18px] font-bold text-slate-900 tracking-tight truncate">{trip.code}</h3>
              {trip.status === "active" ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">ACTIVE</span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">COMPLETED</span>
              )}
            </div>
            
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[12px] font-bold text-slate-600 flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-slate-900 truncate">{trip.driver}</div>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mt-0.5">
                  <Truck size={12} className="flex-shrink-0" />
                  <span className="truncate">{trip.vehicle}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-end text-right">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2 flex flex-col items-end mb-2">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-0.5">Remaining Batta</div>
              <div className="text-[22px] font-bold text-emerald-700 leading-none">{fmt.currency(remaining)}</div>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              <div>Opening: <span className="text-slate-700 font-semibold">{fmt.currency(trip.opening_batta)}</span></div>
              <div className="mt-0.5">Spent: <span className="text-slate-700 font-semibold">{fmt.currency(trip.spent)}</span></div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-slate-100" />

        {/* ROUTE */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Origin</div>
            <div className="text-[14px] font-bold text-slate-800 flex items-center gap-1.5 truncate">
              <MapPin size={14} className="text-blue-500 flex-shrink-0" /> 
              <span className="truncate">{trip.origin}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center px-2">
            <ArrowRight size={16} className="text-slate-300" />
          </div>
          <div className="flex-1 flex flex-col items-end text-right min-w-0">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Destination</div>
            <div className="text-[14px] font-bold text-slate-800 flex items-center justify-end gap-1.5 truncate w-full">
              <span className="truncate">{trip.destination}</span>
              <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Batta Utilization</span>
            <span className="text-[12px] font-bold text-slate-700">{Math.round(pctRemaining)}% Remaining</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${progressColor} transition-all duration-500`} 
              style={{ width: `${pctRemaining}%` }}
            />
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded text-[12px] font-medium text-slate-600">
            <Calendar size={13} className="text-blue-500" /> {trip.start}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded text-[12px] font-medium text-slate-600">
            <BarChart3 size={13} className="text-orange-500" /> {trip.expenses} Expenses
          </div>
        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-3">
        <button 
          className="flex-1 h-9 rounded-md bg-white border border-slate-300 text-[13px] font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          onClick={onTopUp}
        >
          <Wallet size={14} /> Top-up Batta
        </button>
        {trip.status === "active" ? (
          <button 
            className="flex-1 h-9 rounded-md bg-red-50 text-red-600 border border-red-200 text-[13px] font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            onClick={onEndTrip}
          >
            <StopCircle size={14} /> End Trip
          </button>
        ) : (
          <button 
            className="flex-1 h-9 rounded-md bg-slate-200 text-slate-400 border border-slate-200 text-[13px] font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
            disabled
          >
            <CheckCircle size={14} /> Ended
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────
export default function TripsDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const trips = useFleetStore(state => state.trips);
  const setTrips = useFleetStore(state => state.setTrips);
  const addTopUp = useFleetStore(state => state.addTopUp);
  const endTripAction = useFleetStore(state => state.endTrip);
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [showModal, setShowModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showEndTripModal, setShowEndTripModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [form, setForm] = useState({ driver_id: "", origin: "", destination: "", opening_batta: "" });
  const [topUpAmount, setTopUpAmount] = useState("");
  const [apiDrivers, setApiDrivers] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    api.getDrivers().then(data => {
      if (data && Array.isArray(data.drivers)) {
        setApiDrivers(data.drivers);
      }
    }).catch(console.error);
  }, []);
  if (!mounted) return null;

  const filtered = trips.filter(t => t.status === tab);

  // KPIs
  const activeTrips = trips.filter(t => t.status === "active").length;
  const completedToday = 2; // Mock logic
  const totalBattaSpent = trips.reduce((sum, t) => sum + t.spent, 0);
  const avgBalancePct = trips.length ? Math.round(trips.reduce((sum, t) => sum + (100 - (t.spent/t.opening_batta*100)), 0) / trips.length) : 0;

  const handleStartTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.driver_id || !form.opening_batta) return;
    
    try {
      await api.startTrip({
        driver_id: form.driver_id,
        origin: form.origin || "Unknown",
        destination: form.destination || "Unknown",
        opening_batta: parseInt(form.opening_batta) || 0,
      });

      const driverName = apiDrivers.find(d => String(d.id) === String(form.driver_id))?.name || form.driver_id;
      const newTrip = {
        id: Math.random().toString(),
        code: `TRIP-${Math.floor(Math.random() * 9000) + 1000}`,
        driver: driverName,
        vehicle: "TN01AB1234",
        origin: form.origin || "Unknown",
        destination: form.destination || "Unknown",
        start: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
        opening_batta: parseInt(form.opening_batta) || 0,
        spent: 0,
        expenses: 0,
        status: "active" as const
      };
      setTrips([newTrip, ...trips]);
      setForm({ driver_id: "", origin: "", destination: "", opening_batta: "" });
      setShowModal(false);
      setTab("active");
    } catch (err) {
      console.error("Error starting trip:", err);
      alert("Failed to start trip.");
    }
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId || !topUpAmount) return;
    const amount = parseInt(topUpAmount);
    addTopUp(selectedTripId, amount);
    setTopUpAmount("");
    setShowTopUpModal(false);
  };

  const handleEndTrip = () => {
    if (!selectedTripId) return;
    endTripAction(selectedTripId);
    setShowEndTripModal(false);
  };

  return (
    <div className="space-y-5">
      
      {/* ── HEADER AREA ──────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-6 md:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-[24px] md:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight">Trips Management</h1>
              <p className="text-[13px] text-slate-500 font-medium mt-1">Monitor active trips and fleet expenses in real time.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="h-10 flex items-center justify-center gap-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold transition-all shadow-sm"
            >
              <Plus size={16} />
              Start New Trip
            </button>
          </div>

          {/* Segmented Tabs */}
          <div className="mt-6 flex items-center gap-6 border-b border-slate-100 pb-px">
            {(["active", "completed"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2.5 pt-1 text-[13px] font-bold capitalize transition-all border-b-2 outline-none ${
                  tab === t 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                {t} Trips
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN SCROLLABLE CONTENT ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-6">
            {filtered.map(trip => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onTopUp={() => { setSelectedTripId(trip.id); setShowTopUpModal(true); }}
                onEndTrip={() => { setSelectedTripId(trip.id); setShowEndTripModal(true); }}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm">
              <RouteIcon size={48} className="text-slate-300 mb-4" />
              <h3 className="text-[16px] font-bold text-slate-700">No trips found</h3>
              <p className="text-[13px] text-slate-500 mt-1">There are no {tab} trips at the moment.</p>
            </div>
          )}

          {/* SUMMARY KPIs */}
          <div className="pt-4">
            <h2 className="text-[18px] font-bold text-slate-800 mb-4 tracking-tight">Operations Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><Truck size={20} /></div>
                <div>
                  <div className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Active Trips</div>
                  <div className="text-[22px] font-extrabold text-slate-900 leading-none">{activeTrips} <span className="text-[13px] font-medium text-slate-500">Running</span></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><CheckCircle size={20} /></div>
                <div>
                  <div className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Completed Today</div>
                  <div className="text-[22px] font-extrabold text-slate-900 leading-none">{completedToday} <span className="text-[13px] font-medium text-slate-500">Trips</span></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0"><Wallet size={20} /></div>
                <div>
                  <div className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Batta Spent</div>
                  <div className="text-[22px] font-extrabold text-slate-900 leading-none">{fmt.currency(totalBattaSpent)}</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0"><TrendingUp size={20} /></div>
                <div>
                  <div className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Avg Batta Balance</div>
                  <div className="text-[22px] font-extrabold text-slate-900 leading-none">{avgBalancePct}%</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── START NEW TRIP MODAL ─────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 w-full max-w-lg overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <RouteIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Start New Trip</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Assign a driver and allocate batta</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleStartTrip} className="p-7 space-y-6 bg-slate-50/30">
              
              {/* Driver */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Assign Driver <span className="text-red-500">*</span></label>
                <select 
                  required
                  value={form.driver_id}
                  onChange={(e) => setForm({...form, driver_id: e.target.value})}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[13.5px] font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-sm"
                >
                  <option value="">Select a driver...</option>
                  {apiDrivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              {/* Route */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-2">Origin</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Chennai"
                    value={form.origin}
                    onChange={(e) => setForm({...form, origin: e.target.value})}
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[13.5px] font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-2">Destination</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mumbai"
                    value={form.destination}
                    onChange={(e) => setForm({...form, destination: e.target.value})}
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[13.5px] font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Batta */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Opening Batta (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-semibold text-[14px]">₹</span>
                  </div>
                  <input 
                    type="number" 
                    required
                    placeholder="15000"
                    value={form.opening_batta}
                    onChange={(e) => setForm({...form, opening_batta: e.target.value})}
                    className="w-full h-11 pl-8 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-800 placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13.5px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 text-[13.5px] flex items-center justify-center gap-2"
                >
                  <RouteIcon size={16} /> Start Trip Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top-up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Wallet size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Top-up Batta</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Add more funds to this trip</p>
                </div>
              </div>
              <button onClick={() => setShowTopUpModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleTopUp} className="px-6 py-6 flex flex-col gap-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Amount to Add (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-semibold text-[14px]">₹</span>
                  </div>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 5000" 
                    value={topUpAmount} 
                    onChange={(e) => setTopUpAmount(e.target.value)} 
                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-800 placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-300 outline-none transition-all shadow-sm" 
                  />
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <button type="button" onClick={() => setShowTopUpModal(false)} className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13px]">Cancel</button>
                <button type="submit" className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] border border-blue-500/20 text-[13px] flex items-center justify-center gap-2"><Wallet size={16} /> Top-up Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* End Trip Modal */}
      {showEndTripModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <StopCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">End Trip</h2>
                  <p className="text-[12px] text-slate-500 font-medium">Are you sure you want to end this trip?</p>
                </div>
              </div>
              <button onClick={() => setShowEndTripModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="px-6 py-6 flex flex-col gap-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700 text-sm font-medium">
                Ending this trip will calculate final expenses and mark it as completed. This action cannot be undone.
              </div>
              
              <div className="flex flex-row gap-3">
                <button onClick={() => setShowEndTripModal(false)} className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm text-[13px]">Cancel</button>
                <button onClick={handleEndTrip} className="flex-[2] h-11 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-red-500/20 text-[13px] flex items-center justify-center gap-2"><StopCircle size={16} /> End Trip</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
