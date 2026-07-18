"use client";

import { useState } from "react";
import { AlertTriangle, Send, CheckCircle, Loader2 } from "lucide-react";
import { useDriverSync } from "@/hooks/useDriverSync";

export default function DriverSupportPage() {
  const { driverMe, loading } = useDriverSync();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [issueType, setIssueType] = useState("vehicle");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setDescription("");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const v = driverMe?.assignedVehicle;

  return (
    <div className="cmd-root p-6 max-w-3xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Report Issue</h1>
          <p className="cmd-banner-sub">
            Experiencing problems with your vehicle or trip? Let us know immediately.
          </p>
        </div>
      </div>

      <div className="mt-6 cmd-chart-card animate-fade-in stagger-1">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Issue Reported Successfully</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Our support team has been notified and will contact you shortly to resolve this problem.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn btn-secondary"
            >
              Report Another Issue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
              <AlertTriangle size={20} className="shrink-0" />
              <p className="text-sm font-semibold">
                For emergency accidents, please call fleet support immediately at <span className="font-bold underline">+91 1800 123 4567</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Issue Category</label>
                <select 
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="vehicle">Vehicle Breakdown / Defect</option>
                  <option value="accident">Accident / Damage</option>
                  <option value="fuel">Fuel Card / Fastag Issue</option>
                  <option value="app">App / Account Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Assigned Vehicle</label>
                <input 
                  type="text" 
                  value={v ? v.vehicle_number : "No active vehicle assigned"} 
                  disabled
                  className="form-input bg-slate-50 opacity-75 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Issue Description</label>
              <textarea 
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail. Include locations, error codes, or other relevant information."
                className="form-input resize-none"
                required
              ></textarea>
              <p className="mt-2 text-xs text-slate-500 font-medium">Please be as descriptive as possible so our maintenance team can assist you efficiently.</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={submitting || !description.trim()}
                className="btn btn-primary min-w-[150px]"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
