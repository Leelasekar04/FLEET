"use client";

import { Search, Plus, MoreVertical, FileSpreadsheet, Eye, Edit, Power, Trash2, Filter, LayoutTemplate } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const initialFeatures = [
  { id: "feat_1", name: "GPS Access", category: "Core Operations", availableIn: ["Trial", "Basic", "Professional", "Enterprise"], status: "active" },
  { id: "feat_2", name: "Accounting Module", category: "Finance", availableIn: ["Basic", "Professional", "Enterprise"], status: "active" },
  { id: "feat_3", name: "WhatsApp Integration", category: "Communications", availableIn: ["Professional", "Enterprise"], status: "active" },
  { id: "feat_4", name: "API Access", category: "Developer", availableIn: ["Professional", "Enterprise"], status: "active" },
  { id: "feat_5", name: "Multi Branch Access", category: "Core Operations", availableIn: ["Enterprise"], status: "active" },
  { id: "feat_6", name: "Custom Reporting", category: "Analytics", availableIn: ["Enterprise"], status: "beta" },
  { id: "feat_7", name: "Driver App Access", category: "Core Operations", availableIn: ["Trial", "Basic", "Professional", "Enterprise"], status: "active" },
  { id: "feat_8", name: "Fuel Tracking", category: "Fleet Management", availableIn: ["Basic", "Professional", "Enterprise"], status: "active" },
];

export default function FeaturesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [features, setFeatures] = useState(initialFeatures);
  const [toastMessage, setToastMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
    setActiveDropdown(null);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);

  const featureFields: EditField[] = [
    { name: 'name', label: 'Feature Name', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'availableIn', label: 'Available In (comma separated)', type: 'text' },
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

  const filteredFeatures = features.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id: string) => {
    setFeatures(features.map(f => {
      if (f.id === id) {
        const newStatus = f.status === 'active' ? 'beta' : 'active';
        setToastMessage(`Feature status changed to ${newStatus}!`);
        setTimeout(() => setToastMessage(""), 3000);
        return { ...f, status: newStatus };
      }
      return f;
    }));
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: string, id: string) => {
    if (status === 'active') return <button onClick={() => toggleStatus(id)} className="badge badge-completed hover:opacity-80 transition-opacity cursor-pointer">Active</button>;
    if (status === 'beta') return <button onClick={() => toggleStatus(id)} className="badge badge-warning hover:opacity-80 transition-opacity cursor-pointer">Beta</button>;
    return <span className="badge">{status}</span>;
  };

  const getPlanBadge = (name: string) => {
    if (name === 'Enterprise') return <span key={name} className="badge bg-purple-100 text-purple-700 border-purple-200">{name}</span>;
    if (name === 'Professional') return <span key={name} className="badge bg-blue-100 text-blue-700 border-blue-200">{name}</span>;
    if (name === 'Basic') return <span key={name} className="badge bg-indigo-100 text-indigo-700 border-indigo-200">{name}</span>;
    if (name === 'Trial') return <span key={name} className="badge bg-emerald-100 text-emerald-700 border-emerald-200">{name}</span>;
    return <span key={name} className="badge">{name}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Plan Features</h1>
          <p className="cmd-banner-sub">
            Manage global features and access controls per plan.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => showToast("Exporting features to Excel...")}
          >
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingFeature(null);
              setIsEditModalOpen(true);
            }}
          >
            <Plus size={16} /> Add Feature
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search features..."
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
            <option value="beta">Beta</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature Name & ID</th>
                <th>Category</th>
                <th>Available In Plans</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeatures.map((feat) => (
                <tr key={feat.id} className="group">
                  <td>
                    <div className="font-bold text-slate-900 text-sm">{feat.name}</div>
                    <div className="text-[11px] font-bold text-slate-500 mt-0.5 tracking-wider bg-slate-100 inline-block px-1.5 py-0.5 rounded">{feat.id}</div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{feat.category}</div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      {feat.availableIn.map(plan => getPlanBadge(plan))}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(feat.status, feat.id)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === feat.id ? null : feat.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === feat.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("View Details modal opened")}>
                          <Eye size={16} className="text-slate-400" /> View Details
                        </button>
                        <button 
                          onClick={() => {
                            setEditingFeature({
                              ...feat,
                              availableIn: feat.availableIn.join(', ')
                            });
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Feature
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button onClick={() => toggleStatus(feat.id)} className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                          <Power size={16} /> Toggle Status
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => showToast("Feature deleted")}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFeatures.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No features found</h3>
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
        title={editingFeature ? "Edit Feature" : "Create New Feature"}
        fields={featureFields}
        initialData={editingFeature}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          const updatedFeat = {
            ...data,
            id: data.id || `feat_${Date.now()}`,
            availableIn: typeof data.availableIn === 'string' ? data.availableIn.split(',').map((s: string) => s.trim()) : (data.availableIn || [])
          };
          if (editingFeature) {
            setFeatures(features.map(f => f.id === data.id ? { ...f, ...updatedFeat } : f));
          } else {
            setFeatures([...features, { ...updatedFeat, status: 'active' }]);
          }
          setToastMessage(`Successfully saved ${data.name}`);
          setTimeout(() => setToastMessage(""), 3000);
          setIsEditModalOpen(false);
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
