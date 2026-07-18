"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, IndianRupee } from "lucide-react";
import { api } from "@/lib/api";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [subtotal, setSubtotal] = useState<string>("0");
  const [fuelAmount, setFuelAmount] = useState<string>("0");
  const [battaAmount, setBattaAmount] = useState<string>("0");
  const [taxAmount, setTaxAmount] = useState<string>("0");
  // Customer and Trip ID would normally be selected from dropdowns
  const [customerId, setCustomerId] = useState<string>("");
  const [tripId, setTripId] = useState<string>("");

  // Calculation
  const numSubtotal = parseFloat(subtotal) || 0;
  const numFuel = parseFloat(fuelAmount) || 0;
  const numBatta = parseFloat(battaAmount) || 0;
  const numTax = parseFloat(taxAmount) || 0;
  
  const grandTotal = numSubtotal + numFuel + numBatta + numTax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const data = await api.createInvoice({
        customer_id: customerId || null,
        trip_id: tripId || null,
        subtotal: numSubtotal,
        fuel_amount: numFuel,
        batta_amount: numBatta,
        tax_amount: numTax,
      });

      router.push(`/invoices/${data.invoice.id}`);
    } catch (err: any) {
      console.error("Failed to create invoice", err);
      alert(err.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <Link href="/invoices" className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-600 transition-colors mb-3 font-medium">
          <ArrowLeft size={13} /> Back to Invoices
        </Link>
        <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Create Invoice</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-slate-700">Customer ID (Optional)</label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Enter Customer UUID"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-slate-700">Trip ID (Optional)</label>
              <input
                type="text"
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Enter Trip UUID"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700">Subtotal</label>
              <div className="relative w-48">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  required
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700">Fuel Amount</label>
              <div className="relative w-48">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={fuelAmount}
                  onChange={(e) => setFuelAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700">Batta Amount</label>
              <div className="relative w-48">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={battaAmount}
                  onChange={(e) => setBattaAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700">Tax Amount</label>
              <div className="relative w-48">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <label className="text-[15px] font-bold text-slate-900">Grand Total</label>
              <div className="text-[18px] font-extrabold text-blue-600">
                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm shadow-blue-600/20"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
