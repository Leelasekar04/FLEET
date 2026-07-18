"use client";

import { 
  Settings, 
  Save, 
  CheckCircle2, 
  Globe,
  UploadCloud,
  MapPin,
  Clock,
  Building2
} from "lucide-react";
import { useState } from "react";

export default function GeneralSettingsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    platformName: "FleetManager Pro",
    supportEmail: "support@fleetmanager.com",
    timezone: "UTC",
    dateFormat: "YYYY-MM-DD",
    currency: "USD",
    logoUrl: "https://example.com/logo.png"
  });

  const handleSave = () => {
    setToastMessage("Settings saved successfully");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">General Settings</h1>
          <p className="cmd-banner-sub">
            Configure global platform details, branding, and localization.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        
        {/* Left Column - Branding */}
        <div className="lg:col-span-1 space-y-6">
          <div className="cmd-chart-card p-6">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-blue-500" /> Platform Identity
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Platform Name</label>
                <input 
                  type="text" 
                  name="platformName"
                  value={formData.platformName}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                <input 
                  type="email" 
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                  />
                  <button className="btn btn-secondary !h-10 !px-3">
                    <UploadCloud size={18} className="text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Localization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="cmd-chart-card p-6">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Globe size={18} className="text-emerald-500" /> Localization & Defaults
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400" /> Default Timezone
                </label>
                <select 
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">EST (Eastern Standard Time)</option>
                  <option value="Asia/Kolkata">IST (Indian Standard Time)</option>
                  <option value="Europe/London">GMT (Greenwich Mean Time)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400" /> Date Format
                </label>
                <select 
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-15)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (15/07/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (07/15/2026)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Global Currency</label>
                <select 
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">
                  Fallback currency if tenant doesn't specify one.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
