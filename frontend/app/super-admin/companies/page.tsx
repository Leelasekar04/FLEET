"use client";

import { 
  Building2, Search, Plus, MoreVertical, CheckCircle2, Clock, Ban, 
  Download, FileText, FileSpreadsheet, Eye, Edit, Power, Trash2, LogIn, Filter
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const mockCompanies = [
  { 
    id: 1, name: "Express Logistics", code: "EXP-001", contact: "John Doe", email: "john@express.com", mobile: "+1 234-567-8900",
    plan: "Enterprise", startDate: "Jan 12, 2024", expiryDate: "Jan 12, 2025", users: 45, vehicles: 124, status: "active" 
  },
  { 
    id: 2, name: "City Transit Movers", code: "CTM-082", contact: "Sarah Smith", email: "sarah@citytransit.com", mobile: "+1 987-654-3210",
    plan: "Pro", startDate: "Feb 05, 2024", expiryDate: "Feb 05, 2025", users: 12, vehicles: 45, status: "active" 
  },
  { 
    id: 3, name: "Apex Freight", code: "APX-993", contact: "Mike Johnson", email: "mike@apexfreight.com", mobile: "+1 555-123-4567",
    plan: "Basic", startDate: "Mar 18, 2024", expiryDate: "Mar 18, 2025", users: 5, vehicles: 12, status: "suspended" 
  },
  { 
    id: 4, name: "Global Supply Co", code: "GSC-442", contact: "Emma Wilson", email: "emma@globalsupply.com", mobile: "+1 444-999-8888",
    plan: "Enterprise", startDate: "Nov 22, 2023", expiryDate: "Nov 22, 2024", users: 120, vehicles: 350, status: "trial" 
  },
  { 
    id: 5, name: "Local Delivery Bros", code: "LDB-115", contact: "Tom Brown", email: "tom@localdelivery.com", mobile: "+1 222-333-4444",
    plan: "Pro", startDate: "Apr 02, 2023", expiryDate: "Apr 02, 2024", users: 8, vehicles: 28, status: "expired" 
  },
];

export default function CompaniesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [toastMessage, setToastMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  const companyFields: EditField[] = [
    { name: 'name', label: 'Company Name', type: 'text' },
    { name: 'code', label: 'Company Code', type: 'text' },
    { name: 'contact', label: 'Contact Person', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'mobile', label: 'Mobile Number', type: 'text' },
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

  const filteredCompanies = mockCompanies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="badge badge-completed">Active</span>;
    if (status === 'trial') return <span className="badge badge-active">Trial</span>;
    if (status === 'suspended') return <span className="badge badge-warning">Suspended</span>;
    return <span className="badge badge-danger">Expired</span>;
  };

  const getPlanBadge = (plan: string) => {
    if (plan === 'Enterprise') return <span className="badge bg-purple-100 text-purple-700 border-purple-200">{plan}</span>;
    if (plan === 'Pro') return <span className="badge bg-blue-100 text-blue-700 border-blue-200">{plan}</span>;
    return <span className="badge">{plan}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Tenant Management</h1>
          <p className="cmd-banner-sub">
            Manage companies, subscriptions, and platform access.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm">
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
          <button 
            onClick={() => {
              setEditingCompany(null);
              setIsEditModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Create Company
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search company, code, or contact..."
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
            <option value="trial">Trial</option>
            <option value="expired">Expired</option>
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
                <th>Company & Code</th>
                <th>Contact Person</th>
                <th>Subscription</th>
                <th>Duration</th>
                <th>Usage (Users/Veh)</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="group">
                  
                  {/* Company & Code */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-black shadow-sm">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{company.name}</div>
                        <div className="text-[11px] font-bold text-slate-500 mt-0.5 tracking-wider bg-slate-100 inline-block px-1.5 py-0.5 rounded">{company.code}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact */}
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{company.contact}</div>
                    <div className="text-xs font-medium text-slate-500">{company.email}</div>
                    <div className="text-xs font-medium text-slate-500">{company.mobile}</div>
                  </td>
                  
                  {/* Subscription */}
                  <td>
                    {getPlanBadge(company.plan)}
                  </td>

                  {/* Duration */}
                  <td>
                    <div className="text-xs font-bold text-slate-700">Start: <span className="font-medium text-slate-500">{company.startDate}</span></div>
                    <div className="text-xs font-bold text-slate-700 mt-1">Exp: <span className="font-medium text-slate-500">{company.expiryDate}</span></div>
                  </td>

                  {/* Usage */}
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-black text-slate-700">{company.users}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Users</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div className="text-center">
                        <div className="text-sm font-black text-slate-700">{company.vehicles}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Veh</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td>
                    {getStatusBadge(company.status)}
                  </td>
                  
                  {/* Actions */}
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === company.id ? null : company.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === company.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> View Details
                        </button>
                        <button 
                          onClick={() => {
                            setEditingCompany(company);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Company
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <LogIn size={16} className="text-emerald-500" /> Login As Admin
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        {company.status === 'suspended' ? (
                          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <CheckCircle2 size={16} /> Activate
                          </button>
                        ) : (
                          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                            <Power size={16} /> Suspend
                          </button>
                        )}
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCompanies.length === 0 && (
            <div className="empty-state p-12">
              <Building2 size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No companies found</h3>
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
        title={editingCompany ? "Edit Company" : "Create Company"}
        fields={companyFields}
        initialData={editingCompany}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setToastMessage(`Successfully updated ${data.name}`);
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

