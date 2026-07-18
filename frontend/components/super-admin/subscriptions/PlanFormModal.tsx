"use client";

import { useState } from "react";
import { X, Save, CheckCircle2, Copy } from "lucide-react";

export default function PlanFormModal({ initialData, onSubmit, onClose }: { initialData?: any, onSubmit: (data: any) => void, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"general" | "limits" | "features">("general");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    monthly_price: initialData?.monthly_price || 0,
    annual_price: initialData?.annual_price || 0,
    trial_days: initialData?.trial_days || 14,
    currency: initialData?.currency || "INR",
    status: initialData?.status || "active",
    limits: {
      vehicles: initialData?.limits?.vehicles || 0,
      drivers: initialData?.limits?.drivers || 0,
      users: initialData?.limits?.users || 0,
      trips: initialData?.limits?.trips || 0,
      storage: initialData?.limits?.storage || 0,
    },
    features: {
      vehicles: initialData?.features?.vehicles ?? true,
      drivers: initialData?.features?.drivers ?? true,
      trips: initialData?.features?.trips ?? true,
      reports: initialData?.features?.reports ?? "Basic Reports",
      maintenance: initialData?.features?.maintenance ?? false,
      gps: initialData?.features?.gps ?? false,
      fuel: initialData?.features?.fuel ?? false,
      analytics: initialData?.features?.analytics ?? false,
      api: initialData?.features?.api ?? false,
      multi_branch: initialData?.features?.multi_branch ?? false,
      white_label: initialData?.features?.white_label ?? false,
    }
  });

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLimitChange = (field: string, value: number) => {
    setFormData({ ...formData, limits: { ...formData.limits, [field]: value } });
  };

  const handleFeatureToggle = (field: string) => {
    setFormData({ 
      ...formData, 
      features: { ...formData.features, [field]: !(formData.features as any)[field] } 
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Copy className="text-indigo-600" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {isEditing ? "Edit Subscription Plan" : "Create Subscription Plan"}
              </h2>
              <p className="text-[12px] text-slate-500 font-medium">Configure pricing, limits, and features</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 bg-white px-6 gap-6 pt-2">
          {["general", "limits", "features"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`pb-3 pt-2 text-[13px] font-bold capitalize transition-all border-b-2 outline-none
                ${activeTab === t 
                  ? "border-indigo-600 text-indigo-600" 
                  : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              {t} Configuration
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <form id="plan-form" onSubmit={handleSubmit} className="space-y-6">
            
            {activeTab === "general" && (
              <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Plan Name</label>
                  <input 
                    type="text" required value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium bg-white shadow-sm"
                    placeholder="e.g. Professional Plan"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Description</label>
                  <input 
                    type="text" value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Short tagline for the plan"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Monthly Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">{formData.currency}</span>
                    <input 
                      type="number" required min="0" value={formData.monthly_price}
                      onChange={e => setFormData({...formData, monthly_price: Number(e.target.value)})}
                      className="w-full pl-12 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900 bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Annual Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">{formData.currency}</span>
                    <input 
                      type="number" required min="0" value={formData.annual_price}
                      onChange={e => setFormData({...formData, annual_price: Number(e.target.value)})}
                      className="w-full pl-12 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900 bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Trial Period (Days)</label>
                  <input 
                    type="number" required min="0" value={formData.trial_days}
                    onChange={e => setFormData({...formData, trial_days: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900 bg-white shadow-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === "limits" && (
              <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="col-span-2 bg-indigo-50 text-indigo-700 p-3 rounded-xl text-sm font-medium border border-indigo-100">
                  Tip: Use -1 to indicate "Unlimited" for any of the limits below.
                </div>
                {[
                  { key: "vehicles", label: "Max Vehicles" },
                  { key: "drivers", label: "Max Drivers" },
                  { key: "users", label: "Max System Users" },
                  { key: "trips", label: "Trips per Month" },
                  { key: "storage", label: "Storage Limit (GB)" }
                ].map(limit => (
                  <div key={limit.key}>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{limit.label}</label>
                    <input 
                      type="number" required value={(formData.limits as any)[limit.key]}
                      onChange={e => handleLimitChange(limit.key, Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900 bg-white shadow-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "features" && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="col-span-2 mb-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Reporting Tier</label>
                  <select 
                    value={formData.features.reports}
                    onChange={e => setFormData({ ...formData, features: { ...formData.features, reports: e.target.value } })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900 bg-white shadow-sm"
                  >
                    <option value="Basic Reports">Basic Reports</option>
                    <option value="Advanced Reports">Advanced Reports</option>
                    <option value="Custom Reports">Custom BI Reports</option>
                  </select>
                </div>
                
                {[
                  { key: "vehicles", label: "Vehicle Management" },
                  { key: "drivers", label: "Driver Management" },
                  { key: "trips", label: "Trips & Batta" },
                  { key: "gps", label: "GPS Tracking" },
                  { key: "fuel", label: "Fuel Management" },
                  { key: "maintenance", label: "Maintenance Tracking" },
                  { key: "analytics", label: "Advanced Analytics" },
                  { key: "api", label: "Developer API Access" },
                  { key: "multi_branch", label: "Multi-Branch Support" },
                  { key: "white_label", label: "White Label Branding" },
                ].map(feature => (
                  <div 
                    key={feature.key} 
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:border-indigo-300 transition-all"
                    onClick={() => handleFeatureToggle(feature.key)}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      (formData.features as any)[feature.key] ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-100 border-slate-300 text-transparent"
                    }`}>
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-[13.5px] font-bold text-slate-700 select-none">{feature.label}</span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" form="plan-form" className="px-5 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-200 flex items-center gap-2">
            <Save size={16} />
            {isEditing ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
