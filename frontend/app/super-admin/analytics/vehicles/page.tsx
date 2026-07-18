"use client";

import { Search, FileSpreadsheet, Filter, LayoutTemplate, Truck, MapPin, Activity, Settings2, Edit } from "lucide-react";
import { useState } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const mockVehicles = [
  { id: 1, registration: "KA-01-HD-1234", make: "Tata Sigma", type: "Heavy Truck", company: "Logistics Pro", status: "active", location: "Bangalore, IN" },
  { id: 2, registration: "MH-12-AB-9876", make: "Ashok Leyland", type: "Medium Truck", company: "Swift Movers", status: "maintenance", location: "Mumbai, IN" },
  { id: 3, registration: "DL-04-CD-5678", make: "Mahindra Bolero", type: "Light Commercial", company: "Urban Delivery", status: "active", location: "Delhi, IN" },
  { id: 4, registration: "TN-09-EF-3456", make: "Volvo FH", type: "Heavy Truck", company: "TransCorp", status: "inactive", location: "Chennai, IN" },
  { id: 5, registration: "GJ-01-GH-7890", make: "Tata Ace", type: "Light Commercial", company: "Quick Ship", status: "active", location: "Ahmedabad, IN" },
];

export default function TotalVehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [vehicles, setVehicles] = useState(mockVehicles);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const vehicleFields: EditField[] = [
    { name: 'registration', label: 'Registration', type: 'text' },
    { name: 'make', label: 'Make & Model', type: 'text' },
    { name: 'type', label: 'Vehicle Type', type: 'text' },
    { name: 'company', label: 'Tenant Company', type: 'text', disabled: true },
    { name: 'location', label: 'Current Location', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Active', value: 'active' },
      { label: 'Maintenance', value: 'maintenance' },
      { label: 'Inactive', value: 'inactive' },
    ]},
  ];

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registration.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="badge badge-completed">On Duty</span>;
    if (status === 'maintenance') return <span className="badge badge-warning">Maintenance</span>;
    if (status === 'inactive') return <span className="badge badge-error">Inactive</span>;
    return <span className="badge">{status}</span>;
  };

  const handleExport = () => {
    setToastMessage("Exporting vehicles data to Excel...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Total Vehicles</h1>
          <p className="cmd-banner-sub">
            Monitor all registered vehicles, their status, and current locations across tenants.
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
            placeholder="Search registration or company..."
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
            <option value="active">On Duty</option>
            <option value="maintenance">Maintenance</option>
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
                <th>Registration & Details</th>
                <th>Vehicle Type</th>
                <th>Tenant Company</th>
                <th>Current Location</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Truck size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-wide">{vehicle.registration}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{vehicle.make}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{vehicle.type}</div>
                  </td>
                  <td>
                    <div className="font-bold text-blue-600 text-sm">{vehicle.company}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                      <MapPin size={14} className="text-slate-400" /> {vehicle.location}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(vehicle.status)}
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => {
                        setEditingVehicle(vehicle);
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
          {filteredVehicles.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No vehicles found</h3>
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
        title="Edit Vehicle"
        fields={vehicleFields}
        initialData={editingVehicle}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setVehicles(vehicles.map(v => v.id === data.id ? { ...v, ...data } : v));
          setToastMessage(`Successfully updated vehicle ${data.registration}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Truck size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
