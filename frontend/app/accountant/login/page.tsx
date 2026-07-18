"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, LogIn, Loader2, Mail, Lock, ArrowLeft, TrendingUp, DollarSign, Receipt } from "lucide-react";
import Link from "next/link";

export default function AccountantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/portal/accountant/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accountant_token", data.token);
        localStorage.setItem("accountant_profile", JSON.stringify(data.user));
        router.push("/accountant/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError("Network error. Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .acc-root {
          display: flex; width: 100%; min-height: 100vh; overflow-x: hidden; overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        }
        .acc-left {
          flex: 0 0 50%; min-height: 100vh;
          background: #0f172a;
          display: flex; flex-direction: column; justify-content: center;
          padding: 64px 80px; position: relative; overflow: hidden;
        }
        .acc-right {
          flex: 0 0 50%; min-height: 100vh; background: #ffffff;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px; overflow-y: auto;
        }
        
        .acc-bg-glow1 { position: absolute; top: 0; left: 0; width: 500px; height: 500px; background: rgba(79,70,229,0.15); filter: blur(100px); border-radius: 50%; pointer-events: none; }
        .acc-bg-glow2 { position: absolute; bottom: 0; right: 0; width: 600px; height: 600px; background: rgba(37,99,235,0.1); filter: blur(120px); border-radius: 50%; pointer-events: none; }
        
        .acc-left-inner { position: relative; z-index: 10; max-width: 520px; }
        .acc-logo-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          display: flex; align-items: center; justify-content: center; color: #fff;
          box-shadow: 0 8px 24px rgba(79,70,229,0.4); margin-bottom: 32px;
        }
        .acc-hero-heading { font-size: clamp(48px, 5vw, 64px); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.02em; }
        .acc-hero-sub { font-size: 18px; color: rgba(203,213,225,0.9); line-height: 1.6; margin-bottom: 48px; }
        
        .acc-features { display: grid; gap: 16px; }
        .acc-feat-card {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; backdrop-filter: blur(10px);
        }
        .acc-feat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .acc-feat-text { font-size: 15px; font-weight: 700; color: #fff; }
        .acc-feat-sub { font-size: 13px; color: #94a3b8; margin-top: 2px; }
        
        .acc-card {
          width: 100%; max-width: 520px; padding: 48px;
        }
        .acc-card-header { margin-bottom: 40px; }
        .acc-card-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .acc-card-logo-box { width: 40px; height: 40px; border-radius: 10px; background: #0f172a; display: flex; align-items: center; justify-content: center; color: #fff; }
        .acc-card-logo-text { font-size: 18px; font-weight: 800; color: #0f172a; }
        .acc-login-heading { font-size: 42px; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 8px; line-height: 1.1; }
        .acc-login-sub { font-size: 18px; color: #64748b; font-weight: 500; }
        
        .acc-form-section { margin-bottom: 24px; }
        .acc-field { margin-bottom: 16px; }
        .acc-label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .acc-input-wrap { position: relative; }
        .acc-input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .acc-input {
          width: 100%; height: 52px; padding: 0 16px 0 48px;
          background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px;
          font-size: 15px; font-weight: 500; color: #0f172a; outline: none; transition: all 0.2s;
        }
        .acc-input:focus { background: #fff; border-color: #4f46e5; box-shadow: 0 0 0 4px rgba(79,70,229,0.1); }
        
        .acc-form-options { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 24px; }
        .acc-forgot { font-size: 14px; font-weight: 600; color: #4f46e5; text-decoration: none; }
        .acc-forgot:hover { text-decoration: underline; }
        
        .acc-btn {
          width: 100%; height: 52px; background: #0f172a; color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 12px rgba(15,23,42,0.2); transition: all 0.2s;
        }
        .acc-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15,23,42,0.3); }
        .acc-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .acc-back { display: inline-flex; align-items: center; justify-content: flex-start; gap: 8px; margin-bottom: 48px; font-size: 14px; font-weight: 600; color: #64748b; text-decoration: none; }
        .acc-back:hover { color: #0f172a; }
        
        .acc-error { padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #dc2626; font-size: 14px; font-weight: 600; margin-bottom: 24px; }

        @media (max-width: 960px) {
          .acc-root { flex-direction: column; }
          .acc-left { flex: none; width: 100%; padding: 48px 32px; min-height: auto; }
          .acc-right { flex: none; width: 100%; padding: 48px 24px; min-height: auto; }
          .acc-hero-heading { font-size: 40px; }
          .acc-card { padding: 40px 0px; }
        }
        @media (max-width: 480px) {
          .acc-card { padding: 32px 0px; }
          .acc-login-heading { font-size: 32px; }
        }
      `}</style>

      <div className="acc-root">
        {/* Left Panel */}
        <div className="acc-left">
          <div className="acc-bg-glow1" />
          <div className="acc-bg-glow2" />
          
          <div className="acc-left-inner">
            <Link href="/login" className="acc-back" style={{ color: '#94a3b8', marginBottom: '32px' }}>
              <ArrowLeft size={16} /> Back to Main Portal
            </Link>
            
            <div className="acc-logo-icon">
              <Calculator size={32} strokeWidth={2.5} />
            </div>
            <h1 className="acc-hero-heading">
              Control the flow.<br />
              <span style={{ color: '#818cf8' }}>Master the fleet.</span>
            </h1>
            <p className="acc-hero-sub">
              Approve expenses in real-time, monitor batta disbursements, and keep your company's ledger perfectly balanced.
            </p>
            
            <div className="acc-features">
              {[
                { label: "Real-time Expense Auditing", sub: "Verify driver submissions instantly", icon: Receipt, color: "#818cf8" },
                { label: "Automated Ledger Reconciliation", sub: "P&L tracking down to the trip level", icon: DollarSign, color: "#34d399" },
                { label: "Batta Disbursement Tracking", sub: "Live balance monitoring per trip", icon: TrendingUp, color: "#facc15" },
              ].map((f, i) => (
                <div key={i} className="acc-feat-card">
                  <div className="acc-feat-icon" style={{ background: `${f.color}20` }}>
                    <f.icon size={20} color={f.color} />
                  </div>
                  <div>
                    <div className="acc-feat-text">{f.label}</div>
                    <div className="acc-feat-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="acc-right">
          <div className="acc-card">
            <div className="acc-card-header">
              <div className="acc-card-logo">
                <div className="acc-card-logo-box"><Calculator size={20} /></div>
                <div className="acc-card-logo-text">Accountant Portal</div>
              </div>
              <h2 className="acc-login-heading">Finance Sign In</h2>
              <p className="acc-login-sub">Enter your credentials to access the ledger.</p>
            </div>

            {error && <div className="acc-error">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="acc-form-section">
                <div className="acc-field">
                  <label className="acc-label">Email Address</label>
                  <div className="acc-input-wrap">
                    <Mail size={18} className="acc-input-icon" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="acc-input"
                      placeholder="admin@fleet.com"
                    />
                  </div>
                </div>

                <div className="acc-field">
                  <label className="acc-label">Password</label>
                  <div className="acc-input-wrap">
                    <Lock size={18} className="acc-input-icon" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="acc-input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="acc-form-options">
                <Link href="#" className="acc-forgot">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={loading} className="acc-btn">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
                Sign In to Ledger
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

