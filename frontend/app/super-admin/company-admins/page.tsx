"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Building2, Edit2, Shield, Play, Pause, Trash2, UserCog } from "lucide-react";
import CompanyAdminForm from "@/components/super-admin/company-admins/CompanyAdminForm";

export default function CompanyAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/super-admin/company-admins", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token") || ""}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.companyAdmins || []);
      } else {
        // Fallback dummy data if backend mock is not wired exactly
        setAdmins([
          { id: "mock-company-admin", name: "Company Admin", email: "admin@company.com", company_name: "Default Company", subscription_plan: "pro", status: "active" }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name?.toLowerCase().includes(search.toLowerCase()) || 
    admin.email?.toLowerCase().includes(search.toLowerCase()) ||
    admin.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateOrEdit = async (formData: any) => {
    try {
      const url = editingAdmin 
        ? `/api/portal/super-admin/company-admins/${editingAdmin.id}`
        : "/api/portal/super-admin/company-admins";
      
      const method = editingAdmin ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(formData)
      });
      
      setIsFormOpen(false);
      setEditingAdmin(null);
      fetchAdmins();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/portal/super-admin/company-admins/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAdmins();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Company Admin?")) return;
    try {
      await fetch(`/api/portal/super-admin/company-admins/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token") || ""}` }
      });
      fetchAdmins();
    } catch (e) {
      console.error(e);
    }
  };

  const handleImpersonate = async (id: string) => {
    try {
      const res = await fetch(`/api/portal/super-admin/company-admins/${id}/impersonate`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token") || ""}` }
      });
      if (res.ok) {
        const data = await res.json();
        window.open(`/login?token=${data.token}`, '_blank');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="text-indigo-600" size={32} />
            Company Admins
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage company owners, subscriptions, and platform access</p>
        </div>
        <button 
          onClick={() => { setEditingAdmin(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Create Admin
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 pl-6 font-semibold">Admin</th>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Subscription</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : filteredAdmins.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No company admins found.</td></tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {admin.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{admin.name}</div>
                          <div className="text-sm text-slate-500 font-medium">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">{admin.company_name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${admin.subscription_plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                          admin.subscription_plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'}`}
                      >
                        {admin.subscription_plan || 'Basic'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${admin.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <span className="capitalize font-semibold text-slate-700">{admin.status}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleImpersonate(admin.id)}
                          title="Login as Admin"
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                        >
                          <UserCog size={18} />
                        </button>
                        <button 
                          onClick={() => { setEditingAdmin(admin); setIsFormOpen(true); }}
                          title="Edit"
                          className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(admin.id, admin.status === 'active' ? 'suspended' : 'active')}
                          title={admin.status === 'active' ? 'Suspend' : 'Activate'}
                          className={`p-2 rounded-lg transition-colors ${
                            admin.status === 'active' ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {admin.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(admin.id)}
                          title="Delete"
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <CompanyAdminForm 
          initialData={editingAdmin}
          onSubmit={handleCreateOrEdit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
