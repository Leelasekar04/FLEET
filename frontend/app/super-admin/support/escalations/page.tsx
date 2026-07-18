"use client";

import { 
  Search, 
  Filter, 
  LayoutTemplate, 
  MoreVertical,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  AlertTriangle,
  Flame,
  Activity
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const mockEscalations = [
  { id: "ESC-8991", ticketId: "TCK-10039", company: "City Cabs Inc.", reason: "SLA Breached - App Crash", status: "open", severity: "critical", escalatedAt: "2026-07-15 11:30 AM", manager: "Sarah J." },
  { id: "ESC-8990", ticketId: "TCK-10022", company: "Global Shipping", reason: "Enterprise VIP Request", status: "investigating", severity: "high", escalatedAt: "2026-07-14 09:15 AM", manager: "Mike T." },
  { id: "ESC-8989", ticketId: "TCK-09941", company: "Kumar Transport Co.", reason: "Billing Dispute", status: "resolved", severity: "medium", escalatedAt: "2026-07-10 14:20 PM", manager: "Alex R." },
];

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState(mockEscalations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEscalation, setEditingEscalation] = useState<any>(null);

  const escalationFields: EditField[] = [
    { name: 'id', label: 'Escalation ID', type: 'text', disabled: true },
    { name: 'company', label: 'Company', type: 'text', disabled: true },
    { name: 'manager', label: 'Escalation Manager', type: 'text' },
    { name: 'severity', label: 'Severity', type: 'select', options: [
      { label: 'Critical', value: 'critical' },
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
    ]},
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Open', value: 'open' },
      { label: 'Investigating', value: 'investigating' },
      { label: 'Resolved', value: 'resolved' },
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

  const filteredEscalations = escalations.filter(e => {
    const matchesSearch = e.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1" /> Resolved</span>;
    if (status === 'investigating') return <span className="badge badge-warning"><Activity size={12} className="mr-1" /> Investigating</span>;
    if (status === 'open') return <span className="badge badge-error"><AlertTriangle size={12} className="mr-1" /> Open</span>;
    return <span className="badge">{status}</span>;
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'critical') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-100 text-red-700 uppercase flex items-center gap-1 w-fit"><Flame size={10} /> Critical</span>;
    if (severity === 'high') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-orange-100 text-orange-600 uppercase">High</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-100 text-amber-600 uppercase">Medium</span>;
    return null;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Escalations</h1>
          <p className="cmd-banner-sub">
            Monitor SLA breaches, VIP issues, and critical tenant escalations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="cmd-stat-card group hover:border-red-200 transition-colors">
          <div className="cmd-stat-icon bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <Flame size={20} />
          </div>
          <div className="cmd-stat-label">Critical Escalations</div>
          <div className="cmd-stat-value text-slate-900">{escalations.filter(e => e.severity === 'critical' && e.status !== 'resolved').length}</div>
        </div>

        <div className="cmd-stat-card group hover:border-amber-200 transition-colors">
          <div className="cmd-stat-icon bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Clock size={20} />
          </div>
          <div className="cmd-stat-label">SLA Breaches (Week)</div>
          <div className="cmd-stat-value text-slate-900">4</div>
        </div>

        <div className="cmd-stat-card group hover:border-blue-200 transition-colors">
          <div className="cmd-stat-icon bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Activity size={20} />
          </div>
          <div className="cmd-stat-label">Active Investigations</div>
          <div className="cmd-stat-value text-slate-900">{escalations.filter(e => e.status === 'investigating').length}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-2">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search escalations..." 
            className="form-input !pl-10 !h-10 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              className="form-input !pl-9 !h-10 w-full cursor-pointer text-sm font-medium text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-3">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Escalation Details</th>
                <th>Company</th>
                <th>Severity</th>
                <th>Manager</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEscalations.map((esc) => (
                <tr key={esc.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 mt-1">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm max-w-[250px] truncate" title={esc.reason}>
                          {esc.reason}
                        </div>
                        <div className="text-xs font-bold text-slate-500 mt-0.5">{esc.id} • Ref: {esc.ticketId}</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1">Escalated: {esc.escalatedAt}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                      <Building2 size={14} className="text-slate-400" />
                      {esc.company}
                    </div>
                  </td>
                  <td>
                    {getSeverityBadge(esc.severity)}
                  </td>
                  <td>
                    <div className="font-semibold text-slate-700 text-sm">{esc.manager}</div>
                  </td>
                  <td>
                    {getStatusBadge(esc.status)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === esc.id ? null : esc.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === esc.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> View Escalation
                        </button>
                        <button 
                          onClick={() => {
                            setEditingEscalation(esc);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Update Status
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEscalations.length === 0 && (
            <div className="empty-state p-12 flex flex-col items-center">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No escalations found</h3>
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Escalation"
        fields={escalationFields}
        initialData={editingEscalation}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setEscalations(escalations.map(e => e.id === data.id ? { ...e, ...data } : e));
          setToastMessage(`Escalation ${data.id} updated`);
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
