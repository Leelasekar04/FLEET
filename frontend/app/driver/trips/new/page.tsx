"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, MapPin, Navigation, Calendar } from "lucide-react";
import Link from "next/link";
import { useDriverSync } from "@/hooks/useDriverSync";

export default function NewTripLogPage() {
  const router = useRouter();
  const { driverMe } = useDriverSync();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    startDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call for now since driver-initiated trips might need dispatcher approval
    setTimeout(() => {
      setSubmitting(false);
      router.push("/driver/trips");
    }, 1500);
  };

  const v = driverMe?.assignedVehicle;

  return (
    <div className="cmd-root p-6 max-w-3xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/driver/trips" className="text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="cmd-banner-title">New Trip Log</h1>
          </div>
          <p className="cmd-banner-sub">
            Log an ad-hoc or manual trip. Subject to dispatcher approval.
          </p>
        </div>
      </div>

      <div className="mt-6 cmd-chart-card animate-fade-in stagger-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label flex items-center gap-1.5"><MapPin size={14}/> Origin</label>
              <input 
                type="text" 
                value={form.origin}
                onChange={(e) => setForm({...form, origin: e.target.value})}
                placeholder="e.g. Warehouse A"
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label flex items-center gap-1.5"><Navigation size={14}/> Destination</label>
              <input 
                type="text" 
                value={form.destination}
                onChange={(e) => setForm({...form, destination: e.target.value})}
                placeholder="e.g. Client Site B"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label flex items-center gap-1.5"><Calendar size={14}/> Start Date & Time</label>
              <input 
                type="datetime-local" 
                value={form.startDate}
                onChange={(e) => setForm({...form, startDate: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Vehicle</label>
              <input 
                type="text" 
                value={v ? v.vehicle_number : "No assigned vehicle"}
                disabled
                className="form-input bg-slate-50 opacity-75 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Additional Notes</label>
            <textarea 
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              placeholder="Any details about this trip..."
              className="form-input resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 gap-3">
            <Link href="/driver/trips" className="btn btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={submitting || !form.origin || !form.destination}
              className="btn btn-primary min-w-[150px]"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Trip Log
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
