"use client";

import { Search, FileSpreadsheet, Filter, LayoutTemplate, Users, MapPin, Activity, Settings2, Edit } from "lucide-react";
import { useState } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const mockDrivers = [
  { id: 1, name: "Ramesh Kumar", phone: "+91 9876543210", license: "DL-14-1998-1234", company: "Logistics Pro", status: "active", location: "Bangalore, IN", rating: "4.8" },
  { id: 2, name: "Suresh Singh", phone: "+91 8765432109", license: "MH-12-2001-9876", company: "Swift Movers", status: "off-duty", location: "Mumbai, IN", rating: "4.5" },
  { id: 3, name: "Abdul Rehman", phone: "+91 7654321098", license: "KA-05-2010-5678", company: "Urban Delivery", status: "active", location: "Delhi, IN", rating: "4.9" },
  { id: 4, name: "Manoj Yadav", phone: "+91 6543210987", license: "TN-09-2005-3456", company: "TransCorp", status: "inactive", location: "Chennai, IN", rating: "4.2" },
  { id: 5, name: "Vijay Patel", phone: "+91 5432109876", license: "GJ-01-2015-7890", company: "Quick Ship", status: "active", location: "Ahmedabad, IN", rating: "4.7" },
];

export default function TotalDriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [drivers, setDrivers] = useState(mockDrivers);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);

  const driverFields: EditField[] = [
    { name: 'name', label: 'Driver Name', type: 'text' },
    { name: 'phone', label: 'Phone Number', type: 'text' },
    { name: 'license', label: 'License Number', type: 'text' },
    { name: 'company', label: 'Tenant Company', type: 'text', disabled: true },
    { name: 'location', label: 'Last Location', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Active', value: 'active' },
      { label: 'Off Duty', value: 'off-duty' },
      { label: 'Inactive', value: 'inactive' },
    ]},
  ];

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="badge badge-completed">On Duty</span>;
    if (status === 'off-duty') return <span className="badge badge-warning">Off Duty</span>;
    if (status === 'inactive') return <span className="badge badge-error">Inactive</span>;
    return <span className="badge">{status}</span>;
  };

  const handleExport = () => {
    setToastMessage("Exporting drivers data to Excel...");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Total Drivers</h1>
          <p className="cmd-banner-sub">
            Monitor registered drivers, licensing details, and live status across tenants.
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
            placeholder="Search name or company..."
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
            <option value="off-duty">Off Duty</option>
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
                <th>Driver Details</th>
                <th>License Number</th>
                <th>Tenant Company</th>
                <th>Last Location</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-wide">{driver.name}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{driver.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{driver.license}</div>
                    <div className="text-[10px] font-bold text-yellow-600 bg-yellow-50 inline-block px-1.5 py-0.5 rounded mt-1">★ {driver.rating}</div>
                  </td>
                  <td>
                    <div className="font-bold text-blue-600 text-sm">{driver.company}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                      <MapPin size={14} className="text-slate-400" /> {driver.location}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(driver.status)}
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => {
                        setEditingDriver(driver);
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
          {filteredDrivers.length === 0 && (
            <div className="empty-state p-12">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No drivers found</h3>
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
        title="Edit Driver"
        fields={driverFields}
        initialData={editingDriver}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setDrivers(drivers.map(d => d.id === data.id ? { ...d, ...data } : d));
          setToastMessage(`Successfully updated driver ${data.name}`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Users size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
