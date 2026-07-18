"use client";

import { useState } from "react";
import { Globe, Lock, Mail, ArrowLeft, Loader2, ShieldCheck, Activity, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("superadmin@fleetpro.com");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.login(email, password);
      localStorage.setItem("super_admin_token", data.token);
      localStorage.setItem("super_admin_user", JSON.stringify(data.user));
      router.push("/super-admin/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid administrative credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .sa-root {
          display: flex; width: 100%; min-height: 100vh; overflow-x: hidden; overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        }
        .sa-left {
          flex: 0 0 55%; min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e1b4b 100%);
          display: flex; flex-direction: column; justify-content: center;
          padding: 64px 80px; position: relative; overflow: hidden;
        }
        .sa-right {
          flex: 0 0 45%; min-height: 100vh; background: #f8fafc;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px; overflow-y: auto;
        }
        
        .sa-bg-glow1 { position: absolute; top: -10%; left: -10%; width: 60%; height: 60%; background: rgba(99,102,241,0.15); filter: blur(120px); border-radius: 50%; pointer-events: none; }
        .sa-bg-glow2 { position: absolute; bottom: -10%; right: -10%; width: 40%; height: 40%; background: rgba(139,92,246,0.15); filter: blur(100px); border-radius: 50%; pointer-events: none; }
        
        .sa-left-inner { position: relative; z-index: 10; max-width: 560px; }
        .sa-logo-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          display: flex; align-items: center; justify-content: center; color: #fff;
          box-shadow: 0 8px 24px rgba(79,70,229,0.4); margin-bottom: 32px;
        }
        .sa-hero-heading { font-size: clamp(48px, 5vw, 64px); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.02em; }
        .sa-hero-sub { font-size: 18px; color: rgba(203,213,225,0.9); line-height: 1.6; margin-bottom: 48px; }
        
        .sa-features { display: grid; gap: 16px; }
        .sa-feat-card {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; backdrop-filter: blur(10px);
        }
        .sa-feat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .sa-feat-text { font-size: 15px; font-weight: 700; color: #fff; }
        
        .sa-card {
          width: 100%; max-width: 500px; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
          border-radius: 24px; border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1); padding: 48px;
        }
        .sa-card-header { margin-bottom: 32px; }
        .sa-card-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .sa-card-logo-box { width: 40px; height: 40px; border-radius: 10px; background: #0f172a; display: flex; align-items: center; justify-content: center; color: #fff; }
        .sa-card-logo-text { font-size: 18px; font-weight: 800; color: #0f172a; }
        .sa-login-heading { font-size: 42px; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 8px; line-height: 1.1; }
        .sa-login-sub { font-size: 18px; color: #64748b; font-weight: 500; }
        
        .sa-form-section { margin-bottom: 24px; }
        .sa-field { margin-bottom: 16px; }
        .sa-label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .sa-input-wrap { position: relative; }
        .sa-input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .sa-input {
          width: 100%; height: 52px; padding: 0 16px 0 48px;
          background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; font-weight: 500; color: #0f172a; outline: none; transition: all 0.2s;
        }
        .sa-input:focus { background: #fff; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        
        .sa-form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .sa-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .sa-checkbox input { width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid #cbd5e1; accent-color: #4f46e5; cursor: pointer; }
        .sa-checkbox span { font-size: 14px; font-weight: 600; color: #475569; }
        .sa-forgot { font-size: 14px; font-weight: 600; color: #4f46e5; text-decoration: none; }
        .sa-forgot:hover { text-decoration: underline; }
        
        .sa-btn {
          width: 100%; height: 52px; background: #4f46e5; color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 12px rgba(79,70,229,0.3); transition: all 0.2s;
        }
        .sa-btn:hover { background: #4338ca; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(79,70,229,0.4); }
        .sa-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .sa-back { display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 32px; font-size: 14px; font-weight: 600; color: #64748b; text-decoration: none; }
        .sa-back:hover { color: #0f172a; }
        
        .sa-error { padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #dc2626; font-size: 14px; font-weight: 600; margin-bottom: 24px; }

        @media (max-width: 960px) {
          .sa-root { flex-direction: column; }
          .sa-left { flex: none; width: 100%; padding: 48px 32px; min-height: auto; }
          .sa-right { flex: none; width: 100%; padding: 48px 24px; min-height: auto; }
          .sa-hero-heading { font-size: 40px; }
          .sa-card { padding: 40px 24px; }
        }
        @media (max-width: 480px) {
          .sa-card { padding: 32px 24px; border-radius: 20px; }
          .sa-login-heading { font-size: 32px; }
        }
      `}</style>

      <div className="sa-root">
        {/* Left Panel */}
        <div className="sa-left">
          <div className="sa-bg-glow1" />
          <div className="sa-bg-glow2" />
          <div className="sa-left-inner">
            <div className="sa-logo-icon">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <h1 className="sa-hero-heading">Super Admin</h1>
            <p className="sa-hero-sub">
              Platform Control Center. Manage tenants, configure subscriptions, oversee system roles, and monitor global analytics.
            </p>
            <div className="sa-features">
              {[
                { text: "Tenant & Company Management", icon: Users, color: "#6366f1" },
                { text: "Global Analytics & Revenue", icon: Activity, color: "#10b981" },
                { text: "Subscription Configurator", icon: Settings, color: "#f59e0b" },
                { text: "System Access Control", icon: ShieldCheck, color: "#8b5cf6" },
              ].map((f, i) => (
                <div key={i} className="sa-feat-card">
                  <div className="sa-feat-icon" style={{ background: `${f.color}20` }}>
                    <f.icon size={20} color={f.color} />
                  </div>
                  <span className="sa-feat-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="sa-right">
          <div className="sa-card">
            <div className="sa-card-header">
              <div className="sa-card-logo">
                <div className="sa-card-logo-box"><Globe size={20} /></div>
                <div className="sa-card-logo-text">Platform Admin</div>
              </div>
              <h2 className="sa-login-heading">Control Center</h2>
              <p className="sa-login-sub">Secure authentication required.</p>
            </div>

            {error && <div className="sa-error">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="sa-form-section">
                <div className="sa-field">
                  <label className="sa-label">Admin Email</label>
                  <div className="sa-input-wrap">
                    <Mail size={18} className="sa-input-icon" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="sa-input"
                      placeholder="admin@fleetpro.com"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="sa-field">
                  <label className="sa-label">Password</label>
                  <div className="sa-input-wrap">
                    <Lock size={18} className="sa-input-icon" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="sa-input"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              <div className="sa-form-options">
                <label className="sa-checkbox">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span>Remember Me</span>
                </label>
                <Link href="#" className="sa-forgot">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={loading} className="sa-btn">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                Authenticate
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <Link href="/login" className="sa-back">
                <ArrowLeft size={16} /> Back to Main Portals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
