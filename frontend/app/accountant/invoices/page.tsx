"use client";

import { 
  Search, 
  FileSpreadsheet, 
  Filter, 
  LayoutTemplate, 
  Receipt,
  MoreVertical,
  Edit,
  Eye,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const fmt = { 
  currency: (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
};

const mockInvoices = [
  { id: "INV-2026-001", client: "Metro Transit Authority", amount: 1490.00, issueDate: "2026-07-01", dueDate: "2026-07-15", status: "paid" },
  { id: "INV-2026-002", client: "Swift Delivery Co.", amount: 350.00, issueDate: "2026-07-05", dueDate: "2026-07-20", status: "pending" },
  { id: "INV-2026-003", client: "Apex Logistics", amount: 2999.00, issueDate: "2026-07-10", dueDate: "2026-07-25", status: "pending" },
  { id: "INV-2026-004", client: "City Cabs Inc.", amount: 125.50, issueDate: "2026-06-25", dueDate: "2026-07-10", status: "overdue" },
  { id: "INV-2026-005", client: "Global Freight", amount: 1490.00, issueDate: "2026-07-12", dueDate: "2026-07-27", status: "pending" },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  const invoiceFields: EditField[] = [
    { name: 'id', label: 'Invoice ID', type: 'text', disabled: true },
    { name: 'client', label: 'Client', type: 'text', disabled: true },
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'issueDate', label: 'Issue Date', type: 'date' },
    { name: 'dueDate', label: 'Due Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Paid', value: 'paid' },
      { label: 'Pending', value: 'pending' },
      { label: 'Overdue', value: 'overdue' },
    ]},
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    setToastMessage("Exporting invoices to Excel...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1" /> Paid</span>;
    if (status === 'pending') return <span className="badge badge-warning"><Clock size={12} className="mr-1" /> Pending</span>;
    if (status === 'overdue') return <span className="badge badge-error"><AlertCircle size={12} className="mr-1" /> Overdue</span>;
    return <span className="badge">{status}</span>;
  };

  // KPIs calculation
  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  const paidThisMonth = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Invoices</h1>
          <p className="cmd-banner-sub">
            Manage client billing, track payments, and send reminders.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="cmd-stat-card group hover:border-blue-200 transition-colors">
          <div className="cmd-stat-icon bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Clock size={20} />
          </div>
          <div className="cmd-stat-label">Total Outstanding</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(totalOutstanding)}</div>
        </div>

        <div className="cmd-stat-card group hover:border-amber-200 transition-colors">
          <div className="cmd-stat-icon bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <AlertCircle size={20} />
          </div>
          <div className="cmd-stat-label">Total Overdue</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(totalOverdue)}</div>
        </div>

        <div className="cmd-stat-card group hover:border-emerald-200 transition-colors">
          <div className="cmd-stat-icon bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <CheckCircle2 size={20} />
          </div>
          <div className="cmd-stat-label">Paid This Month</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(paidThisMonth)}</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search invoices by ID or Client..." 
            className="form-input !pl-10 !h-10 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              className="form-input !pl-9 !h-10 w-full cursor-pointer text-sm font-medium text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-3">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Details</th>
                <th>Client</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Receipt size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-wide">{inv.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{inv.client}</div>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-slate-600">Issue: <span className="font-medium text-slate-500">{inv.issueDate}</span></div>
                    <div className="text-xs font-bold text-slate-600 mt-1">Due: <span className="font-medium text-slate-500">{inv.dueDate}</span></div>
                  </td>
                  <td>
                    <div className="font-black text-slate-900 text-sm">{fmt.currency(inv.amount)}</div>
                  </td>
                  <td>
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === inv.id ? null : inv.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === inv.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> View Invoice
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Download size={16} className="text-slate-400" /> Download PDF
                        </button>
                        <button 
                          onClick={() => {
                            setEditingInvoice(inv);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Invoice
                        </button>
                        {inv.status !== 'paid' && (
                          <>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                              <Send size={16} /> Send Reminder
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <div className="empty-state p-12 flex flex-col items-center">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No invoices found</h3>
              <p className="text-sm text-slate-500 max-w-sm text-center">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Invoice"
        fields={invoiceFields}
        initialData={editingInvoice}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          // If amount is a string, convert to number
          const updatedData = { ...data, amount: Number(data.amount) };
          setInvoices(invoices.map(i => i.id === updatedData.id ? { ...i, ...updatedData } : i));
          setToastMessage(`Successfully updated ${updatedData.id}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
