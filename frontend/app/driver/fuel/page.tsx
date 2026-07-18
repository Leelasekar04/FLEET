"use client";

import { useState, useEffect } from "react";
import { Fuel, Plus, Loader2, X, Calendar, FileText, Upload, ZoomIn, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useDriverSync } from "@/hooks/useDriverSync";
import { api } from "@/lib/api";

export default function DriverFuelPage() {
  const { expenses, loading, refetch, driverMe } = useDriverSync();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Filter for only Fuel entries
  const entries = expenses.filter(e => e.expense_type === "Fuel");
  
  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [odometer, setOdometer] = useState("");
  const [station, setStation] = useState("");
  const [liters, setLiters] = useState("");
  
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExistingReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("driver_token");
        const res = await fetch(`http://localhost:4000/api/portal/driver/expenses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ receipt_url: reader.result as string })
        });
        if (res.ok) {
          refetch();
        } else {
          alert("Failed to upload receipt");
        }
      } catch (err) {
        console.error(err);
        alert("Network error");
      } finally {
        setUploadingId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const activeTrip = driverMe?.driver?.trips?.find((t: any) => t.status === "active" || t.status === "started" || t.status === "in_progress");
      const vehicleId = driverMe?.assignedVehicle?.id;
      
      const fullDesc = `Station: ${station} | Odometer: ${odometer} km | Liters: ${liters}L | ${description}`;
      
      await api.submitDriverExpense({
        expense_type: "Fuel",
        amount: parseFloat(amount),
        description: fullDesc,
        expense_date: date,
        vehicle_id: vehicleId,
        trip_id: activeTrip ? activeTrip.id : undefined,
        receipt_url: receiptUrl
      });

      setIsModalOpen(false);
      setAmount("");
      setDescription("");
      setReceiptUrl("");
      setOdometer("");
      setStation("");
      setLiters("");
      setDate(new Date().toISOString().split("T")[0]);
      refetch(); // Refresh list
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit fuel entry");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="cmd-root p-6 max-w-7xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Fuel Entries</h1>
          <p className="cmd-banner-sub">
            Log fuel stops, upload receipts, and track fuel consumption.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> New Fuel Entry
          </button>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-1">
        {entries.length === 0 ? (
          <div className="empty-state">
            <Fuel size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No fuel entries</h3>
            <p className="max-w-sm mx-auto">
              You haven't logged any fuel entries recently.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th className="text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id}>
                    <td>
                      <div className="text-sm font-semibold text-slate-900">
                        {new Date(entry.expense_date || entry.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-bold text-slate-900">₹{parseFloat(entry.amount).toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-600 max-w-xs truncate">
                        {entry.description || "No remarks"}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        entry.status === 'Approved' ? 'badge-active' :
                        entry.status === 'Rejected' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {entry.receipt_url ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setViewReceiptUrl(entry.receipt_url); }}
                          className="btn btn-secondary btn-sm !h-8 !px-2"
                        >
                          <ZoomIn size={14} /> View
                        </button>
                      ) : (
                        <label className={`btn btn-secondary btn-sm !h-8 !px-2 cursor-pointer ${uploadingId === entry.id ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingId === entry.id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          <span className="hidden sm:inline ml-1">Upload</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleExistingReceiptUpload(e, entry.id)} disabled={uploadingId === entry.id} />
                        </label>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Lightbox */}
      {viewReceiptUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in"
          onClick={() => setViewReceiptUrl(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setViewReceiptUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 flex items-center gap-1 text-sm font-bold transition-colors"
            >
              <X size={18} /> Close
            </button>
            <img
              src={viewReceiptUrl}
              alt="Receipt"
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Add Fuel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Fuel size={18} className="text-blue-600" /> Log Fuel Entry
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date</label>
                  <input 
                    type="date" required
                    value={date} onChange={e => setDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Total Cost (₹)</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    className="form-input" placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Fuel Amount (Liters)</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={liters} onChange={e => setLiters(e.target.value)}
                    className="form-input" placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="form-label">Odometer (km)</label>
                  <input 
                    type="number" required min="0"
                    value={odometer} onChange={e => setOdometer(e.target.value)}
                    className="form-input" placeholder="124500"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Fuel Station Details</label>
                <input 
                  type="text" required
                  value={station} onChange={e => setStation(e.target.value)}
                  className="form-input" placeholder="e.g. BP Bunk, Highway A4"
                />
              </div>

              <div>
                <label className="form-label">Attach Receipt</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-400 transition-colors">
                    <Upload size={20} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Select Image...</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  {receiptUrl && (
                    <div className="w-20 h-20 shrink-0 rounded-xl border border-slate-200 overflow-hidden shadow-sm relative group">
                      <img src={receiptUrl} alt="Receipt preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setReceiptUrl("")} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Fuel size={18} />}
                  {submitting ? "Saving Entry..." : "Save Fuel Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
