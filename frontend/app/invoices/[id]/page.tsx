"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Download, Printer, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const data = await api.getInvoice(id);
      setInvoice(data);
    } catch (err: any) {
      if (err.message !== "Invoice not found") {
        console.error(err);
      }
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f1f5f9]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-[13px] text-slate-500 font-medium">Loading Invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f1f5f9]">
        <div className="text-[14px] font-bold text-slate-700">Invoice Not Found</div>
        <Link href="/invoices" className="text-blue-600 mt-2 text-[13px] hover:underline">
          Go back to Invoices
        </Link>
      </div>
    );
  }

  const numFuel = parseFloat(invoice.fuel_amount) || 0;
  const numBatta = parseFloat(invoice.batta_amount) || 0;

  return (
    <div className="flex flex-col h-full bg-[#f1f5f9]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 flex items-center justify-between">
        <div>
          <Link href="/invoices" className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-600 transition-colors mb-3 font-medium">
            <ArrowLeft size={13} /> Back to Invoices
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">
              Invoice #{invoice.id.split("-")[0].toUpperCase()}
            </h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              invoice.status === 'draft' ? 'bg-slate-100 text-slate-700' : 
              invoice.status === 'sent' ? 'bg-blue-50 text-blue-700' :
              invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
              'bg-red-50 text-red-700'
            }`}>
              {invoice.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[13px] font-semibold transition-colors">
            <Printer size={16} /> Print
          </button>
          <button onClick={() => window.print()} className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm shadow-blue-600/20">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 p-10">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-[24px] font-black text-slate-900 mb-1">INVOICE</h2>
              <p className="text-[13px] text-slate-500">Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-800 text-[14px]">Your Company Name</div>
              <div className="text-[12px] text-slate-500 mt-1">
                123 Business Road<br />
                City, State 12345<br />
                GSTIN: 22AAAAA0000A1Z5
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-10">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
            <div className="font-semibold text-slate-800 text-[14px]">
              {invoice.customers?.name || "Unknown Customer"}
            </div>
            {invoice.customers?.address && (
              <div className="text-[13px] text-slate-600 mt-1 max-w-xs">
                {invoice.customers.address}
              </div>
            )}
            {invoice.customers?.gst_number && (
              <div className="text-[13px] text-slate-600 mt-1">
                GSTIN: {invoice.customers.gst_number}
              </div>
            )}
          </div>

          {/* Line Items placeholder (assuming trip details) */}
          <div className="mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-[12px] font-semibold text-slate-500">
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                <tr>
                  <td className="py-4 px-4 text-slate-800">
                    <div className="font-medium">Freight Charges</div>
                    {invoice.trips && (
                      <div className="text-[12px] text-slate-500 mt-0.5">
                        Trip: {invoice.trips.origin} to {invoice.trips.destination}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-slate-800">
                    ₹{parseFloat(invoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section matching prompt exact layout */}
          <div className="flex justify-end">
            <div className="w-72">
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{parseFloat(invoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                {numFuel > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Fuel Charges</span>
                    <span className="font-medium">₹{numFuel.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                
                {numBatta > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Batta Charges</span>
                    <span className="font-medium">₹{numBatta.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span className="font-medium">₹{parseFloat(invoice.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-[14px]">Grand Total</span>
                  <span className="font-black text-blue-600 text-[18px]">
                    ₹{parseFloat(invoice.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
