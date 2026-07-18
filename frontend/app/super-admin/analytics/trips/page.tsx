"use client";

import { Search, FileSpreadsheet, Filter, LayoutTemplate, Route, MapPin, Calendar, Clock, Edit } from "lucide-react";
import { useState } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const mockTrips = [
  { id: "TRP-1001", vehicle: "KA-01-HD-1234", driver: "Ramesh Kumar", company: "Logistics Pro", origin: "Bangalore", destination: "Chennai", status: "in-transit", date: "2026-07-15", distance: "350 km" },
  { id: "TRP-1002", vehicle: "MH-12-AB-9876", driver: "Suresh Singh", company: "Swift Movers", origin: "Mumbai", destination: "Pune", status: "completed", date: "2026-07-14", distance: "150 km" },
  { id: "TRP-1003", vehicle: "DL-04-CD-5678", driver: "Abdul Rehman", company: "Urban Delivery", origin: "Delhi", destination: "Agra", status: "in-transit", date: "2026-07-15", distance: "230 km" },
  { id: "TRP-1004", vehicle: "TN-09-EF-3456", driver: "Manoj Yadav", company: "TransCorp", origin: "Chennai", destination: "Madurai", status: "cancelled", date: "2026-07-13", distance: "460 km" },
  { id: "TRP-1005", vehicle: "GJ-01-GH-7890", driver: "Vijay Patel", company: "Quick Ship", origin: "Ahmedabad", destination: "Surat", status: "completed", date: "2026-07-12", distance: "260 km" },
];

export default function TripsAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [trips, setTrips] = useState(mockTrips);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);

  const tripFields: EditField[] = [
    { name: 'vehicle', label: 'Vehicle', type: 'text' },
    { name: 'driver', label: 'Driver', type: 'text' },
    { name: 'origin', label: 'Origin', type: 'text' },
    { name: 'destination', label: 'Destination', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'In Transit', value: 'in-transit' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' },
    ]},
  ];

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'in-transit') return <span className="badge badge-active">In Transit</span>;
    if (status === 'completed') return <span className="badge badge-completed">Completed</span>;
    if (status === 'cancelled') return <span className="badge badge-error">Cancelled</span>;
    return <span className="badge">{status}</span>;
  };

  const handleExport = () => {
    setToastMessage("Exporting trips data to Excel...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Trips Analytics</h1>
          <p className="cmd-banner-sub">
            Analyze cross-tenant trip logs, statuses, and route performance.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search trip ID or company..."
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
            <option value="in-transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trip Reference</th>
                <th>Route Details</th>
                <th>Tenant Company</th>
                <th>Date & Distance</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Route size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-wide">{trip.id}</div>
                        <div className="text-[11px] font-bold text-slate-500 mt-0.5 tracking-wider bg-slate-100 inline-block px-1.5 py-0.5 rounded">{trip.vehicle}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-700 text-sm">{trip.origin}</div>
                      <span className="text-slate-300">→</span>
                      <div className="font-bold text-slate-700 text-sm">{trip.destination}</div>
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">Driver: {trip.driver}</div>
                  </td>
                  <td>
                    <div className="font-bold text-blue-600 text-sm">{trip.company}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm font-bold">
                      <Calendar size={14} className="text-slate-400" /> {trip.date}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5 ml-5">{trip.distance}</div>
                  </td>
                  <td>
                    {getStatusBadge(trip.status)}
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => {
                        setEditingTrip(trip);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrips.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No trips found</h3>
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
        title="Edit Trip"
        fields={tripFields}
        initialData={editingTrip}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setTrips(trips.map(t => t.id === data.id ? { ...t, ...data } : t));
          setToastMessage(`Successfully updated trip ${data.id}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Route size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
