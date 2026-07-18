"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Route, Receipt, PlusCircle, CheckCircle, Upload, Loader2, Save } from "lucide-react";
import { useFleetStore } from "@/lib/store";

export default function DriverAddExpensePage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const setExpenses = useFleetStore(state => state.setExpenses);
  const expensesStore = useFleetStore(state => state.expenses);
  
  const [form, setForm] = useState({
    trip_id: "",
    vehicle_id: "",
    expense_type: "Fuel",
    amount: "",
    expense_date: new Date().toISOString().split('T')[0],
    description: "",
    receipt_url: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("driver_token");
    if (!token) {
      router.push("/driver/login");
      return;
    }
    fetchActiveTrips(token);
  }, [router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, receipt_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchActiveTrips = async (token: string) => {
    try {
      const res = await fetch("http://localhost:4000/api/portal/driver/expenses/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrips(data.activeTrips);
        if (data.activeTrips.length > 0) {
          setForm(prev => ({
            ...prev,
            trip_id: data.activeTrips[0].id,
            vehicle_id: data.activeTrips[0].vehicle_id || ""
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("driver_token");
      const res = await fetch("http://localhost:4000/api/portal/driver/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        // Add to global Zustand store so it appears in Admin Expenses page
        try {
          const profileStr = localStorage.getItem("driver_profile");
          const profile = profileStr ? JSON.parse(profileStr) : { name: "Current Driver" };
          const tripCode = form.trip_id ? `TRIP-${form.trip_id.substring(0,4)}` : "N/A";
          const newLocalExpense = {
            id: data.expense?.id || Math.random().toString(),
            driver: profile.name || "Driver",
            trip: tripCode,
            type: form.expense_type,
            amount: parseFloat(form.amount),
            location: "Unknown",
            via: form.receipt_url ? "image" : "text",
            confidence: 1.0,
            created_at: new Date().toISOString(),
            notes: form.description
          };
          setExpenses([newLocalExpense, ...expensesStore]);
        } catch (e) {
          console.error("Error updating local store:", e);
        }
        
        setTimeout(() => router.push("/driver/expenses"), 1500);
      } else {
        setError(data.error || "Failed to submit expense");
      }
    } catch (err: any) {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center sticky top-0 z-10">
        <Link href="/driver/dashboard" className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-[15px] font-bold text-slate-900 ml-2">Add Expense</h1>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full pb-20">
        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center mt-10">
            <CheckCircle size={48} className="text-emerald-500 mb-4" />
            <h2 className="text-lg font-bold text-emerald-700 mb-1">Expense Saved!</h2>
            <p className="text-sm text-emerald-600 font-medium">Redirecting to history...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date</label>
              <input
                type="date"
                required
                value={form.expense_date}
                onChange={e => setForm({...form, expense_date: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Trip (Optional)</label>
              <select
                value={form.trip_id}
                onChange={e => {
                  const trip = trips.find(t => t.id === e.target.value);
                  setForm({...form, trip_id: e.target.value, vehicle_id: trip ? trip.vehicle_id : ""});
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="">No Trip Assigned</option>
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>
                    Trip #{trip.id.substring(0,6)} ({trip.origin} - {trip.destination})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Expense Type</label>
                <select
                  required
                  value={form.expense_type}
                  onChange={e => setForm({...form, expense_type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Batta">Batta</option>
                  <option value="Toll">Toll</option>
                  <option value="Parking">Parking</option>
                  <option value="Maintenance">Repair / Maint</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.amount}
                  onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Remarks / Details</label>
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none h-24"
                placeholder="Enter any additional details..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Attach Receipt Image</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-400 transition-colors">
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Select Image...</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                {form.receipt_url && (
                  <div className="w-20 h-20 shrink-0 rounded-xl border border-slate-200 overflow-hidden shadow-sm relative group">
                    <img src={form.receipt_url} alt="Receipt preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({...form, receipt_url: ""})} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || loadingTrips}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl text-[14px] font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Submit Expense
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around p-2 pb-safe z-10 max-w-lg mx-auto">
        <Link href="/driver/dashboard" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-600">
          <Route size={20} className="mb-1" />
          <span className="text-[10px] font-semibold">Dashboard</span>
        </Link>
        <Link href="/driver/expenses/add" className="flex flex-col items-center p-2 text-blue-600">
          <PlusCircle size={20} className="mb-1" />
          <span className="text-[10px] font-bold">Expense</span>
        </Link>
        <Link href="/driver/expenses" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-600">
          <Receipt size={20} className="mb-1" />
          <span className="text-[10px] font-semibold">History</span>
        </Link>
      </div>
    </div>
  );
}
