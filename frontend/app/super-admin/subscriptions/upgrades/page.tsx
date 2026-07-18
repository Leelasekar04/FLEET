"use client";

import { Search, MoreVertical, FileSpreadsheet, Eye, Edit, Filter, LayoutTemplate, Send, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const fmt = { currency: (n: number) => `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` };

const mockUpgrades = [
  { id: "upg_1", company: "Metro Transit Authority", from: "Professional", to: "Enterprise", mrrIncrease: 800, date: "2026-07-10", status: "completed" },
  { id: "upg_2", company: "Blue Line Transport", from: "Basic", to: "Professional", mrrIncrease: 100, date: "2026-07-12", status: "completed" },
  { id: "upg_3", company: "Swift Delivery Co.", from: "Trial", to: "Basic", mrrIncrease: 49, date: "2026-07-14", status: "completed" },
  { id: "upg_4", company: "Global Freight", from: "Professional", to: "Enterprise", mrrIncrease: 1200, date: "2026-07-14", status: "pending" },
];

export default function UpgradesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [upgrades, setUpgrades] = useState(mockUpgrades);
  const [toastMessage, setToastMessage] = useState("");
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUpgrade, setEditingUpgrade] = useState<any>(null);

  const upgradeFields: EditField[] = [
    { name: 'company', label: 'Company Name', type: 'text', disabled: true },
    { name: 'from', label: 'Current Plan', type: 'text', disabled: true },
    { name: 'to', label: 'Requested Plan', type: 'select', options: [
      { label: 'Basic', value: 'Basic' },
      { label: 'Professional', value: 'Professional' },
      { label: 'Enterprise', value: 'Enterprise' },
    ]},
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Completed', value: 'completed' },
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

  const filteredUpgrades = upgrades.filter(u => {
    const matchesSearch = u.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1" /> Completed</span>;
    if (status === 'pending') return <span className="badge badge-warning"><Zap size={12} className="mr-1" /> Pending</span>;
    return <span className="badge">{status}</span>;
  };

  const getPlanBadge = (name: string) => {
    if (name === 'Enterprise') return <span className="badge bg-purple-100 text-purple-700 border-purple-200">{name}</span>;
    if (name === 'Professional') return <span className="badge bg-blue-100 text-blue-700 border-blue-200">{name}</span>;
    if (name === 'Basic') return <span className="badge bg-indigo-100 text-indigo-700 border-indigo-200">{name}</span>;
    if (name === 'Trial') return <span className="badge bg-emerald-100 text-emerald-700 border-emerald-200">{name}</span>;
    return <span className="badge">{name}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Plan Upgrades</h1>
          <p className="cmd-banner-sub">
            Track MRR expansion and subscription tier changes.
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
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
                <th>Upgrade Path</th>
                <th>MRR Increase</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUpgrades.map((upgrade) => (
                <tr key={upgrade.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black shadow-sm">
                        {upgrade.company.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{upgrade.company}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{upgrade.from}</span>
                      <ChevronRight size={14} className="text-slate-300" />
                      {getPlanBadge(upgrade.to)}
                    </div>
                  </td>
                  <td>
                    <div className="font-black text-emerald-600 text-lg tracking-tight">+{fmt.currency(upgrade.mrrIncrease)}</div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{new Date(upgrade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td>
                    {getStatusBadge(upgrade.status)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === upgrade.id ? null : upgrade.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === upgrade.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> View Company
                        </button>
                        <button 
                          onClick={() => {
                            setEditingUpgrade(upgrade);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Upgrade
                        </button>
                        {upgrade.status === 'pending' && (
                          <>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                              <Zap size={16} /> Process Upgrade
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
          {filteredUpgrades.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No upgrades found</h3>
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
        title="Edit Upgrade"
        fields={upgradeFields}
        initialData={editingUpgrade}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setUpgrades(upgrades.map(u => u.id === data.id ? { ...u, ...data } : u));
          setToastMessage(`Successfully updated upgrade for ${data.company}`);
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
