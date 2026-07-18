"use client";

import { 
  Search, 
  FileSpreadsheet, 
  Filter, 
  LayoutTemplate, 
  ReceiptText,
  MoreVertical,
  Edit,
  Eye,
  Download,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const fmt = { 
  currency: (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
};

const mockTaxReports = [
  { id: "TAX-2026-Q2-US", period: "Q2 2026", jurisdiction: "United States (Federal)", amount: 45600.00, status: "filed" },
  { id: "TAX-2026-Q2-CA", period: "Q2 2026", jurisdiction: "California (State)", amount: 12450.00, status: "pending" },
  { id: "TAX-2026-Q1-US", period: "Q1 2026", jurisdiction: "United States (Federal)", amount: 41200.00, status: "filed" },
  { id: "TAX-2026-Q1-CA", period: "Q1 2026", jurisdiction: "California (State)", amount: 11050.00, status: "filed" },
  { id: "TAX-2025-YEA-UK", period: "Year End 2025", jurisdiction: "United Kingdom (HMRC)", amount: 89000.00, status: "filed" },
];

export default function TaxReportsPage() {
  const [reports, setReports] = useState(mockTaxReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  const reportFields: EditField[] = [
    { name: 'id', label: 'Document ID', type: 'text', disabled: true },
    { name: 'period', label: 'Period', type: 'text', disabled: true },
    { name: 'jurisdiction', label: 'Jurisdiction', type: 'text', disabled: true },
    { name: 'amount', label: 'Tax Amount', type: 'number' },
    { name: 'status', label: 'Filing Status', type: 'select', options: [
      { label: 'Filed', value: 'filed' },
      { label: 'Pending', value: 'pending' },
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

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    setToastMessage("Generating tax documentation...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'filed') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1" /> Filed</span>;
    if (status === 'pending') return <span className="badge badge-warning"><Clock size={12} className="mr-1" /> Pending</span>;
    return <span className="badge">{status}</span>;
  };

  // KPIs calculation
  const totalCollected = reports.filter(r => r.status === 'filed').reduce((sum, r) => sum + r.amount, 0);
  const pendingLiabilities = reports.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const generatedCount = reports.length;

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Tax Reports</h1>
          <p className="cmd-banner-sub">
            Manage tax liabilities, filings, and jurisdictional documentation.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Documents
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="cmd-stat-card group hover:border-emerald-200 transition-colors">
          <div className="cmd-stat-icon bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <CheckCircle2 size={20} />
          </div>
          <div className="cmd-stat-label">Total Tax Filed</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(totalCollected)}</div>
        </div>

        <div className="cmd-stat-card group hover:border-amber-200 transition-colors">
          <div className="cmd-stat-icon bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <AlertCircle size={20} />
          </div>
          <div className="cmd-stat-label">Pending Liabilities</div>
          <div className="cmd-stat-value text-slate-900">{fmt.currency(pendingLiabilities)}</div>
        </div>

        <div className="cmd-stat-card group hover:border-blue-200 transition-colors">
          <div className="cmd-stat-icon bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <ReceiptText size={20} />
          </div>
          <div className="cmd-stat-label">Generated Reports</div>
          <div className="cmd-stat-value text-slate-900">{generatedCount}</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by ID or Jurisdiction..." 
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
              <option value="filed">Filed</option>
              <option value="pending">Pending</option>
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
                <th>Document Details</th>
                <th>Jurisdiction</th>
                <th>Period</th>
                <th>Tax Amount</th>
                <th>Filing Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <ReceiptText size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-wide">{report.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Building2 size={14} className="text-slate-400" />
                      {report.jurisdiction}
                    </div>
                  </td>
                  <td>
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 uppercase">
                      {report.period}
                    </div>
                  </td>
                  <td>
                    <div className="font-black text-slate-900 text-sm">{fmt.currency(report.amount)}</div>
                  </td>
                  <td>
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === report.id ? null : report.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === report.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button onClick={() => alert("Opening report view...")} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> View Report
                        </button>
                        <button onClick={() => window.print()} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Download size={16} className="text-slate-400" /> Download Forms
                        </button>
                        <button 
                          onClick={() => {
                            setEditingReport(report);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Details
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button onClick={() => {
                              alert("Marked as filed!");
                              setActiveDropdown(null);
                            }} className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                              <Send size={16} /> Mark as Filed
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
          {filteredReports.length === 0 && (
            <div className="empty-state p-12 flex flex-col items-center">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No tax reports found</h3>
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
        title="Edit Tax Report"
        fields={reportFields}
        initialData={editingReport}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          const updatedData = { ...data, amount: Number(data.amount) };
          setReports(reports.map(r => r.id === updatedData.id ? { ...r, ...updatedData } : r));
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
