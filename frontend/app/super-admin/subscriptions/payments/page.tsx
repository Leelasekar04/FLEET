"use client";

import { useState, useEffect } from "react";
import { Search, CreditCard, ExternalLink } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/super-admin/subscriptions/payments", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token") || ""}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
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
            <CreditCard size={20} className="text-indigo-600" />
            Payments
          </h2>
          <p className="text-sm text-slate-500 mt-1">Real-time payment processing logs and history.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search payments..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6 font-semibold">Payment ID</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Method</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 pr-6 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No payments found.</td></tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-bold text-slate-900 flex items-center gap-2">
                      {pay.id} <ExternalLink size={14} className="text-slate-400" />
                    </td>
                    <td className="p-4 font-bold text-slate-900">₹{pay.amount}</td>
                    <td className="p-4 text-sm font-medium text-slate-600 capitalize">{pay.payment_method}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-sm text-slate-500">{new Date(pay.created_at).toLocaleString()}</td>
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
