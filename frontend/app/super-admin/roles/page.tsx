"use client";

import { Search, Plus, MoreVertical, Edit, FileSpreadsheet, KeyRound, Filter, LayoutTemplate, Copy, Trash2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockRoles = [
  { id: 1, name: "Super Admin", description: "Full access to all system features and settings.", users: 4, type: "System" },
  { id: 2, name: "Financial Admin", description: "Access to billing, subscriptions, and revenue reports.", users: 3, type: "System" },
  { id: 3, name: "Support Staff", description: "Access to tenant details and support ticketing.", users: 12, type: "System" },
  { id: 4, name: "System Auditor", description: "Read-only access to audit logs and platform reports.", users: 5, type: "System" },
  { id: 5, name: "Sales Manager", description: "Access to lead management and trial conversions.", users: 8, type: "Custom" },
];

export default function RolesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    setToastMessage("Exporting roles data to Excel...");
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

  const filteredRoles = mockRoles.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    if (type === 'System') return <span className="badge bg-slate-100 text-slate-700 border-slate-200">{type}</span>;
    if (type === 'Custom') return <span className="badge bg-blue-100 text-blue-700 border-blue-200">{type}</span>;
    return <span className="badge">{type}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Roles & Permissions</h1>
          <p className="cmd-banner-sub">
            Manage access control policies for internal super admin staff.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Create Role
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search roles..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-auto min-w-[150px]"
          >
            <option value="all">All Types</option>
            <option value="System">System</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Assigned Users</th>
                <th>Type</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id} className="group">
                  <td>
                    <div className="font-bold text-slate-900 text-sm">{role.name}</div>
                  </td>
                  <td>
                    <div className="font-medium text-slate-600 text-sm max-w-sm truncate">{role.description}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                      <KeyRound size={14} className="text-slate-400" /> {role.users} Users
                    </div>
                  </td>
                  <td>
                    {getTypeBadge(role.type)}
                  </td>
                  <td className="text-right relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === role.id ? null : role.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === role.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("Edit Permissions modal opened")}>
                          <Edit size={16} className="text-blue-500" /> Edit Permissions
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("Role cloned")}>
                          <Copy size={16} className="text-slate-500" /> Clone Role
                        </button>
                        {role.type !== 'System' && (
                          <>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => showToast("Role deleted")}>
                              <Trash2 size={16} /> Delete Role
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
          {filteredRoles.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No roles found</h3>
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
              <h2 className="text-lg font-black text-slate-900">Create New Role</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Role Name</label>
                <input type="text" className="form-input w-full" placeholder="e.g., Marketing Admin" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea className="form-input w-full min-h-[80px]" placeholder="Briefly describe the role's purpose..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Role Type</label>
                <select className="form-input w-full">
                  <option>Custom</option>
                  <option>System (Restricted)</option>
                </select>
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
                  setToastMessage("Role created successfully!");
                  setIsAddModalOpen(false);
                  setTimeout(() => setToastMessage(""), 3000);
                }}
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <KeyRound size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
