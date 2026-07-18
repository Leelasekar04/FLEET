"use client";

import { 
  Save, 
  CheckCircle2, 
  MessageSquare,
  Lock,
  Send,
  Smartphone
} from "lucide-react";
import { useState } from "react";

export default function SMSGatewayPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [isSMSEnabled, setIsSMSEnabled] = useState(true);
  
  const [formData, setFormData] = useState({
    provider: "twilio",
    accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authToken: "••••••••••••••••••••••••••••••••",
    senderId: "FLEETPRO",
    testNumber: "+1234567890"
  });

  const handleSave = () => {
    setToastMessage("SMS Gateway settings saved");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsTesting(false);
    setToastMessage("Test SMS sent successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">SMS Gateway</h1>
          <p className="cmd-banner-sub">
            Configure external SMS providers to send alerts and OTPs to drivers and admins.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <div className="flex items-center gap-3 mr-4">
            <span className="text-sm font-bold text-slate-700">Enable SMS:</span>
            <div 
              className={`toggle ${isSMSEnabled ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => setIsSMSEnabled(!isSMSEnabled)}
            >
              <div className="toggle-knob"></div>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in stagger-1 ${!isSMSEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
        
        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" /> Provider Configuration
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMS Provider</label>
              <select 
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900"
              >
                <option value="twilio">Twilio</option>
                <option value="sns">AWS SNS</option>
                <option value="msg91">MSG91</option>
                <option value="custom">Custom Webhook</option>
              </select>
            </div>
            
            <div className="h-px bg-slate-100 my-2"></div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" /> Account SID / API Key
              </label>
              <input 
                type="text" 
                name="accountSid"
                value={formData.accountSid}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" /> Auth Token / Secret
              </label>
              <input 
                type="password" 
                name="authToken"
                value={formData.authToken}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sender ID / From Number</label>
              <input 
                type="text" 
                name="senderId"
                value={formData.senderId}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                Alphanumeric Sender ID (e.g. FLEETPRO) or registered phone number.
              </p>
            </div>
          </div>
        </div>

        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Smartphone size={18} className="text-emerald-500" /> Connection Testing
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Test Phone Number</label>
              <input 
                type="text" 
                name="testNumber"
                value={formData.testNumber}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                placeholder="+1234567890"
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                Include country code. A test message will be sent here.
              </p>
            </div>
            
            <button 
              className="btn btn-secondary w-full justify-center" 
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              <Send size={16} className={isTesting ? "animate-pulse" : "text-blue-500"} /> 
              {isTesting ? "Sending Test SMS..." : "Send Test Message"}
            </button>
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
