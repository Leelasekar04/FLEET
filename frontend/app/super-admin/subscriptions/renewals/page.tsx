"use client";

import { Search, MoreVertical, FileSpreadsheet, Eye, Edit, Filter, LayoutTemplate, Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const fmt = { currency: (n: number) => `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` };

const mockRenewals = [
  { id: "ren_1", company: "Metro Transit Authority", plan: "Enterprise", amount: 1490, date: "2026-07-20", status: "auto_renewing", type: "annual" },
  { id: "ren_2", company: "Swift Delivery Co.", plan: "Professional", amount: 149, date: "2026-07-22", status: "manual", type: "monthly" },
  { id: "ren_3", company: "Apex Logistics", plan: "Basic", amount: 49, date: "2026-07-25", status: "action_needed", type: "monthly" },
  { id: "ren_4", company: "City Cabs Inc.", plan: "Professional", amount: 1490, date: "2026-08-01", status: "auto_renewing", type: "annual" },
  { id: "ren_5", company: "Global Freight", plan: "Enterprise", amount: 2999, date: "2026-08-05", status: "manual", type: "annual" },
];

export default function RenewalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [renewals, setRenewals] = useState(mockRenewals);
  const [toastMessage, setToastMessage] = useState("");
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRenewal, setEditingRenewal] = useState<any>(null);

  const renewalFields: EditField[] = [
    { name: 'company', label: 'Company Name', type: 'text', disabled: true },
    { name: 'date', label: 'Renewal Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Auto Renewing', value: 'auto_renewing' },
      { label: 'Manual', value: 'manual' },
      { label: 'Action Needed', value: 'action_needed' },
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

  const filteredRenewals = renewals.filter(r => {
    const matchesSearch = r.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'auto_renewing') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1" /> Auto-Renewing</span>;
    if (status === 'manual') return <span className="badge badge-active"><RefreshCw size={12} className="mr-1" /> Manual</span>;
    if (status === 'action_needed') return <span className="badge badge-warning"><AlertCircle size={12} className="mr-1" /> Action Needed</span>;
    return <span className="badge">{status}</span>;
  };

  const getPlanBadge = (name: string) => {
    if (name === 'Enterprise') return <span className="badge bg-purple-100 text-purple-700 border-purple-200">{name}</span>;
    if (name === 'Professional') return <span className="badge bg-blue-100 text-blue-700 border-blue-200">{name}</span>;
    if (name === 'Basic') return <span className="badge bg-indigo-100 text-indigo-700 border-indigo-200">{name}</span>;
    return <span className="badge">{name}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Renewals</h1>
          <p className="cmd-banner-sub">
            Track upcoming subscription renewals and automate invoicing.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm">
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !pl-10 !h-10 text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
            <Filter size={14} /> Filters:
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-auto min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            <option value="auto_renewing">Auto-Renewing</option>
            <option value="manual">Manual</option>
            <option value="action_needed">Action Needed</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Plan & Cycle</th>
                <th>Amount</th>
                <th>Renewal Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRenewals.map((renewal) => {
                const daysAway = Math.ceil((new Date(renewal.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                
                return (
                  <tr key={renewal.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black shadow-sm">
                          {renewal.company.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{renewal.company}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getPlanBadge(renewal.plan)}
                        <span className="text-xs font-bold text-slate-400 capitalize">{renewal.type}</span>
                      </div>
                    </td>
                    <td>
                      <div className="font-black text-slate-700 text-sm">{fmt.currency(renewal.amount)}</div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-700 text-sm">{new Date(renewal.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-xs font-bold text-slate-400 mt-0.5 tracking-wider">{daysAway} days away</div>
                    </td>
                    <td>
                      {getStatusBadge(renewal.status)}
                    </td>
                    <td className="text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === renewal.id ? null : renewal.id)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeDropdown === renewal.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                        >
                          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Eye size={16} className="text-slate-400" /> View Company
                          </button>
                          <button 
                            onClick={() => {
                              setEditingRenewal(renewal);
                              setIsEditModalOpen(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit size={16} className="text-blue-500" /> Edit Renewal
                          </button>
                          {renewal.status !== 'auto_renewing' && (
                            <>
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                                <Send size={16} /> Send Invoice
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredRenewals.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No renewals found</h3>
              <p className="text-sm max-w-sm mx-auto">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Renewal"
        fields={renewalFields}
        initialData={editingRenewal}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setRenewals(renewals.map(r => r.id === data.id ? { ...r, ...data } : r));
          setToastMessage(`Successfully updated renewal for ${data.company}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

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
