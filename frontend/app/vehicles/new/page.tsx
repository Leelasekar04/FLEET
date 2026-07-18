"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Truck, Info, Settings, FileText } from "lucide-react";

export default function AddVehiclePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      router.push("/vehicles");
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <Link href="/vehicles" className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-600 transition-colors mb-3 font-medium">
          <ArrowLeft size={13} /> Back to Vehicles
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <Truck size={18} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight leading-tight">Add New Vehicle</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">Register a new asset to your fleet tracking system.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FORM ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6">
          
          {/* Section: Basic Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Info size={16} className="text-blue-500" />
              <h2 className="text-[14px] font-bold text-slate-800">Basic Information</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Vehicle Number <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="e.g. TN01AB1234" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Vehicle Type</label>
                <select className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  <option>Truck</option>
                  <option>Trailer</option>
                  <option>Tanker</option>
                  <option>Container</option>
                  <option>LCV</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Make / Brand</label>
                <input type="text" placeholder="e.g. Tata, Ashok Leyland" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Model</label>
                <input type="text" placeholder="e.g. Prima 4928.S" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Year of Manufacture</label>
                <input type="number" placeholder="YYYY" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Capacity (Tons)</label>
                <input type="number" placeholder="e.g. 25" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Section: Technical Specs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Settings size={16} className="text-amber-500" />
              <h2 className="text-[14px] font-bold text-slate-800">Technical Specifications</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Engine Number</label>
                <input type="text" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Chassis Number</label>
                <input type="text" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Fuel Type</label>
                <select className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>Electric</option>
                  <option>Petrol</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Color</label>
                <input type="text" placeholder="e.g. White" className="w-full h-10 px-3 text-[13px] rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/vehicles")}
              className="h-10 px-5 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-all shadow-sm flex items-center gap-2"
            >
              {saving ? "Saving..." : <><Save size={16} /> Save Vehicle</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
