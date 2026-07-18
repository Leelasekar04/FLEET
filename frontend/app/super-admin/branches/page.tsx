"use client";

import { 
  MapPin, Search, Plus, MoreVertical, Edit, Trash2, Filter, Building2, Eye, Phone, Mail, CheckCircle2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const mockBranches = [
  { 
    id: 1, name: "North HQ", company: "Express Logistics", companyCode: "EXP-001",
    location: "New York, NY", manager: "Sarah Jenkins", phone: "+1 555-0101", 
    email: "north@express.com", status: "active", vehicles: 45
  },
  { 
    id: 2, name: "West Coast Hub", company: "Express Logistics", companyCode: "EXP-001",
    location: "Los Angeles, CA", manager: "Mark Torres", phone: "+1 555-0102", 
    email: "west@express.com", status: "active", vehicles: 79
  },
  { 
    id: 3, name: "Downtown Office", company: "City Transit Movers", companyCode: "CTM-082",
    location: "Chicago, IL", manager: "Emily Chen", phone: "+1 555-0201", 
    email: "downtown@citytransit.com", status: "active", vehicles: 45
  },
  { 
    id: 4, name: "East Region Depot", company: "Apex Freight", companyCode: "APX-993",
    location: "Boston, MA", manager: "David Kim", phone: "+1 555-0301", 
    email: "boston@apexfreight.com", status: "inactive", vehicles: 12
  },
  { 
    id: 5, name: "Central Warehouse", company: "Global Supply Co", companyCode: "GSC-442",
    location: "Dallas, TX", manager: "Robert Cole", phone: "+1 555-0401", 
    email: "dallas@globalsupply.com", status: "active", vehicles: 350
  },
];

export default function BranchesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
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

  const filteredBranches = mockBranches.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesCompany = companyFilter === "all" || b.company === companyFilter;
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="badge badge-completed">Active</span>;
    return <span className="badge badge-danger">Inactive</span>;
  };

  const companiesList = Array.from(new Set(mockBranches.map(b => b.company)));

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Branch Management</h1>
          <p className="cmd-banner-sub">
            View and manage organizational branches across all tenant companies.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-primary btn-sm" onClick={() => showToast("Add Branch modal opened")}>
            <Plus size={16} /> Add Branch
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search branch, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !pl-10 !h-10 text-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
            <Filter size={14} /> Filters:
          </div>
          
          <select 
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-auto min-w-[160px]"
          >
            <option value="all">All Companies</option>
            {companiesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input !h-10 text-sm w-full sm:w-auto min-w-[140px]"
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
                <th>Branch Details</th>
                <th>Company (Tenant)</th>
                <th>Location</th>
                <th>Manager / Contact</th>
                <th>Vehicles</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="group">
                  
                  {/* Branch Details */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black shadow-sm">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{branch.name}</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">ID: BR-{branch.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Company */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400" />
                      <div>
                        <div className="font-bold text-slate-700 text-sm">{branch.company}</div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{branch.companyCode}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Location */}
                  <td>
                    <div className="text-sm font-semibold text-slate-700">{branch.location}</div>
                  </td>

                  {/* Manager / Contact */}
                  <td>
                    <div className="font-bold text-slate-900 text-sm">{branch.manager}</div>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><Phone size={10}/> {branch.phone}</div>
                      <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><Mail size={10}/> {branch.email}</div>
                    </div>
                  </td>

                  {/* Vehicles */}
                  <td>
                    <div className="text-sm font-black text-slate-700">{branch.vehicles}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned</div>
                  </td>
                  
                  {/* Status */}
                  <td>
                    {getStatusBadge(branch.status)}
                  </td>
                  
                  {/* Actions */}
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === branch.id ? null : branch.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === branch.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("View Branch modal opened")}>
                          <Eye size={16} className="text-slate-400" /> View Branch
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => showToast("Edit Details modal opened")}>
                          <Edit size={16} className="text-blue-500" /> Edit Details
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => showToast("Branch deleted")}>
                          <Trash2 size={16} /> Delete Branch
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBranches.length === 0 && (
            <div className="empty-state p-12">
              <MapPin size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No branches found</h3>
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
