"use client";

import { Search, Plus, MoreVertical, Edit, FileSpreadsheet, Lock, Filter, LayoutTemplate, Trash2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockPermissions = [
  { id: 1, resource: "Companies", action: "Create, Read, Update, Delete", group: "Tenant Management", risk: "High" },
  { id: 2, resource: "Company Users", action: "Read, Update", group: "Tenant Management", risk: "Moderate" },
  { id: 3, resource: "Subscription Plans", action: "Create, Read, Update", group: "Billing", risk: "High" },
  { id: 4, resource: "Invoices", action: "Read", group: "Billing", risk: "Low" },
  { id: 5, resource: "Audit Logs", action: "Read", group: "System", risk: "Low" },
];

export default function PermissionsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    setToastMessage("Exporting permissions data to Excel...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
    setActiveDropdown(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPermissions = mockPermissions.filter(p => {
    const matchesSearch = p.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === "all" || p.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const getRiskBadge = (risk: string) => {
    if (risk === 'High') return <span className="badge badge-error">{risk} Risk</span>;
    if (risk === 'Moderate') return <span className="badge badge-warning">{risk} Risk</span>;
    if (risk === 'Low') return <span className="badge badge-completed">{risk} Risk</span>;
    return <span className="badge">{risk}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">System Permissions</h1>
          <p className="cmd-banner-sub">
            Define specific resources, actions, and their associated risks.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Permission
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search permissions..."
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
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-auto min-w-[150px]"
          >
            <option value="all">All Groups</option>
            <option value="Tenant Management">Tenant Management</option>
            <option value="Billing">Billing</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Allowed Actions</th>
                <th>Group</th>
                <th>Risk Level</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map((permission) => (
                <tr key={permission.id} className="group">
                  <td>
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-slate-400" />
                      <div className="font-bold text-slate-900 text-sm">{permission.resource}</div>
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-slate-600 text-sm">{permission.action}</div>
                  </td>
                  <td>
                    <span className="badge bg-slate-100 text-slate-700 border-slate-200">{permission.group}</span>
                  </td>
                  <td>
                    {getRiskBadge(permission.risk)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === permission.id ? null : permission.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === permission.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("Edit Permission modal opened")}>
                          <Edit size={16} className="text-blue-500" /> Edit Permission
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => showToast("Permission deleted")}>
                          <Trash2 size={16} /> Delete Permission
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPermissions.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No permissions found</h3>
              <p className="text-sm max-w-sm mx-auto">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900">Add New Permission</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Resource Name</label>
                <input type="text" className="form-input w-full" placeholder="e.g., Invoices" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Allowed Actions</label>
                <input type="text" className="form-input w-full" placeholder="e.g., Create, Read, Update, Delete" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Group</label>
                  <select className="form-input w-full">
                    <option>Tenant Management</option>
                    <option>Billing</option>
                    <option>System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Risk Level</label>
                  <select className="form-input w-full">
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setToastMessage("Permission added successfully!");
                  setIsAddModalOpen(false);
                  setTimeout(() => setToastMessage(""), 3000);
                }}
              >
                Save Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Lock size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
