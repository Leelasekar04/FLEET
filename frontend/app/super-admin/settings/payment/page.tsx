"use client";

import { 
  Save, 
  CheckCircle2, 
  CreditCard,
  Building,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  Link2,
  DollarSign
} from "lucide-react";
import { useState } from "react";

export default function PaymentGatewaySettingsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  
  const [formData, setFormData] = useState({
    activeGateway: "Stripe",
    currency: "USD",
    stripePublishableKey: "publishable_key_placeholder",
    stripeSecretKey: "secret_key_placeholder",
    stripeWebhookSecret: "webhook_secret_placeholder",
    testMode: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    showToast("Payment Gateway settings saved successfully");
  };

  const handleTestConnection = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSyncing(false);
    showToast("Connection to Stripe successful!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Payment Gateway</h1>
          <p className="cmd-banner-sub">
            Configure payment processors for subscription billing, automated invoicing, and tenant charges.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleTestConnection}
            disabled={isSyncing}
          >
            <RefreshCw size={16} className={isSyncing ? "animate-spin text-blue-500" : "text-blue-500"} /> 
            {isSyncing ? "Testing..." : "Test Connection"}
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
        
        {/* General Configuration */}
        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-500" /> General Configuration
          </h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building size={12} className="text-slate-400" /> Active Gateway
                </label>
                <select 
                  name="activeGateway"
                  value={formData.activeGateway}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900"
                >
                  <option value="Stripe">Stripe</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Authorize.net">Authorize.net</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <DollarSign size={12} className="text-slate-400" /> Default Currency
                </label>
                <select 
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <input
                type="checkbox"
                id="testMode"
                name="testMode"
                checked={formData.testMode}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <label htmlFor="testMode" className="text-sm font-bold text-slate-900 cursor-pointer">Enable Test Mode (Sandbox)</label>
                <p className="text-xs text-slate-500 mt-0.5">While in test mode, no real charges will be processed. Use this for testing integrations safely.</p>
              </div>
            </div>
            
            {formData.testMode && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">Sandbox Environment Active</h4>
                  <p className="text-xs text-amber-700 mt-0.5">Please ensure you use sandbox API keys below. Do not use production keys in test mode.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Credentials */}
        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Key size={18} className="text-emerald-500" /> Stripe API Credentials
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Publishable Key</label>
              <input 
                type="text" 
                name="stripePublishableKey"
                value={formData.stripePublishableKey}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                Found in your Stripe Developer Dashboard under API keys.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Secret Key</label>
              <div className="relative">
                <input 
                  type={showSecretKey ? "text" : "password"}
                  name="stripeSecretKey"
                  value={formData.stripeSecretKey}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900 pr-10" 
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Link2 size={12} className="text-slate-400" /> Webhook Signing Secret
              </label>
              <input 
                type="password" 
                name="stripeWebhookSecret"
                value={formData.stripeWebhookSecret}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                Used to verify that webhook events actually came from Stripe. Required for subscription lifecycle updates.
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
