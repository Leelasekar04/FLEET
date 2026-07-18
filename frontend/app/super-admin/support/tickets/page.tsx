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
  MessageSquare,
  Building2,
  AlertCircle,
  Tag
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const mockTickets = [
  { id: "TCK-10042", subject: "Billing issue on renewal", company: "Kumar Transport Co.", status: "open", priority: "high", created: "2026-07-15 09:30 AM", agent: "Unassigned" },
  { id: "TCK-10041", subject: "GPS sync failing for truck DL-01", company: "Swift Delivery", status: "in_progress", priority: "medium", created: "2026-07-14 14:15 PM", agent: "Sarah J." },
  { id: "TCK-10040", subject: "How to add new drivers?", company: "Apex Freight", status: "resolved", priority: "low", created: "2026-07-13 11:20 AM", agent: "Mike T." },
  { id: "TCK-10039", subject: "App crashing on iOS 17", company: "City Cabs Inc.", status: "open", priority: "high", created: "2026-07-12 16:45 PM", agent: "Sarah J." },
  { id: "TCK-10038", subject: "Invoice formatting error", company: "Global Shipping", status: "resolved", priority: "medium", created: "2026-07-11 10:00 AM", agent: "Alex R." },
];

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);

  const ticketFields: EditField[] = [
    { name: 'id', label: 'Ticket ID', type: 'text', disabled: true },
    { name: 'subject', label: 'Subject', type: 'text', disabled: true },
    { name: 'agent', label: 'Assigned Agent', type: 'text' },
    { name: 'priority', label: 'Priority', type: 'select', options: [
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' },
    ]},
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Open', value: 'open' },
      { label: 'In Progress', value: 'in_progress' },
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

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1" /> Resolved</span>;
    if (status === 'in_progress') return <span className="badge badge-warning"><Clock size={12} className="mr-1" /> In Progress</span>;
    if (status === 'open') return <span className="badge badge-error"><AlertCircle size={12} className="mr-1" /> Open</span>;
    return <span className="badge">{status}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-100 text-red-600 uppercase">High</span>;
    if (priority === 'medium') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-100 text-amber-600 uppercase">Medium</span>;
    if (priority === 'low') return <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-100 text-slate-600 uppercase">Low</span>;
    return null;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Support Tickets</h1>
          <p className="cmd-banner-sub">
            Manage and resolve support requests from tenant companies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        <div className="cmd-stat-card group hover:border-red-200 transition-colors">
          <div className="cmd-stat-icon bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <AlertCircle size={20} />
          </div>
          <div className="cmd-stat-label">Open Tickets</div>
          <div className="cmd-stat-value text-slate-900">{tickets.filter(t => t.status === 'open').length}</div>
        </div>

        <div className="cmd-stat-card group hover:border-amber-200 transition-colors">
          <div className="cmd-stat-icon bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Clock size={20} />
          </div>
          <div className="cmd-stat-label">Avg Resolution Time</div>
          <div className="cmd-stat-value text-slate-900">4.2 hrs</div>
        </div>

        <div className="cmd-stat-card group hover:border-emerald-200 transition-colors">
          <div className="cmd-stat-icon bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <CheckCircle2 size={20} />
          </div>
          <div className="cmd-stat-label">CSAT Score</div>
          <div className="cmd-stat-value text-slate-900">94%</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-2">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search tickets by ID, subject, or company..." 
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
              <option value="in_progress">In Progress</option>
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
                <th>Ticket Info</th>
                <th>Company</th>
                <th>Priority</th>
                <th>Agent</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-1">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm max-w-[250px] truncate" title={ticket.subject}>
                          {ticket.subject}
                        </div>
                        <div className="text-xs font-bold text-slate-500 mt-0.5">{ticket.id} • {ticket.created}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                      <Building2 size={14} className="text-slate-400" />
                      {ticket.company}
                    </div>
                  </td>
                  <td>
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td>
                    <div className="font-semibold text-slate-700 text-sm">{ticket.agent}</div>
                  </td>
                  <td>
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === ticket.id ? null : ticket.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === ticket.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> View Thread
                        </button>
                        <button 
                          onClick={() => {
                            setEditingTicket(ticket);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Ticket
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && (
            <div className="empty-state p-12 flex flex-col items-center">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No tickets found</h3>
              <p className="text-sm text-slate-500 max-w-sm text-center">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Ticket"
        fields={ticketFields}
        initialData={editingTicket}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setTickets(tickets.map(t => t.id === data.id ? { ...t, ...data } : t));
          setToastMessage(`Ticket ${data.id} updated`);
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
