"use client";

import { Search, Plus, MoreVertical, Edit, Trash2, Filter, LayoutTemplate, Mail, ShieldCheck, Shield, FileSpreadsheet, Lock, Key, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const initialUsers = [
  { id: 1, name: "Admin Master", email: "admin@fleetpro.com", role: "Super Admin", access: "Full System", status: "active", lastLogin: "2 mins ago" },
  { id: 2, name: "Support Lead", email: "support@fleetpro.com", role: "Support Staff", access: "Tenant Support", status: "active", lastLogin: "1 hour ago" },
  { id: 3, name: "Billing Manager", email: "billing@fleetpro.com", role: "Financial Admin", access: "Billing Only", status: "active", lastLogin: "3 hours ago" },
  { id: 4, name: "John Doe", email: "john.doe@fleetpro.com", role: "Support Staff", access: "Tenant Support", status: "inactive", lastLogin: "2 days ago" },
  { id: 5, name: "Jane Smith", email: "jane.smith@fleetpro.com", role: "System Auditor", access: "Read Only", status: "active", lastLogin: "5 mins ago" },
];

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [toastMessage, setToastMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const userFields: EditField[] = [
    { name: 'name', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'role', label: 'Role', type: 'select', options: [
      { label: 'Super Admin', value: 'Super Admin' },
      { label: 'Support Staff', value: 'Support Staff' },
      { label: 'Financial Admin', value: 'Financial Admin' },
      { label: 'System Auditor', value: 'System Auditor' },
    ]},
    { name: 'access', label: 'Access Level', type: 'text' },
  ];

  const handleExport = () => {
    setToastMessage("Exporting users data to Excel...");
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

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        setToastMessage(`User account ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
        setTimeout(() => setToastMessage(""), 3000);
        return { ...u, status: newStatus };
      }
      return u;
    }));
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: string, id: number) => {
    if (status === 'active') return <button onClick={() => toggleStatus(id)} className="badge badge-active hover:opacity-80 transition-opacity cursor-pointer">Active</button>;
    if (status === 'inactive') return <button onClick={() => toggleStatus(id)} className="badge badge-warning hover:opacity-80 transition-opacity cursor-pointer">Inactive</button>;
    return <span className="badge">{status}</span>;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'Super Admin') return <span className="badge bg-purple-100 text-purple-700 border-purple-200">{role}</span>;
    if (role === 'Support Staff') return <span className="badge bg-blue-100 text-blue-700 border-blue-200">{role}</span>;
    if (role === 'Financial Admin') return <span className="badge bg-emerald-100 text-emerald-700 border-emerald-200">{role}</span>;
    return <span className="badge">{role}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">System Users</h1>
          <p className="cmd-banner-sub">
            Manage internal staff, super admins, and their platform access.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by name or email..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-auto min-w-[150px]"
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Support Staff">Support Staff</option>
            <option value="Financial Admin">Financial Admin</option>
            <option value="System Auditor">System Auditor</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role & Access</th>
                <th>Last Active</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                        <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 items-start">
                      {getRoleBadge(user.role)}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {user.access}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{user.lastLogin}</div>
                  </td>
                  <td>
                    {getStatusBadge(user.status, user.id)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === user.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button 
                          onClick={() => {
                            setEditingUser(user);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit User
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("Password reset link sent")}>
                          <Key size={16} className="text-amber-500" /> Reset Password
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        {user.status === 'active' ? (
                          <button onClick={() => toggleStatus(user.id)} className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                            <Lock size={16} /> Deactivate
                          </button>
                        ) : (
                          <button onClick={() => toggleStatus(user.id)} className="w-full text-left px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <ShieldCheck size={16} /> Activate
                          </button>
                        )}
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => showToast("User deleted")}>
                          <Trash2 size={16} /> Delete User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No users found</h3>
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
        title="Edit User"
        fields={userFields}
        initialData={editingUser}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setUsers(users.map(u => u.id === data.id ? { ...u, ...data } : u));
          setToastMessage(`Successfully updated ${data.name}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      {/* ── Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900">Add New User</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" className="form-input w-full" placeholder="e.g., John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input type="email" className="form-input w-full" placeholder="e.g., john@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Role</label>
                  <select className="form-input w-full">
                    <option>Super Admin</option>
                    <option>Support Staff</option>
                    <option>Financial Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Status</label>
                  <select className="form-input w-full">
                    <option>Active</option>
                    <option>Inactive</option>
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
                  setToastMessage("User added successfully!");
                  setIsAddModalOpen(false);
                  setTimeout(() => setToastMessage(""), 3000);
                }}
              >
                Save User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Mail size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
