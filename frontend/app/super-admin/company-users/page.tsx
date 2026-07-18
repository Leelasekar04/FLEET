"use client";

import { 
  Users, Search, Plus, MoreVertical, Edit, Trash2, Filter, Building2, Key, Shield, ShieldAlert, ShieldCheck, Mail, CheckCircle2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockCompanyUsers = [
  { 
    id: 1, name: "John Doe", email: "john@express.com", company: "Express Logistics", companyCode: "EXP-001",
    role: "Admin", status: "active", lastActive: "2 hours ago"
  },
  { 
    id: 2, name: "Sarah Jenkins", email: "sarah.j@express.com", company: "Express Logistics", companyCode: "EXP-001",
    role: "Manager", status: "active", lastActive: "1 day ago"
  },
  { 
    id: 3, name: "Mike Johnson", email: "mike@apexfreight.com", company: "Apex Freight", companyCode: "APX-993",
    role: "Admin", status: "suspended", lastActive: "2 weeks ago"
  },
  { 
    id: 4, name: "Emma Wilson", email: "emma@globalsupply.com", company: "Global Supply Co", companyCode: "GSC-442",
    role: "Admin", status: "active", lastActive: "5 mins ago"
  },
  { 
    id: 5, name: "Tom Brown", email: "tom@localdelivery.com", company: "Local Delivery Bros", companyCode: "LDB-115",
    role: "Admin", status: "inactive", lastActive: "3 months ago"
  },
  { 
    id: 6, name: "Alice Cooper", email: "alice@citytransit.com", company: "City Transit Movers", companyCode: "CTM-082",
    role: "Dispatcher", status: "active", lastActive: "1 hour ago"
  },
];

export default function CompanyUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState("");

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

  const filteredUsers = mockCompanyUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    const matchesCompany = companyFilter === "all" || u.company === companyFilter;
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesCompany && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="badge badge-completed">Active</span>;
    if (status === 'suspended') return <span className="badge badge-warning">Suspended</span>;
    return <span className="badge badge-danger">Inactive</span>;
  };

  const getRoleIcon = (role: string) => {
    if (role === 'Admin') return <ShieldAlert size={14} className="text-purple-600" />;
    if (role === 'Manager') return <ShieldCheck size={14} className="text-blue-600" />;
    return <Shield size={14} className="text-slate-400" />;
  };

  const companiesList = Array.from(new Set(mockCompanyUsers.map(u => u.company)));
  const rolesList = Array.from(new Set(mockCompanyUsers.map(u => u.role)));

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Company Users</h1>
          <p className="cmd-banner-sub">
            Manage administrative and staff accounts across all tenant companies.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-primary btn-sm" onClick={() => showToast("Add User modal opened")}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full xl:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search users, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !pl-10 !h-10 text-sm"
          />
        </div>
        
        <div className="flex flex-nowrap items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5 shrink-0 hidden sm:flex">
            <Filter size={14} /> Filters:
          </div>
          
          <select 
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="form-input !h-10 text-sm shrink-0 w-auto min-w-[150px]"
          >
            <option value="all">All Companies</option>
            {companiesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-input !h-10 text-sm shrink-0 w-auto min-w-[130px]"
          >
            <option value="all">All Roles</option>
            {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input !h-10 text-sm shrink-0 w-auto min-w-[130px]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
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
                <th>Company (Tenant)</th>
                <th>Role & Access</th>
                <th>Status</th>
                <th>Last Active</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group">
                  
                  {/* User Details */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center font-black shadow-sm uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1"><Mail size={10} /> {user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Company */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400" />
                      <div>
                        <div className="font-bold text-slate-700 text-sm">{user.company}</div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{user.companyCode}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Role */}
                  <td>
                    <div className="flex items-center gap-1.5">
                      {getRoleIcon(user.role)}
                      <span className="font-semibold text-slate-800 text-sm">{user.role}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    {getStatusBadge(user.status)}
                  </td>

                  {/* Last Active */}
                  <td>
                    <div className="text-sm font-semibold text-slate-600">{user.lastActive}</div>
                  </td>
                  
                  {/* Actions */}
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === user.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("Edit User modal opened")}>
                          <Edit size={16} className="text-blue-500" /> Edit User
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("Password reset link sent")}>
                          <Key size={16} className="text-slate-400" /> Reset Password
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2" onClick={() => showToast("User suspended")}>
                          <ShieldAlert size={16} /> Suspend Access
                        </button>
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
              <Users size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No users found</h3>
              <p className="text-sm max-w-sm mx-auto">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

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
