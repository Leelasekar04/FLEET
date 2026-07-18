"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

// ─── Icons (inline SVG — zero dependency) ─────────────────
const IconTruck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const IconDollar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconEye = ({ off }: { off?: boolean }) => off ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconSpinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.5"/>
    <path d="M12 2v4" strokeOpacity="1"/>
  </svg>
);

const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ─── Data ──────────────────────────────────────────────────
const FEATURES = [
  { icon: <IconZap />,    label: "AI Receipt OCR",          sub: "Gemini 2.0 Flash",     color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { icon: <IconPhone />,  label: "WhatsApp Expense Entry",  sub: "Text · Voice · Photo", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  { icon: <IconMap />,    label: "Real-time GPS Tracking",  sub: "Live vehicle locations",color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  { icon: <IconDollar />, label: "Full Accounting Suite",   sub: "P&L · Balance Sheet",  color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
];

const ROLES = [
  { value: "fleet_owner",    label: "Fleet Owner" },
  { value: "branch_manager", label: "Branch Manager" },
  { value: "accountant",     label: "Accountant" },
  { value: "dispatcher",     label: "Dispatcher" },
];

const PORTALS = [
  { href: "/driver/login",       label: "Driver Portal",       icon: <IconUser />,   color: "#0ea5e9" },
  { href: "/accountant/login",   label: "Accountant Portal",   icon: <IconDollar/>,  color: "#8b5cf6" },
  { href: "/super-admin/login",  label: "Super Admin",         icon: <IconShield/>,  color: "#ef4444" },
];

// ─── Main Component ────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [tab,          setTab]          = useState<"password" | "otp">("password");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPass,     setShowPass]     = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [otp,          setOtp]          = useState("");
  const [otpSent,      setOtpSent]      = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await api.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const role = data.user.role?.toLowerCase() || "";
      let dest = "/dashboard";
      if (role === "fleet_manager" || role === "branch_manager") dest = "/fleet";
      else if (role === "dispatcher") dest = "/dispatch";
      else if (role === "driver") dest = "/driver-portal";
      router.push(dest);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          display: flex;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        }

        /* ── LEFT HERO ── */
        .lp-hero {
          flex: 0 0 58%;
          min-height: 100vh;
          background: linear-gradient(150deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 72px 64px;
          position: relative;
          overflow: visible;
        }
        .lp-hero::before {
          content: '';
          position: absolute; top: -200px; right: -200px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-hero::after {
          content: '';
          position: absolute; bottom: -150px; left: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-hero-inner {
          position: relative; z-index: 1;
          width: 100%; max-width: 560px;
          display: flex; flex-direction: column; gap: 0;
        }

        /* logo */
        .lp-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 48px; }
        .lp-logo-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #00d4aa 0%, #3b82f6 100%);
          display: flex; align-items: center; justify-content: center;
          color: #000; flex-shrink: 0;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,212,170,0.3);
        }
        .lp-logo-text { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.2; }
        .lp-logo-sub  { font-size: 10px; font-weight: 700; color: rgba(148,163,184,0.8); letter-spacing: 0.18em; text-transform: uppercase; margin-top: 2px; }

        /* headline */
        .lp-headline {
          font-size: clamp(40px, 4vw, 60px);
          font-weight: 900; color: #fff;
          line-height: 1.08; letter-spacing: -0.03em;
          margin-bottom: 18px;
        }
        .lp-headline span {
          background: linear-gradient(90deg, #00d4aa 0%, #60a5fa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .lp-desc {
          font-size: 15px; font-weight: 500;
          color: rgba(203,213,225,0.85); line-height: 1.65;
          margin-bottom: 36px; max-width: 480px;
        }

        /* feature cards */
        .lp-features { display: flex; flex-direction: column; gap: 10px; }
        .lp-feat {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px; backdrop-filter: blur(8px);
          transition: background 0.2s;
        }
        .lp-feat:hover { background: rgba(255,255,255,0.09); }
        .lp-feat-icon {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .lp-feat-label { font-size: 13px; font-weight: 700; color: #fff; }
        .lp-feat-sub   { font-size: 11px; color: rgba(148,163,184,0.8); margin-top: 1px; }

        /* ── RIGHT PANEL ── */
        .lp-right {
          flex: 0 0 42%;
          min-height: 100vh;
          background: #f8fafc;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px;
          overflow-y: auto;
        }

        /* card */
        .lp-card {
          width: 100%; max-width: 460px;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 60px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02);
          padding: 36px;
        }

        /* card header */
        .lp-card-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
        .lp-card-logo-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
        }
        .lp-card-logo-name { font-size: 14px; font-weight: 800; color: #0f172a; }
        .lp-card-logo-tag  { font-size: 9px; font-weight: 700; color: #94a3b8; letter-spacing: 0.12em; text-transform: uppercase; }

        .lp-welcome { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.025em; margin-bottom: 4px; }
        .lp-subtitle { font-size: 14px; color: #64748b; font-weight: 500; margin-bottom: 24px; }

        /* tabs */
        .lp-tabs {
          display: flex; background: #f1f5f9;
          border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 3px; gap: 3px; margin-bottom: 22px;
        }
        .lp-tab {
          flex: 1; padding: 9px; border: none; border-radius: 8px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: all 0.15s; background: transparent; color: #64748b;
        }
        .lp-tab.active {
          background: #fff; color: #1d4ed8;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
        }

        /* form fields */
        .lp-field { margin-bottom: 14px; }
        .lp-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
        .lp-label-text { font-size: 13px; font-weight: 700; color: #374151; }
        .lp-label-link { font-size: 12px; font-weight: 600; color: #2563eb; text-decoration: none; }
        .lp-label-link:hover { text-decoration: underline; }
        .lp-input-wrap { position: relative; }
        .lp-input {
          width: 100%; height: 44px;
          padding: 0 44px 0 14px;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-size: 14px; font-weight: 500; color: #0f172a;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .lp-input.no-icon { padding-right: 14px; }
        .lp-input:focus {
          border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); background: #fff;
        }
        .lp-input::placeholder { color: #94a3b8; font-weight: 400; }
        .lp-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94a3b8;
          display: flex; align-items: center; padding: 4px; transition: color 0.15s;
        }
        .lp-eye:hover { color: #475569; }

        /* error */
        .lp-error {
          padding: 11px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 9px;
          color: #dc2626; font-size: 13px; font-weight: 600; margin-bottom: 14px;
        }

        /* role grid */
        .lp-roles-label { font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 9px; }
        .lp-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .lp-role {
          height: 42px; border-radius: 10px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          border: 1.5px solid #e2e8f0; background: #fff; color: #475569;
          transition: all 0.15s; display: flex; align-items: center; justify-content: center;
        }
        .lp-role:hover { border-color: #cbd5e1; background: #f8fafc; color: #0f172a; }
        .lp-role.selected {
          border-color: #2563eb; background: #eff6ff; color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
        }

        /* sign in button */
        .lp-btn {
          width: 100%; height: 48px;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          transition: all 0.2s; letter-spacing: 0.01em;
        }
        .lp-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(37,99,235,0.4); }
        .lp-btn:active { transform: translateY(0); }
        .lp-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        /* divider */
        .lp-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 14px; }
        .lp-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .lp-divider-text { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }

        /* portals */
        .lp-portals { display: flex; gap: 8px; }
        .lp-portal {
          flex: 1; height: 40px; border-radius: 9px;
          border: 1.5px solid #e2e8f0; background: #f8fafc;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          font-size: 12px; font-weight: 700; color: #475569;
          text-decoration: none; transition: all 0.15s;
        }
        .lp-portal:hover { border-color: #cbd5e1; background: #fff; color: #0f172a; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        /* terms */
        .lp-terms { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 16px; line-height: 1.6; }
        .lp-terms a { color: #2563eb; font-weight: 600; text-decoration: none; }
        .lp-terms a:hover { text-decoration: underline; }

        /* otp */
        .lp-otp { text-align: center; letter-spacing: 0.5em; font-size: 20px; font-family: monospace; font-weight: 700; }

        /* spinner */
        @keyframes lp-spin { to { transform: rotate(360deg); } }
        .lp-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
          animation: lp-spin 0.65s linear infinite; flex-shrink: 0;
        }

        /* phone row */
        .lp-phone-row { display: flex; gap: 8px; }
        .lp-phone-code {
          height: 44px; padding: 0 14px;
          background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 14px; font-weight: 700; color: #475569;
          display: flex; align-items: center; flex-shrink: 0;
        }

        /* grid bg */
        .lp-grid-bg {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px; pointer-events: none;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .lp-root { flex-direction: column; }
          .lp-hero { flex: none; width: 100%; min-height: auto; padding: 56px 40px; align-items: flex-start; }
          .lp-right { flex: none; width: 100%; min-height: auto; padding: 40px 24px 56px; }
        }
        @media (max-width: 540px) {
          .lp-hero { padding: 40px 24px; }
          .lp-headline { font-size: 34px; }
          .lp-card { padding: 28px 22px; border-radius: 18px; }
          .lp-welcome { font-size: 24px; }
          .lp-right { padding: 32px 16px 48px; }
        }
      `}</style>

      <div className="lp-root">

        {/* ══════════════════════════════════════════
            HERO SECTION — LEFT
        ══════════════════════════════════════════ */}
        <div className="lp-hero">
          <div className="lp-grid-bg" />
          <div className="lp-hero-inner">

            {/* Logo */}
            <div className="lp-logo">
              <div className="lp-logo-icon">
                <IconTruck />
              </div>
              <div>
                <div className="lp-logo-text">FleetManager Pro</div>
                <div className="lp-logo-sub">Enterprise Edition</div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="lp-headline">
              Manage your fleet<br />
              <span>smarter, faster.</span>
            </h1>

            <p className="lp-desc">
              WhatsApp-first expense tracking, AI receipt OCR, real-time GPS, and full accounting — all in one platform built for enterprise fleets.
            </p>

            {/* Feature Cards */}
            <div className="lp-features">
              {FEATURES.map((f) => (
                <div key={f.label} className="lp-feat">
                  <div className="lp-feat-icon" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="lp-feat-label">{f.label}</div>
                    <div className="lp-feat-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════
            LOGIN SECTION — RIGHT
        ══════════════════════════════════════════ */}
        <div className="lp-right">
          <div className="lp-card">

            {/* Card Logo */}
            <div className="lp-card-logo">
              <div className="lp-card-logo-icon"><IconTruck /></div>
              <div>
                <div className="lp-card-logo-name">FleetManager Pro</div>
                <div className="lp-card-logo-tag">Enterprise Dashboard</div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="lp-welcome">Welcome back</h2>
            <p className="lp-subtitle">Sign in to your fleet command center</p>

            {/* Tabs */}
            <div className="lp-tabs">
              {[{ k: "password", l: "Email & Password" }, { k: "otp", l: "OTP Login" }].map((t) => (
                <button key={t.k} className={`lp-tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k as any)}>
                  {t.l}
                </button>
              ))}
            </div>

            {/* ── PASSWORD TAB ── */}
            {tab === "password" && (
              <form onSubmit={login}>
                {error && <div className="lp-error">{error}</div>}

                {/* Email */}
                <div className="lp-field">
                  <div className="lp-label">
                    <span className="lp-label-text">Email Address</span>
                  </div>
                  <div className="lp-input-wrap">
                    <input
                      className="lp-input no-icon"
                      type="email"
                      placeholder="admin@yourfleet.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="lp-field">
                  <div className="lp-label">
                    <span className="lp-label-text">Password</span>
                    <Link href="/forgot-password" className="lp-label-link">Forgot password?</Link>
                  </div>
                  <div className="lp-input-wrap">
                    <input
                      className="lp-input"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button type="button" className="lp-eye" onClick={() => setShowPass(!showPass)}>
                      <IconEye off={showPass} />
                    </button>
                  </div>
                </div>

                {/* Role Selector */}
                <div style={{ marginBottom: "22px" }}>
                  <div className="lp-roles-label">Login as</div>
                  <div className="lp-roles">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        className={`lp-role ${selectedRole === r.value ? "selected" : ""}`}
                        onClick={() => setSelectedRole(r.value)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sign In */}
                <button type="submit" className="lp-btn" disabled={loading}>
                  {loading ? <span className="lp-spinner" /> : <>Sign In &nbsp;<IconArrow /></>}
                </button>
              </form>
            )}

            {/* ── OTP TAB ── */}
            {tab === "otp" && (
              <div>
                <div className="lp-field">
                  <div className="lp-label"><span className="lp-label-text">WhatsApp / Mobile Number</span></div>
                  <div className="lp-phone-row">
                    <div className="lp-phone-code">+91</div>
                    <div className="lp-input-wrap" style={{ flex: 1 }}>
                      <input
                        className="lp-input no-icon"
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    className="lp-btn"
                    onClick={() => { if (phone.length >= 10) setOtpSent(true); }}
                  >
                    Send OTP &nbsp;<IconArrow />
                  </button>
                ) : (
                  <>
                    <div className="lp-field">
                      <div className="lp-label"><span className="lp-label-text">Enter 6-digit OTP</span></div>
                      <input
                        className="lp-input lp-otp no-icon"
                        type="text"
                        maxLength={6}
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <p style={{ textAlign: "center", fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
                        OTP sent to +91 {phone} ·{" "}
                        <button type="button" onClick={() => setOtpSent(false)} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}>
                          Resend
                        </button>
                      </p>
                    </div>
                    <button type="button" className="lp-btn">
                      Verify & Sign In &nbsp;<IconArrow />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Other Portals */}
            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">Other Portals</span>
              <div className="lp-divider-line" />
            </div>

            <div className="lp-portals">
              {PORTALS.map((p) => (
                <Link key={p.href} href={p.href} className="lp-portal">
                  <span style={{ color: p.color, display: "flex", alignItems: "center" }}>{p.icon}</span>
                  {p.label}
                </Link>
              ))}
            </div>

            <p className="lp-terms">
              By signing in you agree to our{" "}
              <a href="#">Terms of Service</a> &amp; <a href="#">Privacy Policy</a>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}
