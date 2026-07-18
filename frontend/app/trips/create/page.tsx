"use client";
import { useState } from "react";
import Link from "next/link";
import { Route, ArrowLeft, MapPin, Users, Truck, Package, IndianRupee, Calendar, ChevronRight } from "lucide-react";

const drivers = [
  { id: "mock-driver-1", name: "Raju Driver",  vehicle: "TN01AB1234" },
  { id: "mock-driver-2", name: "Ali Khan",   vehicle: "TN02CD5678" },
  { id: "3", name: "Muthu Raja",    vehicle: "TN03EF9012" },
  { id: "4", name: "Arjun Singh",   vehicle: "DL01GH3456" },
  { id: "5", name: "Karthik M",     vehicle: "KA02IJ7890" },
];

const vehicles = [
  { id: "1", number: "TN01AB1234", type: "Truck 25T",    available: false },
  { id: "2", number: "TN02CD5678", type: "Container 20T",available: false },
  { id: "3", number: "TN03EF9012", type: "Truck 15T",    available: true },
  { id: "4", number: "KA02IJ7890", type: "Tanker 18T",   available: true },
  { id: "5", number: "MH04MN5678", type: "Truck 28T",    available: true },
];

const customers = [
  { id: "1", name: "Infosys Ltd",          gst: "29AABCI1234A1Z5" },
  { id: "2", name: "Tata Consultancy",      gst: "27AAACT1234A1Z2" },
  { id: "3", name: "Reliance Industries",   gst: "27AAACR0471M1Z5" },
  { id: "4", name: "Wipro Ltd",             gst: "29AAACW0002H1ZO" },
];

const loadTypes = ["General", "Fragile", "Perishable", "Hazardous", "Bulk Liquid", "Oversized"];

type Step = 1 | 2 | 3;

export default function CreateTripPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    driver_id: "", vehicle_id: "", customer_id: "",
    origin: "", destination: "", distance: "",
    load_type: "", scheduled_date: "",
    opening_batta: "", fuel_advance: "", toll_advance: "", food_advance: "",
    freight_amount: "", notes: "",
  });

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const selectedDriver = drivers.find(d => d.id === form.driver_id);
  const selectedVehicle = vehicles.find(v => v.id === form.vehicle_id);

  const totalBatta = (parseFloat(form.opening_batta) || 0) +
    (parseFloat(form.fuel_advance) || 0) +
    (parseFloat(form.toll_advance) || 0) +
    (parseFloat(form.food_advance) || 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/trips" className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-white mb-3 w-fit">
          <ArrowLeft size={14} /> Trips
        </Link>
        <h1 className="text-2xl font-bold text-white">Start New Trip</h1>
        <p className="text-sm text-[#9ca3af] mt-0.5">Fill in the trip details to create and allocate batta</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {([
          { n: 1, label: "Assignment" },
          { n: 2, label: "Trip Details" },
          { n: 3, label: "Batta" },
        ] as { n: Step; label: string }[]).map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s.n ? "bg-[#00d4aa] text-black" :
                step > s.n ? "bg-[#00d4aa]/20 text-[#00d4aa]" : "bg-white/8 text-[#4b5563]"
              }`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`text-xs mt-1 font-medium ${step >= s.n ? "text-white" : "text-[#4b5563]"}`}>{s.label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-2 mb-4 ${step > s.n ? "bg-[#00d4aa]/40" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Assignment */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Users size={16} className="text-[#00d4aa]" /> Driver & Vehicle Assignment
          </h2>

          <div>
            <label className="form-label">Select Driver *</label>
            <div className="grid grid-cols-1 gap-2">
              {drivers.map((d) => (
                <button key={d.id} onClick={() => update("driver_id", d.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    form.driver_id === d.id ? "border-[#00d4aa] bg-[#00d4aa]/10" : "border-white/8 bg-white/4 hover:border-white/20"
                  }`}>
                  <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center font-bold text-white">
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{d.name}</div>
                    <div className="text-xs font-mono text-[#6b7280]">{d.vehicle}</div>
                  </div>
                  {form.driver_id === d.id && <div className="ml-auto text-[#00d4aa]">✓</div>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Select Vehicle *</label>
            <div className="grid grid-cols-2 gap-2">
              {vehicles.map((v) => (
                <button key={v.id} onClick={() => v.available && update("vehicle_id", v.id)} disabled={!v.available}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                    !v.available ? "opacity-40 cursor-not-allowed border-white/5 bg-white/2" :
                    form.vehicle_id === v.id ? "border-[#00d4aa] bg-[#00d4aa]/10" :
                    "border-white/8 bg-white/4 hover:border-white/20"
                  }`}>
                  <Truck size={15} className={form.vehicle_id === v.id ? "text-[#00d4aa]" : "text-[#9ca3af]"} />
                  <div>
                    <div className="text-xs font-mono font-bold text-white">{v.number}</div>
                    <div className="text-[10px] text-[#6b7280]">{v.type}</div>
                    {!v.available && <div className="text-[10px] text-[#ef4444]">On Trip</div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Customer (Optional)</label>
            <select className="form-input" value={form.customer_id} onChange={e => update("customer_id", e.target.value)}>
              <option value="">— No customer —</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <button className="btn btn-primary w-full justify-center" onClick={() => setStep(2)}
            disabled={!form.driver_id || !form.vehicle_id}>
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2 — Trip Details */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <MapPin size={16} className="text-[#00d4aa]" /> Trip Details
          </h2>

          <div className="p-3 rounded-xl bg-white/4 flex items-center gap-4">
            <div className="text-xs text-[#6b7280]">Driver:</div>
            <div className="text-sm font-semibold text-white">{selectedDriver?.name}</div>
            <div className="text-xs text-[#6b7280]">Vehicle:</div>
            <div className="text-xs font-mono text-[#00d4aa]">{selectedVehicle?.number}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Origin / From *", key: "origin",      placeholder: "e.g. Chennai" },
              { label: "Destination / To *", key: "destination", placeholder: "e.g. Hyderabad" },
              { label: "Distance (km)",   key: "distance",    placeholder: "e.g. 720" },
              { label: "Freight Amount (₹)", key: "freight_amount", placeholder: "e.g. 45000" },
            ].map(f => (
              <div key={f.key}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" placeholder={f.placeholder}
                  value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)} />
              </div>
            ))}
            <div>
              <label className="form-label">Load Type</label>
              <select className="form-input" value={form.load_type} onChange={e => update("load_type", e.target.value)}>
                <option value="">Select type...</option>
                {loadTypes.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Scheduled Date</label>
              <input type="date" className="form-input" value={form.scheduled_date}
                onChange={e => update("scheduled_date", e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="form-label">Notes</label>
              <textarea className="form-input h-20 resize-none" placeholder="Any special instructions..."
                value={form.notes} onChange={e => update("notes", e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-secondary flex-1 justify-center" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary flex-1 justify-center" onClick={() => setStep(3)}
              disabled={!form.origin || !form.destination}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Batta Allocation */}
      {step === 3 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <IndianRupee size={16} className="text-[#00d4aa]" /> Batta Allocation
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "General Advance (₹)", key: "opening_batta",  placeholder: "e.g. 10000" },
              { label: "Fuel Advance (₹)",    key: "fuel_advance",   placeholder: "e.g. 5000" },
              { label: "Toll Advance (₹)",    key: "toll_advance",   placeholder: "e.g. 2000" },
              { label: "Food Advance (₹)",    key: "food_advance",   placeholder: "e.g. 1000" },
            ].map(f => (
              <div key={f.key}>
                <label className="form-label">{f.label}</label>
                <input type="number" className="form-input" placeholder={f.placeholder}
                  value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)} />
              </div>
            ))}
          </div>

          {/* Total Batta Summary */}
          <div className="p-4 rounded-xl bg-[#00d4aa]/8 border border-[#00d4aa]/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#9ca3af]">Total Batta to Allocate</span>
              <span className="text-2xl font-bold text-[#00d4aa]">
                ₹{totalBatta.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-2 text-xs text-[#6b7280]">
              {form.origin} → {form.destination} · {selectedDriver?.name} · {selectedVehicle?.number}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-secondary flex-1 justify-center" onClick={() => setStep(2)}>Back</button>
            <button className="btn btn-primary flex-1 justify-center" disabled={totalBatta === 0}>
              🚛 Start Trip & Allocate ₹{totalBatta.toLocaleString("en-IN")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
