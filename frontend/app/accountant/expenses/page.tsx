"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Calculator, FileText, CheckCircle, Clock, XCircle, LayoutDashboard, Search, Filter, MessageSquare, Loader2, Download, UploadCloud, Image, RefreshCw } from "lucide-react";
import { useFleetStore } from "@/lib/store";

export default function AccountantExpensesPage() {
  const router = useRouter();
  const localStoreExpenses = useFleetStore(state => state.expenses);
  const [backendExpenses, setBackendExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [typeFilter, setTypeFilter] = useState("");
  
  // Action state
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("accountant_token");
    if (!token) {
      router.push("/accountant/login");
      return;
    }
    fetchExpenses(token);
  }, [router]);

  const fetchExpenses = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/portal/accountant/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBackendExpenses(data);
      } else if(res.status === 401 || res.status === 403) {
        router.push("/accountant/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("accountant_token");
    setActionLoading(id);
    try {
      const isLocalExp = localStoreExpenses.some(e => e.id === id);
      
      if (id.toString().startsWith("0.") || isLocalExp) {
        // Dummy ID from Zustand or local mock data, just fake success
        setLocalStatuses(prev => ({ ...prev, [id]: newStatus }));
        setActiveCommentId(null);
        setCommentText("");
        return;
      }

      const res = await fetch(`http://localhost:4000/api/portal/accountant/expenses/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, accountant_comments: commentText })
      });
      if (res.ok) {
        // Optimistic update
        setBackendExpenses(backendExpenses.map(exp => exp.id === id ? { ...exp, status: newStatus, accountant_comments: commentText } : exp));
        setActiveCommentId(null);
        setCommentText("");
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };


  const combinedExpenses = [
    ...backendExpenses,
    ...localStoreExpenses.map(exp => ({
      id: exp.id,
      expense_type: exp.type,
      amount: exp.amount,
      status: localStatuses[exp.id] || "Pending",
      expense_date: exp.created_at,
      created_at: exp.created_at,
      drivers: { name: exp.driver },
      vehicles: { vehicle_number: "Unknown" },
      trips: { id: exp.trip },
      description: exp.notes,
      receipt_url: null,
      isLocal: true
    }))
  ];

  const filteredExpenses = combinedExpenses.filter(exp => {
    if (statusFilter && exp.status !== statusFilter) return false;
    if (typeFilter && exp.expense_type !== typeFilter) return false;
    return true;
  });

  const handleDownloadCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No expenses to export.");
      return;
    }

    const headers = [
      "Date",
      "Type",
      "Amount",
      "Status",
      "Driver",
      "Vehicle",
      "Trip ID",
      "Description",
      "Accountant Comments"
    ];

    const csvRows = [headers.join(",")];

    for (const exp of filteredExpenses) {
      const row = [
        `"${new Date(exp.expense_date).toLocaleDateString()}"`,
        `"${exp.expense_type || ''}"`,
        exp.amount,
        `"${exp.status || ''}"`,
        `"${exp.drivers?.name || ''}"`,
        `"${exp.vehicles?.vehicle_number || ''}"`,
        `"${exp.trips?.id || ''}"`,
        `"${(exp.description || '').replace(/"/g, '""')}"`,
        `"${(exp.accountant_comments || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cmd-root max-w-[1400px] mx-auto">
      
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Review Expenses</h1>
          <p className="cmd-banner-sub">
            Review, approve, or reject expenses submitted by drivers across all branches.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleDownloadCSV}>
            <Download size={16} className="text-blue-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['Pending', 'Approved', 'Rejected', ''].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {status === '' ? 'All Statuses' : status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
            <Filter size={14} /> Type:
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-48"
          >
            <option value="">All Categories</option>
            <option value="Fuel">Fuel</option>
            <option value="Batta">Batta</option>
            <option value="Toll">Toll</option>
            <option value="Parking">Parking</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* ── Expenses List ── */}
      <div className="mt-6 animate-fade-in stagger-2">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-slate-900" size={32} />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No expenses found</h3>
              <p className="text-sm text-slate-500">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExpenses.map(exp => (
                <div 
                  key={exp.id} 
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center cursor-pointer hover:border-blue-300 hover:shadow-md transition-all p-5 gap-6"
                  onClick={() => setSelectedExpense(exp)}
                >
                  {/* Left: Type & Amount */}
                  <div className="flex-shrink-0 w-full md:w-48">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{new Date(exp.expense_date).toLocaleDateString()}</div>
                    <div className="text-xl font-black text-slate-900 leading-tight">{exp.expense_type}</div>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mt-0.5">₹{parseFloat(exp.amount).toLocaleString('en-IN')}</div>
                  </div>

                  {/* Middle: Details & Description */}
                  <div className="flex-1 w-full md:border-l md:border-slate-100 md:pl-6 flex flex-col md:flex-row gap-6">
                     <div className="space-y-1.5 w-full md:w-1/2">
                        <div className="text-sm font-semibold text-slate-800 flex justify-between">
                          <span className="text-slate-500">Driver:</span> {exp.drivers?.name || 'Unknown'}
                        </div>
                        {exp.vehicles?.vehicle_number && (
                          <div className="text-sm font-semibold text-slate-800 flex justify-between">
                            <span className="text-slate-500">Vehicle:</span> {exp.vehicles.vehicle_number}
                          </div>
                        )}
                        {exp.trips?.id && (
                          <div className="text-sm font-semibold text-slate-800 flex justify-between">
                            <span className="text-slate-500">Trip:</span> <span className="text-blue-600">#{exp.trips.id.substring(0,6)}</span>
                          </div>
                        )}
                        
                        <div className="pt-2 mt-2 border-t border-slate-100">
                          {exp.receipt_url ? (
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <Image size={14} />
                              <span className="text-xs font-bold">Receipt Attached</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <FileText size={14} />
                              <span className="text-xs font-semibold">No Receipt</span>
                            </div>
                          )}
                        </div>
                     </div>
                     <div className="flex-1 w-full">
                        <div className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Remarks</div>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 h-20 overflow-hidden line-clamp-3">
                          {exp.description || <span className="italic text-slate-400">No remarks provided</span>}
                        </p>
                     </div>
                  </div>

                  {/* Right: Actions / Status */}
                  <div className="flex-shrink-0 w-full md:w-56 flex flex-col justify-between items-end gap-4 md:border-l md:border-slate-100 md:pl-6 min-h-[110px]" onClick={(e) => e.stopPropagation()}>
                    
                    <div className="w-full flex justify-end">
                      <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                          exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          exp.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {exp.status}
                      </div>
                    </div>

                    {exp.status === 'Pending' && (
                      <div className="w-full flex gap-2 mt-auto">
                        <button
                          disabled={actionLoading === exp.id}
                          onClick={() => handleStatusUpdate(exp.id, 'Approved')}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {actionLoading === exp.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} className="text-emerald-400"/>} Approve
                        </button>
                        <button
                          disabled={actionLoading === exp.id}
                          onClick={() => handleStatusUpdate(exp.id, 'Rejected')}
                          className="flex-1 py-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {actionLoading === exp.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* EXPENSE REVIEW MODAL */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {/* Image Side */}
            <div className="md:w-1/2 bg-slate-900 flex flex-col items-center justify-center min-h-[300px] md:min-h-[600px] relative p-6">
              {selectedExpense.receipt_url ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black/20 rounded-xl overflow-hidden p-2 border border-slate-700 group/img">
                  <img src={selectedExpense.receipt_url} alt="Receipt" className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl" />
                  <label className="absolute bottom-4 right-4 cursor-pointer inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-slate-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xl transition-all opacity-0 group-hover/img:opacity-100 z-10">
                    <UploadCloud size={16} /> Update Receipt
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setSelectedExpense({ ...selectedExpense, receipt_url: url });
                      }
                    }} />
                  </label>
                </div>
              ) : (
                <div className="text-center text-slate-400 bg-slate-800/50 w-full h-full rounded-xl border border-slate-700 border-dashed flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500 shadow-inner">
                    <FileText size={32} />
                  </div>
                  <p className="font-bold text-lg text-slate-300">No receipt attached</p>
                  <p className="text-sm mt-1 mb-6 text-slate-500 max-w-[250px]">This expense was submitted by the driver without an image.</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-transform transform hover:-translate-y-0.5">
                    <UploadCloud size={18} />
                    Upload Receipt
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setSelectedExpense({ ...selectedExpense, receipt_url: url });
                      }
                    }} />
                  </label>
                </div>
              )}
            </div>

            {/* Details Side */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto bg-white relative">
               {/* Header Area */}
               <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
                 <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                     Expense Review
                     <div className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        selectedExpense.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        selectedExpense.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {selectedExpense.status}
                     </div>
                   </h2>
                   <p className="text-sm font-medium text-slate-500 mt-1">Review the details and approve or reject.</p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <button
                     onClick={() => {
                       const token = localStorage.getItem("accountant_token");
                       if (token) {
                         fetch(`http://localhost:4000/api/portal/accountant/expenses`, {
                           headers: { Authorization: `Bearer ${token}` }
                         }).then(r => r.json()).then(data => {
                           setBackendExpenses(data);
                           const updated = data.find((e: any) => e.id === selectedExpense.id);
                           if (updated) setSelectedExpense(updated);
                         }).catch(console.error);
                       }
                     }}
                     className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-600 transition-colors shadow-sm"
                     title="Refresh Receipt"
                   >
                     <RefreshCw size={16} />
                   </button>
                   <button 
                     onClick={() => setSelectedExpense(null)}
                     className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 rounded-full text-slate-600 transition-colors shadow-sm"
                   >
                     <XCircle size={18} />
                   </button>
                 </div>
               </div>

               <div className="space-y-8 flex-1">
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center shadow-sm">
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Claim Amount</div>
                   <div className="text-5xl font-black text-slate-900 tracking-tight">₹{parseFloat(selectedExpense.amount).toLocaleString('en-IN')}</div>
                   <div className="inline-block mt-3 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm">{selectedExpense.expense_type}</div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <div className="text-xs font-bold text-slate-500 uppercase">Date</div>
                     <div className="font-semibold text-slate-800 mt-0.5">{new Date(selectedExpense.expense_date).toLocaleDateString()}</div>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <div className="text-xs font-bold text-slate-500 uppercase">Driver</div>
                     <div className="font-semibold text-slate-800 mt-0.5">{selectedExpense.drivers?.name || 'Unknown'}</div>
                   </div>
                   {selectedExpense.vehicles?.vehicle_number && (
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="text-xs font-bold text-slate-500 uppercase">Vehicle</div>
                       <div className="font-semibold text-slate-800 mt-0.5">{selectedExpense.vehicles.vehicle_number}</div>
                     </div>
                   )}
                   {selectedExpense.trips?.id && (
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="text-xs font-bold text-slate-500 uppercase">Trip</div>
                       <div className="font-semibold text-blue-600 mt-0.5">#{selectedExpense.trips.id.substring(0,6)}</div>
                     </div>
                   )}
                 </div>

                 <div>
                   <div className="text-sm font-bold text-slate-900 mb-2">Description / Remarks</div>
                   <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[80px]">
                     {selectedExpense.description || <span className="italic text-slate-400">No remarks provided by driver.</span>}
                   </p>
                 </div>
               </div>

               {/* Modal Actions */}
               {selectedExpense.status === 'Pending' && (
                 <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/50 p-6 rounded-2xl border">
                   <div className="mb-5">
                     <label className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                       <MessageSquare size={14}/> Accountant Comments (Optional)
                     </label>
                     <textarea
                       placeholder="Add a reason for approval or rejection..."
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                       className="w-full text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none h-24 bg-white shadow-sm transition-all"
                     />
                   </div>
                   <div className="flex gap-4">
                     <button
                       disabled={actionLoading === selectedExpense.id}
                       onClick={async () => {
                         await handleStatusUpdate(selectedExpense.id, 'Approved');
                         setSelectedExpense(null);
                       }}
                       className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
                     >
                       {actionLoading === selectedExpense.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} className="text-emerald-400" />}
                       Approve Claim
                     </button>
                     <button
                       disabled={actionLoading === selectedExpense.id}
                       onClick={async () => {
                         await handleStatusUpdate(selectedExpense.id, 'Rejected');
                         setSelectedExpense(null);
                       }}
                       className="flex-1 py-4 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                       {actionLoading === selectedExpense.id ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                       Reject
                     </button>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
