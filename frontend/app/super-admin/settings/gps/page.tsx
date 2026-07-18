"use client";

import { 
  Save, 
  CheckCircle2, 
  Map,
  Lock,
  Link2,
  RefreshCw,
  Cpu,
  Plus
} from "lucide-react";
import { useState } from "react";

export default function GPSProvidersPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [providers, setProviders] = useState([
    { id: "samsara", name: "Samsara", apiKey: "••••••••••••••••", enabled: true, connected: true },
    { id: "geotab", name: "Geotab", apiKey: "", enabled: false, connected: false },
    { id: "motive", name: "Motive (KeepTruckin)", apiKey: "", enabled: false, connected: false }
  ]);

  const handleSave = () => {
    setToastMessage("GPS Provider settings saved");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleTestConnection = async (id: string) => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSyncing(false);
    setProviders(providers.map(p => p.id === id ? { ...p, connected: true } : p));
    setToastMessage(`Successfully connected to ${providers.find(p => p.id === id)?.name}`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleProvider = (id: string) => {
    setProviders(providers.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleApiKeyChange = (id: string, value: string) => {
    setProviders(providers.map(p => p.id === id ? { ...p, apiKey: value, connected: false } : p));
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">GPS Providers</h1>
          <p className="cmd-banner-sub">
            Manage integrations with third-party telematics and GPS tracking hardware.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>

      <div className="space-y-6 mt-6 animate-fade-in stagger-1 max-w-4xl">
        {providers.map((provider) => (
          <div key={provider.id} className={`cmd-chart-card p-6 transition-opacity ${!provider.enabled ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Cpu size={18} className="text-blue-500" /> {provider.name} Integration
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">Enable</span>
                <div 
                  className={`toggle ${provider.enabled ? 'toggle-on' : 'toggle-off'}`}
                  onClick={() => toggleProvider(provider.id)}
                >
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Lock size={12} className="text-slate-400" /> API Token
                </label>
                <div className="flex gap-2">
                  <input 
                    type={provider.apiKey.includes('•') ? "text" : "password"}
                    value={provider.apiKey}
                    onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                    disabled={!provider.enabled}
                    className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                    placeholder="Enter API token..."
                  />
                  <button 
                    className="btn btn-secondary !h-10 shrink-0" 
                    onClick={() => handleTestConnection(provider.id)}
                    disabled={!provider.enabled || isSyncing || !provider.apiKey}
                  >
                    <Link2 size={16} className={provider.connected ? "text-emerald-500" : ""} /> 
                    {provider.connected ? "Connected" : "Connect"}
                  </button>
                </div>
                {provider.connected && (
                  <p className="text-[10px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Integration active and polling successfully.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
            <Plus size={20} />
          </div>
          <span className="font-bold text-sm">Add Custom Telematics Provider</span>
          <span className="text-xs font-medium opacity-75 mt-0.5">Configure a custom webhooks endpoint</span>
        </button>
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
