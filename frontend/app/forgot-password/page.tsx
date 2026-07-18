"use client";
import { useState } from "react";
import Link from "next/link";
import { Truck, ArrowLeft, Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(ellipse at top, #0d1a35 0%, #0a0f1e 60%)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#3b82f6] flex items-center justify-center">
            <Truck size={20} color="#000" strokeWidth={2.5} />
          </div>
          <div className="text-lg font-bold text-white">FleetManager Pro</div>
        </div>

        <div className="glass-card p-8">
          {!sent ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
                <p className="text-sm text-[#9ca3af]">
                  Enter your email address and we'll send a reset link.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                    <input
                      className="form-input pl-9"
                      type="email"
                      placeholder="owner@yourfleet.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
                  {loading
                    ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    : <><span>Send Reset Link</span><ArrowRight size={15} /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#00d4aa]/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} color="#00d4aa" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
              <p className="text-sm text-[#9ca3af] mb-6">
                We sent a password reset link to<br />
                <span className="text-white font-medium">{email}</span>
              </p>
              <button className="btn btn-secondary w-full justify-center" onClick={() => setSent(false)}>
                Resend email
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/8 text-center">
            <Link href="/login" className="text-sm text-[#00d4aa] hover:underline flex items-center gap-1 justify-center">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
