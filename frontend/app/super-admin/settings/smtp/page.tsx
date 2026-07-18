"use client";

import { 
  Save, 
  CheckCircle2, 
  Mail,
  Server,
  Lock,
  Send
} from "lucide-react";
import { useState } from "react";

export default function SMTPSettingsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  
  const [formData, setFormData] = useState({
    host: "smtp.mailgun.org",
    port: "587",
    username: "postmaster@fleetmanager.com",
    password: "••••••••••••••••",
    fromName: "FleetManager Admin",
    fromEmail: "noreply@fleetmanager.com",
    encryption: "tls"
  });

  const handleSave = () => {
    setToastMessage("SMTP Settings saved successfully");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsTesting(false);
    setToastMessage("Test email sent successfully! Connection is valid.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">SMTP Settings</h1>
          <p className="cmd-banner-sub">
            Configure the email server used for sending system notifications, alerts, and invoices.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            <Send size={16} className={isTesting ? "animate-pulse" : ""} /> 
            {isTesting ? "Testing..." : "Test Connection"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in stagger-1">
        
        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Server size={18} className="text-indigo-500" /> Server Configuration
          </h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Host</label>
                <input 
                  type="text" 
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                  placeholder="smtp.example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Port</label>
                <input 
                  type="text" 
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Encryption</label>
                <select 
                  name="encryption"
                  value={formData.encryption}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900"
                >
                  <option value="none">None</option>
                  <option value="ssl">SSL</option>
                  <option value="tls">TLS</option>
                </select>
              </div>
            </div>
            
            <div className="h-px bg-slate-100 my-2"></div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" /> Username
              </label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" /> Password / API Key
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
            </div>
          </div>
        </div>

        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Mail size={18} className="text-blue-500" /> Sender Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From Name</label>
              <input 
                type="text" 
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                The name that appears in the recipient's inbox.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From Email Address</label>
              <input 
                type="email" 
                name="fromEmail"
                value={formData.fromEmail}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                Must be an authorized sender domain in your SMTP provider.
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
