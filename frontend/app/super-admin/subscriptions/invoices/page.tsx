"use client";

import { useState, useEffect } from "react";
import { Search, Download, FileText } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/super-admin/subscriptions/invoices", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token") || ""}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-indigo-600" />
            Invoices
          </h2>
          <p className="text-sm text-slate-500 mt-1">Track and manage generated billing invoices.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search invoices..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6 font-semibold">Invoice ID</th>
                <th className="p-4 font-semibold">Amount Due</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No invoices found.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-bold text-slate-900">{inv.id}</td>
                    <td className="p-4 font-bold text-slate-900">₹{inv.amount_due}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
