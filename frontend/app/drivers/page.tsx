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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
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
    
    const currentStatus = d.status || 'inactive';
    const matchesStatus = filterStatus === "All" || currentStatus === filterStatus;
    
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
      if (editingId) {
        await fetch(`http://localhost:4000/api/drivers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify(form)
        });
        showToast("Driver updated successfully");
      } else {
        await api.createDriver(form);
        showToast("Driver added successfully");
      }
      await fetchDrivers();
      setForm({ name: "", phone: "", vehicle_no: "", license_no: "" });
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      showToast("Error saving driver", "error");
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
        <div className="flex flex-wrap items-center gap-3 pb-2 md:pb-0">
          <label className="shrink-0 whitespace-nowrap bg-white text-slate-600 hover:text-slate-900 border border-slate-200 h-10 px-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer">
            <Upload size={16} /> Import
            <input type="file" accept=".csv" className="hidden" onChange={(e) => {
              if (e.target.files?.length) {
                showToast(`Selected file: ${e.target.files[0].name}. (CSV Import parsing will be added here)`);
              }
            }} />
          </label>
          <button onClick={handleExport} className="shrink-0 whitespace-nowrap bg-white text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
          <div className="shrink-0 h-6 w-px bg-slate-200 hidden md:block"></div>
          <button onClick={() => setShowBulkModal(true)} className="shrink-0 whitespace-nowrap bg-slate-900 text-white hover:bg-slate-800 border border-transparent h-10 px-4 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all">
            <Truck size={16} /> Bulk Assign
          </button>
          <button className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20" onClick={() => {
            setForm({ name: "", phone: "", vehicle_no: "", license_no: "" });
            setEditingId(null);
            setShowModal(true);
          }}>
            <Plus size={18} /> Add Driver
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: "Total Drivers",   value: drivers.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Active",          value: active,         color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "On Trip",         value: onTrip,         color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Inactive/Leave",  value: drivers.length - active, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 ${s.color} ${s.bg}`}>
              {s.value}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 z-10 relative">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full bg-white border border-slate-200 rounded-xl !pl-12 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400 shadow-sm transition-all"
            placeholder="Search by ID, Name, Phone, License..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 px-4 py-3 pr-10 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm w-full md:w-auto"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 px-4 py-3 pr-10 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm w-full md:w-auto"
            >
              <option value="All">All Vehicle Types</option>
              {vehicleTypes.map((t: any) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => {
              setSearch("");
              setFilterStatus("All");
              setFilterType("All");
            }}
            className="bg-slate-900 border border-slate-900 text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm w-full md:w-auto"
          >
            <Filter size={16} /> Clear
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
                <th className="pl-6 pr-8 py-4 text-right">Actions</th>
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
                        {(d.name || '?').charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          <Link href={`/drivers/${d.id}`}>{d.name || 'Unknown Driver'}</Link>
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusToggle(d.id, d.status || 'inactive')}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${(d.status || 'inactive') === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(d.status || 'inactive') === 'active' ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${(d.status || 'inactive') === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {d.status || 'inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-600">
                    {new Date(d.created_at || Date.now()).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="pl-6 pr-8 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/drivers/${d.id}`} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm" title="View Details">
                        <Eye size={14} />
                      </Link>
                      <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm" title="Assign Vehicle">
                        <Truck size={14} />
                      </button>
                      <button 
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm" 
                        title="Edit Driver"
                        onClick={() => {
                          setForm({ name: d.name || "", phone: d.phone || "", vehicle_no: d.vehicle_no || "", license_no: d.license_no || "" });
                          setEditingId(d.id);
                          setShowModal(true);
                        }}
                      >
                        <Edit2 size={14} />
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
                <Plus className="text-blue-600" /> {editingId ? "Edit Driver" : "Register New Driver"}
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
                  showToast(`Successfully assigned vehicle to ${selectedIds.length} driver(s)!`);
                  setSelectedIds([]);
                  setShowBulkModal(false);
                }}>Assign Vehicle</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-sm transition-all duration-300 translate-y-0 opacity-100 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-white/50 hover:text-white transition-colors ml-2 font-light text-xl leading-none">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
