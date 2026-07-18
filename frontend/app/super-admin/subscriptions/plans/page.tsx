"use client";

import { Search, Plus, MoreVertical, FileSpreadsheet, Eye, Edit, Power, Trash2, Filter, LayoutTemplate } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const initialPlans = [
  { id: 1, name: "Trial", code: "PLN-TRL", price: "$0", duration: "14 Days", users: 3, vehicles: 5, storage: "1GB", status: "active" },
  { id: 2, name: "Basic", code: "PLN-BSC", price: "$49/mo", duration: "Monthly", users: 10, vehicles: 20, storage: "10GB", status: "active" },
  { id: 3, name: "Professional", code: "PLN-PRO", price: "$149/mo", duration: "Monthly", users: 25, vehicles: 100, storage: "50GB", status: "active" },
  { id: 4, name: "Enterprise", code: "PLN-ENT", price: "Custom", duration: "Annual", users: "Unlimited", vehicles: "Unlimited", storage: "Unlimited", status: "active" },
];

export default function PlansManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [plans, setPlans] = useState(initialPlans);
  const [toastMessage, setToastMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
    setActiveDropdown(null);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const planFields: EditField[] = [
    { name: 'name', label: 'Plan Name', type: 'text' },
    { name: 'code', label: 'Plan Code', type: 'text' },
    { name: 'price', label: 'Price', type: 'text' },
    { name: 'duration', label: 'Duration', type: 'text' },
    { name: 'users', label: 'Users Limit', type: 'text' },
    { name: 'vehicles', label: 'Vehicles Limit', type: 'text' },
    { name: 'storage', label: 'Storage', type: 'text' },
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

  const filteredPlans = plans.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id: number) => {
    setPlans(plans.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'active' ? 'inactive' : 'active';
        setToastMessage(`Plan ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
        setTimeout(() => setToastMessage(""), 3000);
        return { ...p, status: newStatus };
      }
      return p;
    }));
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: string, id: number) => {
    if (status === 'active') return <button onClick={() => toggleStatus(id)} className="badge badge-completed hover:opacity-80 transition-opacity cursor-pointer">Active</button>;
    if (status === 'inactive') return <button onClick={() => toggleStatus(id)} className="badge badge-warning hover:opacity-80 transition-opacity cursor-pointer">Inactive</button>;
    return <span className="badge">{status}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Subscription Plans</h1>
          <p className="cmd-banner-sub">
            Manage subscription tiers, pricing, and resource limits.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setToastMessage("Exporting plans to Excel...");
              setTimeout(() => setToastMessage(""), 3000);
            }}
          >
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} /> Create Plan
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search plans or codes..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan Name & Code</th>
                <th>Price & Duration</th>
                <th>Usage Limits</th>
                <th>Storage</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black shadow-sm">
                        {plan.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{plan.name}</div>
                        <div className="text-[11px] font-bold text-slate-500 mt-0.5 tracking-wider bg-slate-100 inline-block px-1.5 py-0.5 rounded">{plan.code}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-black text-slate-700 text-sm">{plan.price}</div>
                    <div className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{plan.duration}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-black text-slate-700">{plan.users}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Users</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div className="text-center">
                        <div className="text-sm font-black text-slate-700">{plan.vehicles}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Veh</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{plan.storage}</div>
                  </td>
                  <td>
                    {getStatusBadge(plan.status, plan.id)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === plan.id ? null : plan.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === plan.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("View Details modal opened")}>
                          <Eye size={16} className="text-slate-400" /> View Details
                        </button>
                        <button 
                          onClick={() => {
                            setEditingPlan(plan);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Plan
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        {plan.status === 'inactive' ? (
                          <button onClick={() => toggleStatus(plan.id)} className="w-full text-left px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <Power size={16} /> Activate
                          </button>
                        ) : (
                          <button onClick={() => toggleStatus(plan.id)} className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                            <Power size={16} /> Deactivate
                          </button>
                        )}
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => showToast("Plan deleted")}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPlans.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No plans found</h3>
              <p className="text-sm max-w-sm mx-auto">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <EditModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Plan"
        fields={planFields}
        initialData={null}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          const newId = Math.max(...plans.map(p => p.id), 0) + 1;
          setPlans([...plans, { ...data, id: newId, status: 'active' }]);
          setToastMessage(`Successfully created ${data.name}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subscription Plan"
        fields={planFields}
        initialData={editingPlan}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setPlans(plans.map(p => p.id === data.id ? { ...p, ...data } : p));
          setToastMessage(`Successfully updated ${data.name}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <LayoutTemplate size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

