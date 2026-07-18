// API client utility
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const isDriverRoute = typeof window !== "undefined" && (window.location.pathname.startsWith('/driver/') || window.location.pathname === '/driver');
  const token = typeof window !== "undefined" 
    ? (isDriverRoute ? localStorage.getItem("driver_token") : (localStorage.getItem("token") || localStorage.getItem("driver_token"))) 
    : null;
    
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    if (res.status === 401 && typeof window !== "undefined") {
      const p = window.location.pathname;
      const isDriverRoute = p.startsWith('/driver/') || p === '/driver';
      localStorage.removeItem(isDriverRoute ? "driver_token" : "token");
      localStorage.removeItem(isDriverRoute ? "driver_profile" : "user");
      window.location.href = isDriverRoute ? "/driver/login" : "/login";
    }
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  // Dashboard
  getDashboard: () => fetcher<any>("/api/ledger/dashboard"),

  // Drivers
  getDrivers: () => fetcher<any>("/api/drivers"),
  getDriver: (id: string) => fetcher<any>(`/api/drivers/${id}`),
  createDriver: (data: any) => fetcher<any>("/api/drivers", {
    method: "POST", body: JSON.stringify(data),
  }),
  updateDriver: (id: string, data: any) => fetcher<any>(`/api/drivers/${id}`, {
    method: "PUT", body: JSON.stringify(data),
  }),

  // Trips
  getTrips: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetcher<any>(`/api/trips${qs}`);
  },
  getActiveTrips: () => fetcher<any>("/api/trips/active"),
  getTrip: (id: string) => fetcher<any>(`/api/trips/${id}`),
  startTrip: (data: any) => fetcher<any>("/api/trips/start", {
    method: "POST", body: JSON.stringify(data),
  }),
  endTrip: (id: string) => fetcher<any>(`/api/trips/${id}/end`, { method: "POST" }),
  topUpBatta: (id: string, amount: number) => fetcher<any>(`/api/trips/${id}/topup`, {
    method: "POST", body: JSON.stringify({ amount }),
  }),

  // Expenses
  getExpenses: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetcher<any>(`/api/expenses${qs}`);
  },
  createExpense: (data: any) => fetcher<any>("/api/expenses", {
    method: "POST", body: JSON.stringify(data),
  }),
  getTodayExpenses: () => fetcher<any>("/api/expenses/today"),
  getExpenseSummary: () => fetcher<any>("/api/expenses/summary"),
  approveExpense: (id: string, action: "Approve" | "Reject") => fetcher<any>(`/api/expenses/${id}`, {
    method: "PUT", body: JSON.stringify({ action }),
  }),
  
  // Vehicles
  getVehicles: () => fetcher<any>("/api/vehicles"),
  createVehicle: (data: any) => fetcher<any>("/api/vehicles", {
    method: "POST", body: JSON.stringify(data),
  }),

  // Ledger
  getTripLedger: (tripId: string) => fetcher<any>(`/api/ledger/trip/${tripId}`),
  getDriverLedger: (driverId: string) => fetcher<any>(`/api/ledger/driver/${driverId}`),

  // Invoices
  getInvoices: () => fetcher<any>("/api/invoices"),
  getInvoice: (id: string) => fetcher<any>(`/api/invoices/${id}`),
  createInvoice: (data: any) => fetcher<any>("/api/invoices", {
    method: "POST", body: JSON.stringify(data),
  }),

  // Assignments
  getAssignments: () => fetcher<any>("/api/assignments"),
  createAssignment: (data: any) => fetcher<any>("/api/assignments", {
    method: "POST", body: JSON.stringify(data),
  }),
  updateAssignment: (id: string, data: any) => fetcher<any>(`/api/assignments/${id}`, {
    method: "PUT", body: JSON.stringify(data),
  }),

  // Auth
  login: (email: string, password: string) => fetcher<any>("/api/auth/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  }),

  // Driver Portal
  getDriverMe: () => fetcher<any>("/api/portal/driver/me"),
  getDriverExpenses: () => fetcher<any>("/api/portal/driver/expenses"),
  submitDriverExpense: (data: any) => fetcher<any>("/api/portal/driver/expenses", {
    method: "POST", body: JSON.stringify(data),
  }),
};

// Formatter helpers
export const fmt = {
  currency: (n: number) => `₹${new Intl.NumberFormat("en-IN").format(n)}`,
  date: (d: string) => new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }),
  time: (d: string) => new Date(d).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  }),
  datetime: (d: string) => `${fmt.date(d)}, ${fmt.time(d)}`,
  percent: (n: number) => `${n.toFixed(1)}%`,
};
