"use client";

import { 
  Save, 
  CheckCircle2, 
  MessageSquare,
  Lock,
  Link2,
  RefreshCw,
  Phone
} from "lucide-react";
import { useState } from "react";

export default function WhatsAppSettingsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    apiKey: "EAAGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    phoneNumberId: "109876543210987",
    businessAccountId: "101234567890123",
    webhookUrl: "https://api.fleetmanager.com/webhooks/whatsapp",
    verifyToken: "fleet_secure_webhook_token_2026"
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setToastMessage("WhatsApp API settings saved successfully");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSyncStatus = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSyncing(false);
    setToastMessage("API connected successfully. Webhook verified.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">WhatsApp API</h1>
          <p className="cmd-banner-sub">
            Configure the official WhatsApp Business Cloud API used by the automated driver bot.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleSyncStatus}
            disabled={isSyncing}
          >
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : "text-emerald-500"} /> 
            {isSyncing ? "Syncing..." : "Sync Status"}
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleSave}
            disabled={isSaving || isSyncing}
          >
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} 
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in stagger-1">
        
        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <MessageSquare size={18} className="text-emerald-500" /> Cloud API Credentials
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" /> Permanent Access Token
              </label>
              <input 
                type="password" 
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone size={12} className="text-slate-400" /> Phone Number ID
                </label>
                <input 
                  type="text" 
                  name="phoneNumberId"
                  value={formData.phoneNumberId}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WABA Account ID</label>
                <input 
                  type="text" 
                  name="businessAccountId"
                  value={formData.businessAccountId}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                />
              </div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mt-4 flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Connection Active</h4>
                <p className="text-xs text-emerald-700 mt-0.5">The WhatsApp Cloud API is currently connected and processing messages.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Link2 size={18} className="text-blue-500" /> Webhook Configuration
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Webhook URL</label>
              <input 
                type="text" 
                name="webhookUrl"
                value={formData.webhookUrl}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-500 bg-slate-50" 
                readOnly
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                Configure this exact URL in your Meta App Dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Verify Token</label>
              <input 
                type="text" 
                name="verifyToken"
                value={formData.verifyToken}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                This token must match the one provided to Meta during webhook setup.
              </p>
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
