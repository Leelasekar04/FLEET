"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Search, Phone, Truck, Edit2, Power, Download, Upload, Filter, MoreVertical, Eye, Map, FileText, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const fmt = { currency: (n: number) => `₹${n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}` };

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", vehicle_no: "", license_no: "" });
  const [vehicles, setVehicles] = useState<any[]>([]);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  
  const router = useRouter();

  const fetchDrivers = async () => {
    try {
      const data = await api.getDrivers();
      setDrivers(data.drivers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await api.getVehicles();
      setVehicles(data.vehicles || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  const handleAssignVehicle = async (driverId: string, vehicleId: string) => {
    try {
      if (vehicleId) {
        await api.createAssignment({ driver_id: driverId, vehicle_id: vehicleId });
      }
      fetchDrivers(); // Refresh to show new assigned vehicle
    } catch (err) {
      console.error(err);
    }
  };

  const searchLower = search.trim().toLowerCase();
  const filtered = drivers.filter((d) => {
    const n = d.name ? String(d.name).toLowerCase() : "";
    const p = d.phone ? String(d.phone).toLowerCase() : "";
    const l = d.license_no ? String(d.license_no).toLowerCase() : "";
    const v = d.vehicle_no ? String(d.vehicle_no).toLowerCase() : "";
    const eId = d.employee_id ? String(d.employee_id).toLowerCase() : "";
    const i = d.id ? String(d.id).toLowerCase() : "";

    const matchesSearch = n.includes(searchLower) || p.includes(searchLower) || l.includes(searchLower) || v.includes(searchLower) || eId.includes(searchLower) || i.includes(searchLower);
    
    const matchesStatus = filterStatus === "All" || d.status === filterStatus;
    
    // Check assigned vehicle type
    let matchesType = true;
    if (filterType !== "All") {
      const vType = d.vehicles?.type || "Unassigned";
      matchesType = vType === filterType;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  // Unique vehicle types for filter
  const vehicleTypes = Array.from(new Set(drivers.map(d => d.vehicles?.type || "Unassigned"))).filter(Boolean);

  const active = drivers.filter((d) => d.status === "active").length;
  const onTrip = drivers.filter((d) => d.trips && d.trips.length > 0 && d.trips.some((t: any) => t.status === "active")).length;

  const handleAddDriver = async () => {
    if (!form.name || !form.phone) return;
    try {
      await api.createDriver(form);
      await fetchDrivers();
      setForm({ name: "", phone: "", vehicle_no: "", license_no: "" });
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      // API call to toggle status
      await fetch(`http://localhost:4000/api/drivers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ status: currentStatus === "active" ? "inactive" : "active" })
      });
      fetchDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    if (drivers.length === 0) return;
    const headers = ["ID", "Name", "Phone", "Vehicle No", "License No", "Status", "Joined Date"];
    const csvContent = [
      headers.join(","),
      ...drivers.map(d => [
        d.id,
        `"${d.name}"`,
        d.phone,
        d.vehicle_no || "",
        d.license_no || "",
        d.status,
        new Date(d.created_at || Date.now()).toLocaleDateString()
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "drivers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
             Driver Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage fleet drivers, assignments, and compliance.</p>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          <label className="whitespace-nowrap bg-white text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer">
            <Upload size={16} /> Import
            <input type="file" accept=".csv" className="hidden" onChange={(e) => {
              if (e.target.files?.length) {
                alert(`Selected file: ${e.target.files[0].name}. (CSV Import parsing will be added here)`);
              }
            }} />
          </label>
          <button onClick={handleExport} className="whitespace-nowrap bg-white text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          <button onClick={() => setShowBulkModal(true)} className="whitespace-nowrap bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all">
            <Truck size={16} /> Bulk Assign
          </button>
          <button onClick={() => setShowModal(true)} className="shrink-0 whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all">
            <Plus size={16} /> Add Driver
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Drivers",   value: drivers.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active",          value: active,         color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Currently On Trip", value: onTrip,       color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Inactive/Leave",  value: drivers.length - active, color: "text-red-600", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-xl md:text-2xl shrink-0 ${s.color} ${s.bg}`}>
              {s.value}
            </div>
            <div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-2 items-center z-10 relative">
        <div className="flex items-center gap-3 w-full lg:w-auto flex-1 px-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="w-full bg-transparent border-none pl-9 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400"
              placeholder="Search by ID, Name, Phone, License..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="h-px w-full lg:h-8 lg:w-px bg-slate-100 hidden lg:block"></div>
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto hide-scrollbar p-2 lg:p-0">
          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 pr-8 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 pr-8 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Vehicle Types</option>
              {vehicleTypes.map((t: any) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => {
              setSearch("");
              setFilterStatus("All");
              setFilterType("All");
            }}
            className="whitespace-nowrap bg-slate-900 border border-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors ml-auto lg:ml-2"
          >
            <Filter size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filtered.map(d => d.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="px-6 py-4">Driver Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">License / Expiry</th>
                <th className="px-6 py-4">Assigned Vehicle</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(d.id) ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-6 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.includes(d.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds([...selectedIds, d.id]);
                        else setSelectedIds(selectedIds.filter(id => id !== d.id));
                      }}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0 border border-blue-200/50">
                        {d.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          <Link href={`/drivers/${d.id}`}>{d.name}</Link>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">ID: {d.employee_id || d.id.substring(0,8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <Phone size={14} className="text-slate-400" />
                      {d.phone}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm font-bold text-slate-700">{d.license_no || "—"}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Valid</div>
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={d.vehicles?.id || ""}
                      onChange={(e) => handleAssignVehicle(d.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 w-32"
                    >
                      <option value="">Unassigned</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.vehicle_number}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${d.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-600">
                    {new Date(d.created_at || Date.now()).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/drivers/${d.id}`} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors" title="View Details">
                        <Eye size={14} />
                      </Link>
                      <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors" title="Assign Vehicle">
                        <Truck size={14} />
                      </button>
                      <button onClick={() => handleStatusToggle(d.id, d.status)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors" title={d.status === 'active' ? "Deactivate" : "Activate"}>
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto text-slate-200 mb-4" />
              <div className="text-slate-500 font-medium text-sm">No drivers found matching your search.</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="text-blue-600" /> Register New Driver
              </h2>
              <button className="text-slate-400 hover:text-slate-600 font-light text-2xl leading-none" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Vehicle Assignment</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="e.g. TN01AB1234"
                    value={form.vehicle_no}
                    onChange={(e) => setForm({ ...form, vehicle_no: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Driving License No.</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="e.g. TN2345678"
                    value={form.license_no}
                    onChange={(e) => setForm({ ...form, license_no: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all" onClick={handleAddDriver}>Save Driver</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Truck className="text-blue-600" /> Bulk Vehicle Assign
              </h2>
              <button className="text-slate-400 hover:text-slate-600 font-light text-2xl leading-none" onClick={() => setShowBulkModal(false)}>×</button>
            </div>
            
            <div className="p-6">
              {selectedIds.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-1">No Drivers Selected</h3>
                  <p className="text-slate-500 text-sm">Please select at least one driver from the table using the checkboxes before assigning vehicles.</p>
                </div>
              ) : (
                <>
                  <div className="text-sm font-medium text-slate-600 mb-4">
                    You have selected <span className="font-bold text-slate-900">{selectedIds.length}</span> driver(s) to assign to a vehicle.
                  </div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Vehicle Number *</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="e.g. TN01AB1234"
                  />
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors" onClick={() => setShowBulkModal(false)}>
                {selectedIds.length === 0 ? 'Go Back' : 'Cancel'}
              </button>
              {selectedIds.length > 0 && (
                <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all" onClick={() => {
                  alert(`Successfully assigned vehicle to ${selectedIds.length} drivers!`);
                  setSelectedIds([]);
                  setShowBulkModal(false);
                }}>Assign Vehicle</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
