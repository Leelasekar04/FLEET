"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Route, Receipt, PlusCircle, Filter, Loader2, CheckCircle, Clock, XCircle, Search, Upload, FileText, ZoomIn, X, Plus, Wallet } from "lucide-react";

import { useDriverSync } from "@/hooks/useDriverSync";
import { fmt } from "@/lib/api";

export default function DriverExpenseHistoryPage() {
  const router = useRouter();
  const { expenses, loading } = useDriverSync();
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <span className="badge badge-completed">Approved</span>;
      case "Rejected": return <span className="badge badge-danger">Rejected</span>;
      default: return <span className="badge badge-warning">Pending</span>;
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
          window.location.reload(); // Simple reload to refresh data
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

  const filteredExpenses = expenses.filter(exp => {
    if (filterType && exp.expense_type !== filterType) return false;
    if (filterStatus && exp.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="cmd-root p-6 max-w-7xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">My Expenses</h1>
          <p className="cmd-banner-sub">
            Track out-of-pocket expenses, toll charges, food allowances, and reimbursements.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <Link href="/driver/expenses/add" className="btn btn-primary btn-sm">
            <Plus size={16} /> New Expense
          </Link>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-48">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input !h-10 text-sm font-semibold text-slate-700"
          >
            <option value="">All Types</option>
            <option value="Fuel">Fuel</option>
            <option value="Batta">Batta</option>
            <option value="Toll">Toll</option>
            <option value="Parking">Parking</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Food">Food</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input !h-10 text-sm font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Expenses Table ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <Wallet size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No expenses found</h3>
            <p className="text-sm max-w-sm mx-auto">
              You don't have any expenses matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Trip</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Details & Comments</th>
                  <th>Status</th>
                  <th className="text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td>
                      <div className="text-sm font-semibold text-slate-900">
                        {fmt.date(exp.expense_date)}
                      </div>
                      {exp.trips && exp.trips.id && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Route size={10} /> Trip #{exp.trips.id.substring(0,6)}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="text-sm font-bold text-slate-700">{exp.expense_type}</div>
                    </td>
                    <td>
                      <div className="text-sm font-bold text-slate-900">
                        ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="max-w-xs">
                      {exp.description ? (
                        <div className="text-xs text-slate-700 font-medium truncate" title={exp.description}>
                          {exp.description}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                      {exp.accountant_comments && (
                        <div className={`mt-1 text-[11px] font-semibold flex items-center gap-1 ${exp.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                          <span>Note: {exp.accountant_comments}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      {getStatusBadge(exp.status)}
                    </td>
                    <td className="text-right">
                      {exp.receipt_url ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setViewReceiptUrl(exp.receipt_url); }}
                          className="btn btn-secondary btn-sm !h-8 !px-2 w-24"
                        >
                          <ZoomIn size={14} /> View
                        </button>
                      ) : (
                        <label className={`btn btn-secondary btn-sm !h-8 !px-2 w-24 cursor-pointer flex items-center justify-center ${uploadingId === exp.id ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingId === exp.id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          <span className="ml-1">Upload</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleExistingReceiptUpload(e, exp.id)} disabled={uploadingId === exp.id} />
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
    </div>
  );
}
