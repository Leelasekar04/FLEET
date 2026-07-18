"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, LogIn, Phone, Lock, ArrowLeft, Loader2, MapPin, Receipt, Bell } from "lucide-react";
import Link from "next/link";

export default function DriverLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/portal/driver/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("driver_token", data.token);
        localStorage.setItem("driver_profile", JSON.stringify(data.driver));
        router.push("/driver/dashboard");
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
        .drv-root {
          display: flex; width: 100%; min-height: 100vh; overflow-x: hidden; overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        }
        .drv-left {
          flex: 0 0 55%; min-height: 100vh;
          background: linear-gradient(135deg, #0a0f1e 0%, #1e3a8a 100%);
          display: flex; flex-direction: column; justify-content: center;
          padding: 64px 80px; position: relative; overflow: hidden;
        }
        .drv-right {
          flex: 0 0 45%; min-height: 100vh; background: #f8fafc;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px; overflow-y: auto;
        }
        
        .drv-bg-glow1 { position: absolute; top: -10%; left: -10%; width: 60%; height: 60%; background: rgba(59,130,246,0.15); filter: blur(120px); border-radius: 50%; pointer-events: none; }
        .drv-bg-glow2 { position: absolute; bottom: -10%; right: -10%; width: 40%; height: 40%; background: rgba(56,189,248,0.1); filter: blur(100px); border-radius: 50%; pointer-events: none; }
        
        .drv-left-inner { position: relative; z-index: 10; max-width: 560px; }
        .drv-logo-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          display: flex; align-items: center; justify-content: center; color: #fff;
          box-shadow: 0 8px 24px rgba(37,99,235,0.4); margin-bottom: 32px;
        }
        .drv-hero-heading { font-size: clamp(48px, 5vw, 64px); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.02em; }
        .drv-hero-sub { font-size: 18px; color: rgba(203,213,225,0.9); line-height: 1.6; margin-bottom: 48px; }
        
        .drv-features { display: grid; gap: 16px; }
        .drv-feat-card {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; backdrop-filter: blur(10px);
        }
        .drv-feat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .drv-feat-text { font-size: 15px; font-weight: 700; color: #fff; }
        
        .drv-card {
          width: 100%; max-width: 500px; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
          border-radius: 24px; border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1); padding: 48px;
        }
        .drv-card-header { margin-bottom: 32px; }
        .drv-card-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .drv-card-logo-box { width: 40px; height: 40px; border-radius: 10px; background: #1e3a8a; display: flex; align-items: center; justify-content: center; color: #fff; }
        .drv-card-logo-text { font-size: 18px; font-weight: 800; color: #0f172a; }
        .drv-login-heading { font-size: 42px; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 8px; line-height: 1.1; }
        .drv-login-sub { font-size: 18px; color: #64748b; font-weight: 500; }
        
        .drv-form-section { margin-bottom: 24px; }
        .drv-field { margin-bottom: 16px; }
        .drv-label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .drv-input-wrap { position: relative; }
        .drv-input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .drv-input {
          width: 100%; height: 52px; padding: 0 16px 0 48px;
          background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; font-weight: 500; color: #0f172a; outline: none; transition: all 0.2s;
        }
        .drv-input:focus { background: #fff; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
        
        .drv-form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .drv-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .drv-checkbox input { width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid #cbd5e1; accent-color: #1d4ed8; cursor: pointer; }
        .drv-checkbox span { font-size: 14px; font-weight: 600; color: #475569; }
        .drv-forgot { font-size: 14px; font-weight: 600; color: #2563eb; text-decoration: none; }
        .drv-forgot:hover { text-decoration: underline; }
        
        .drv-btn {
          width: 100%; height: 52px; background: #1d4ed8; color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 12px rgba(29,78,216,0.3); transition: all 0.2s;
        }
        .drv-btn:hover { background: #1e40af; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(29,78,216,0.4); }
        .drv-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .drv-back { display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 32px; font-size: 14px; font-weight: 600; color: #64748b; text-decoration: none; }
        .drv-back:hover { color: #0f172a; }
        
        .drv-error { padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #dc2626; font-size: 14px; font-weight: 600; margin-bottom: 24px; }

        @media (max-width: 960px) {
          .drv-root { flex-direction: column; }
          .drv-left { flex: none; width: 100%; padding: 48px 32px; min-height: auto; }
          .drv-right { flex: none; width: 100%; padding: 48px 24px; min-height: auto; }
          .drv-hero-heading { font-size: 40px; }
          .drv-card { padding: 40px 24px; }
        }
        @media (max-width: 480px) {
          .drv-card { padding: 32px 24px; border-radius: 20px; }
          .drv-login-heading { font-size: 32px; }
        }
      `}</style>

      <div className="drv-root">
        {/* Left Panel */}
        <div className="drv-left">
          <div className="drv-bg-glow1" />
          <div className="drv-bg-glow2" />
          <div className="drv-left-inner">
            <div className="drv-logo-icon">
              <Truck size={32} strokeWidth={2.5} />
            </div>
            <h1 className="drv-hero-heading">Driver Portal</h1>
            <p className="drv-hero-sub">
              Access your trips, log expenses, track fuel usage, and manage your assigned vehicles in real-time.
            </p>
            <div className="drv-features">
              {[
                { text: "Assigned Trips", icon: MapPin, color: "#3b82f6" },
                { text: "Vehicle Tracking", icon: Truck, color: "#10b981" },
                { text: "Expense Submission", icon: Receipt, color: "#f59e0b" },
                { text: "Real-time Updates", icon: Bell, color: "#8b5cf6" },
              ].map((f, i) => (
                <div key={i} className="drv-feat-card">
                  <div className="drv-feat-icon" style={{ background: `${f.color}20` }}>
                    <f.icon size={20} color={f.color} />
                  </div>
                  <span className="drv-feat-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="drv-right">
          <div className="drv-card">
            <div className="drv-card-header">
              <div className="drv-card-logo">
                <div className="drv-card-logo-box"><Truck size={20} /></div>
                <div className="drv-card-logo-text">Driver Portal</div>
              </div>
              <h2 className="drv-login-heading">Welcome Driver</h2>
              <p className="drv-login-sub">Log in securely to access your dashboard.</p>
            </div>

            {error && <div className="drv-error">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="drv-form-section">
                <div className="drv-field">
                  <label className="drv-label">Mobile Number / Employee ID</label>
                  <div className="drv-input-wrap">
                    <Phone size={18} className="drv-input-icon" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="drv-input"
                      placeholder="Enter your ID or Phone"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="drv-field">
                  <label className="drv-label">Password</label>
                  <div className="drv-input-wrap">
                    <Lock size={18} className="drv-input-icon" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="drv-input"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              <div className="drv-form-options">
                <label className="drv-checkbox">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span>Remember Me</span>
                </label>
                <Link href="#" className="drv-forgot">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={loading} className="drv-btn">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
                Sign In to Portal
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <Link href="/login" className="drv-back">
                <ArrowLeft size={16} /> Back to Main Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

