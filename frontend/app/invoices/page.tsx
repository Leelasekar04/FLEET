"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Search, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await api.getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f1f5f9]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="min-w-0 pr-4">
          <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight truncate">Invoices</h1>
          <p className="text-[13px] text-slate-500 mt-0.5 truncate">Manage and track your customer invoices.</p>
        </div>
        <Link 
          href="/invoices/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 shadow-sm"
        >
          <Plus size={16} />
          Create Invoice
        </Link>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <FileText size={48} className="text-slate-300 mb-4" />
              <p className="text-[14px] font-medium">No invoices found</p>
              <p className="text-[13px]">Click create invoice to generate a new one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[12px] uppercase text-slate-500 font-semibold">
                  <th className="px-6 py-3">Invoice ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Trip ID</th>
                  <th className="px-6 py-3">Grand Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {inv.id.split("-")[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-3">{inv.customers?.name || "N/A"}</td>
                    <td className="px-6 py-3">{inv.trips?.id ? inv.trips.id.split("-")[0].toUpperCase() : "N/A"}</td>
                    <td className="px-6 py-3 font-semibold text-slate-900">
                      ₹{parseFloat(inv.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        inv.status === 'draft' ? 'bg-slate-100 text-slate-700' : 
                        inv.status === 'sent' ? 'bg-blue-50 text-blue-700' :
                        inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link 
                        href={`/invoices/${inv.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-[12px]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
