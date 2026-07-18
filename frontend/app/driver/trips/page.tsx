"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Route, MapPin, Navigation, Clock, CheckCircle, XCircle, ChevronRight, Truck, User, Plus, Search, Filter, Download } from "lucide-react";
import { api, fmt } from "@/lib/api";
import { useDriverSync } from "@/hooks/useDriverSync";
import Link from "next/link";

type TabType = "Today" | "Upcoming" | "Completed" | "Cancelled";

export default function DriverTripsPage() {
  const router = useRouter();
  const { trips, loading } = useDriverSync();
  const [activeTab, setActiveTab] = useState<TabType>("Today");

  const getFilteredTrips = () => {
    const todayStr = new Date().toLocaleDateString("en-CA");
    switch (activeTab) {
      case "Today":
        return trips.filter(t => {
          const tripDate = t.start_date ? new Date(t.start_date).toLocaleDateString("en-CA") : todayStr;
          return tripDate <= todayStr && (t.status === "active" || t.status === "started" || t.status === "in_progress");
        });
      case "Upcoming":
        return trips.filter(t => {
          const tripDate = t.start_date ? new Date(t.start_date).toLocaleDateString("en-CA") : todayStr;
          return tripDate > todayStr && (t.status === "active" || t.status === "started" || t.status === "in_progress");
        });
      case "Completed":
        return trips.filter(t => t.status === "completed");
      case "Cancelled":
        return trips.filter(t => t.status === "cancelled");
      default:
        return trips;
    }
  };

  const filteredTrips = getFilteredTrips();

  const getStatusBadge = (trip: any) => {
    const s = String(trip.status).toLowerCase();
    if (s === "completed") return <span className="badge badge-completed">Completed</span>;
    if (s === "cancelled") return <span className="badge badge-warning text-red-600 bg-red-100 border-red-300">Cancelled</span>;
    if (s === "in_progress" || s === "started") return <span className="badge badge-active">In Progress</span>;
    
    const todayStr = new Date().toLocaleDateString("en-CA");
    const tripStr = new Date(trip.start_date || new Date()).toLocaleDateString("en-CA");
    
    if (tripStr > todayStr) return <span className="badge badge-warning">Scheduled</span>;
    return <span className="badge badge-active border-indigo-300 text-indigo-700 bg-indigo-100">Assigned</span>;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const handleExport = () => {
    if (filteredTrips.length === 0) {
      alert("No trips to export");
      return;
    }

    const headers = ["Trip ID", "Origin", "Destination", "Start Date", "Vehicle", "Distance (km)", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredTrips.map(t => {
        return [
          t.trip_code || t.id.substring(0,8),
          `"${t.origin}"`,
          `"${t.destination}"`,
          `"${t.start_date || ''}"`,
          `"${t.drivers?.vehicle_no || 'Unassigned'}"`,
          t.distance_km || 0,
          t.status
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trips_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cmd-root p-6 max-w-7xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">My Trips</h1>
          <p className="cmd-banner-sub">
            Manage your assigned trips, track progress, and view historical routes.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <Link href="/driver/trips/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> New Trip Log
          </Link>
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* ── Tabs & Search ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(["Today", "Upcoming", "Completed", "Cancelled"] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search trips..." className="form-input !pl-10 !h-10 text-sm" />
          </div>
          <button className="btn btn-secondary btn-sm !px-3" title="Filter">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* ── Trips Table ── */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        {filteredTrips.length === 0 ? (
          <div className="empty-state">
            <Route size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No trips found</h3>
            <p className="text-sm max-w-sm mx-auto">
              You don't have any trips in this category right now.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Route</th>
                  <th>Date & Time</th>
                  <th>Vehicle</th>
                  <th>Distance</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map(trip => (
                  <tr key={trip.id}>
                    <td className="font-semibold text-slate-900">
                      #{trip.trip_code || trip.id.substring(0,8).toUpperCase()}
                    </td>
                    <td>
                      <div className="text-sm font-semibold text-slate-900">{trip.origin}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> to {trip.destination}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-slate-700">{fmt.date(trip.start_date)}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700 font-medium">{trip.drivers?.vehicle_no || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="text-sm text-slate-700 font-medium">
                      {trip.distance_km ? `${trip.distance_km} km` : "N/A"}
                    </td>
                    <td>{getStatusBadge(trip)}</td>
                    <td className="text-right">
                      <Link 
                        href={`/driver/trips/${trip.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
