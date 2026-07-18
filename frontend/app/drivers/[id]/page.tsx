"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Phone, Truck, Calendar, MapPin, CheckCircle, Activity, FileText, CreditCard, Droplets, Map, Edit2, ShieldAlert } from "lucide-react";
import { api, fmt } from "@/lib/api";

export default function DriverDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDriverDetails();
  }, [id]);

  const fetchDriverDetails = async () => {
    try {
      const data = await api.getDriver(id as string);
      setDriver(data);
    } catch (err) {
      console.error("Failed to fetch driver details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center">
        <h2 className="text-xl font-bold text-slate-800">Driver Not Found</h2>
        <button onClick={() => router.push("/drivers")} className="mt-4 text-blue-600 hover:underline">Return to Drivers</button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "trips", label: "Trip History", icon: Map },
    { id: "financials", label: "Financials", icon: CreditCard },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const statCards = [
    { label: "Total Trips", value: driver.trips?.length || 0, icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Current Balance", value: fmt.currency(driver.current_balance || 0), icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Assigned Vehicle", value: driver.vehicle_no || "None", icon: Truck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "License Status", value: "Valid", icon: ShieldAlert, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full pb-12">
      {/* Top Nav */}
      <div className="mb-6">
        <button 
          onClick={() => router.push("/drivers")}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Drivers
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white border-4 border-white shadow-md">
            {driver.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900">{driver.name}</h1>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${driver.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {driver.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {driver.phone}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> Joined {new Date(driver.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <button className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-full md:w-auto justify-center">
            <Edit2 size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
              <s.icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">{s.label}</div>
              <div className="text-lg font-black text-slate-900 leading-tight">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users size={16} className="text-blue-600" /> Personal Details
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Driver ID</div>
                <div className="text-sm font-bold text-slate-900">{driver.employee_id || driver.id.substring(0,8).toUpperCase()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Driving License</div>
                <div className="text-sm font-bold text-slate-900">{driver.license_no || "Not provided"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Branch</div>
                <div className="text-sm font-bold text-slate-900">{driver.branch || "Headquarters"}</div>
              </div>
            </div>
          </div>
          
          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Phone size={16} className="text-rose-500" /> Emergency Contact
              </h3>
            </div>
            <div className="p-5">
              <div className="text-sm font-bold text-slate-900">Spouse / Family</div>
              <div className="text-sm text-slate-500 mt-1">+91 99887 77665</div>
            </div>
          </div>
        </div>

        {/* Right Column - Tabbed Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200/60" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {activeTab === "overview" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                  
                  {(!driver.trips || driver.trips.length === 0) ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                      <Map size={32} className="text-slate-300 mb-3" />
                      <p className="text-slate-500 text-sm font-medium">No recent trips or activity recorded.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {driver.trips.slice(0, 3).map((trip: any) => (
                        <div key={trip.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Truck size={20} className="text-blue-500" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Trip #{trip.trip_code || trip.id.substring(0,8).toUpperCase()}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                <span>{new Date(trip.start_date).toLocaleDateString()}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{trip.distance_km || 0} km</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${trip.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                            {trip.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "trips" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Trip History</h3>
                  </div>
                  {/* Trip list would render fully here */}
                  <p className="text-slate-500 text-sm">Full trip history visualization will be loaded here.</p>
                </div>
              )}

              {activeTab === "financials" && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Batta & Advances</h3>
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="text-sm text-slate-500 font-semibold mb-1">Total Outstanding Balance</div>
                    <div className="text-3xl font-black text-slate-900">{fmt.currency(driver.current_balance || 0)}</div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">KYC & Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={20} /></div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Aadhaar Card</div>
                        <div className="text-xs text-slate-500">Verified on Jan 12, 2026</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={20} /></div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Driving License</div>
                        <div className="text-xs text-slate-500">Expires Oct 2028</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
