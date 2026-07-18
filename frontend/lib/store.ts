// Zustand global store for Fleet Manager
import { create } from "zustand";

// ─── Types ─────────────────────────────────────────────────
export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle_no?: string;
  license_no?: string;
  status: "active" | "inactive" | "suspended";
}

export interface Trip {
  id: string;
  code: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination: string;
  start: string;
  opening_batta: number;
  spent: number;
  expenses: number;
  status: "active" | "completed" | "cancelled";
}

export interface Expense {
  id: string;
  driver: string;
  trip: string;
  type: string;
  amount: number;
  location: string;
  via: string;
  confidence: number;
  created_at: string;
  notes: string;
}

export interface LedgerEntry {
  id: string;
  trip_id: string;
  type: "opening" | "credit" | "debit" | "topup" | "settlement";
  amount: number;
  balance: number;
  desc: string;
  at: string;
}

export interface FuelEntry {
  id: string;
  date: string;
  driver: string;
  vehicle: string;
  trip: string | null; // Trip code or ID
  station: string;
  liters: number;
  rate: number;
  amount: number;
  odometer: number;
  prev_odometer: number;
  mileage: number;
}

export interface DashboardStats {
  active_trips: number;
  driver_count: number;
  today_expenses: number;
  today_spend: number;
  outstanding_batta: number;
  active_trips_detail: Trip[];
  today_expenses_detail: Expense[];
}

// ─── Initial Mock Data ──────────────────────────────────────
const initialTrips: Trip[] = [
  { id: "1", code: "TRIP-8821", driver: "Ramesh Kumar", vehicle: "TN01AB1234", origin: "Chennai", destination: "Hyderabad", start: "Jul 5, 2026", opening_batta: 15000, spent: 2500, expenses: 12, status: "active" },
  { id: "2", code: "TRIP-8820", driver: "Suresh Babu",  vehicle: "TN02CD5678", origin: "Bangalore", destination: "Mumbai",   start: "Jul 5, 2026", opening_batta: 18000, spent: 9800, expenses: 21, status: "active" },
  { id: "3", code: "TRIP-8819", driver: "Muthu Raja",   vehicle: "TN03EF9012", origin: "Madurai",   destination: "Pune",     start: "Jul 4, 2026", opening_batta: 20000, spent: 3200, expenses: 8, status: "active" },
];

const initialLedger: LedgerEntry[] = [
  { id: "1", trip_id: "1", type: "opening", amount: 15000, balance: 15000, desc: "Trip started. Opening batta allocated.", at: "2026-07-05T08:00:00Z" },
  { id: "2", trip_id: "1", type: "debit", amount: 2500, balance: 12500, desc: "Initial expenses logged.", at: "2026-07-05T10:00:00Z" }
];

const initialExpenses: Expense[] = [
  { id: "1",  driver: "Ramesh Kumar",  trip: "TRIP-8821", type: "Diesel",      amount: 3500, location: "Chennai",     via: "image", confidence: 0.92, created_at: "2026-07-07T12:32:00Z", notes: "Full tank at HP petrol pump" },
  { id: "2",  driver: "Suresh Babu",   trip: "TRIP-8820", type: "Toll",         amount: 180,  location: "Krishnagiri", via: "text",  confidence: 0.98, created_at: "2026-07-07T11:54:00Z", notes: "Toll paid at Krishnagiri" },
];

// ─── Store ──────────────────────────────────────────────────
interface FleetStore {
  // Data
  stats: DashboardStats | null;
  drivers: Driver[];
  trips: Trip[];
  expenses: Expense[];
  ledger: LedgerEntry[];
  fuelEntries: FuelEntry[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  setStats: (stats: DashboardStats) => void;
  setDrivers: (drivers: Driver[]) => void;
  setTrips: (trips: Trip[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  setLedger: (ledger: LedgerEntry[]) => void;
  setFuelEntries: (fuelEntries: FuelEntry[]) => void;
  
  // Sync Actions
  addTopUp: (tripId: string, amount: number) => void;
  addFuelEntry: (entry: FuelEntry) => void;
  endTrip: (tripId: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFleetStore = create<FleetStore>((set) => ({
  stats: null,
  drivers: [],
  trips: initialTrips,
  expenses: initialExpenses,
  ledger: initialLedger,
  fuelEntries: [],
  isLoading: false,
  error: null,

  setStats: (stats) => set({ stats }),
  setDrivers: (drivers) => set({ drivers }),
  setTrips: (trips) => set({ trips }),
  setExpenses: (expenses) => set({ expenses }),
  setLedger: (ledger) => set({ ledger }),
  setFuelEntries: (fuelEntries) => set({ fuelEntries }),

  addTopUp: (tripId, amount) => set((state) => {
    const tripEntries = state.ledger.filter(e => e.trip_id === tripId);
    const lastBalance = tripEntries.length ? tripEntries[tripEntries.length - 1].balance : 0;
    
    const newEntry: LedgerEntry = {
      id: Math.random().toString(),
      trip_id: tripId,
      type: "topup",
      amount,
      balance: lastBalance + amount,
      desc: `Batta top-up of ₹${amount}`,
      at: new Date().toISOString()
    };
    
    const updatedTrips = state.trips.map(t => 
      t.id === tripId ? { ...t, opening_batta: t.opening_batta + amount } : t
    );

    const tripObj = state.trips.find(t => t.id === tripId);
    
    const newExpense: Expense = {
      id: Math.random().toString(),
      driver: tripObj ? tripObj.driver : "Unknown",
      trip: tripObj ? tripObj.code : "Unknown",
      type: "Batta Top-up",
      amount: amount,
      location: "System",
      via: "text",
      confidence: 1.0,
      created_at: new Date().toISOString(),
      notes: `Batta top-up added manually`
    };
    
    return { 
      ledger: [...state.ledger, newEntry],
      trips: updatedTrips,
      expenses: [newExpense, ...state.expenses]
    };
  }),

  addFuelEntry: (entry) => set((state) => {
    let newLedger = [...state.ledger];
    let newTrips = [...state.trips];

    // Connect to a trip by code if provided
    let tripId = null;
    if (entry.trip) {
      const foundTrip = state.trips.find(t => t.code === entry.trip || t.id === entry.trip);
      if (foundTrip) tripId = foundTrip.id;
    }

    if (tripId) {
      const tripEntries = state.ledger.filter(e => e.trip_id === tripId);
      const lastBalance = tripEntries.length ? tripEntries[tripEntries.length - 1].balance : 0;
      
      const ledgerEntry: LedgerEntry = {
        id: Math.random().toString(),
        trip_id: tripId,
        type: "debit",
        amount: entry.amount,
        balance: lastBalance - entry.amount,
        desc: `Diesel expense at ${entry.station} (${entry.liters}L)`,
        at: new Date().toISOString()
      };
      newLedger.push(ledgerEntry);

      // Also update the trip's spent amount
      newTrips = newTrips.map(t => 
        t.id === tripId ? { ...t, spent: t.spent + entry.amount, expenses: t.expenses + 1 } : t
      );
    }
    
    const newExpense: Expense = {
      id: Math.random().toString(),
      driver: entry.driver || "Unknown",
      trip: entry.trip || "Unknown",
      type: "Diesel",
      amount: entry.amount,
      location: entry.station,
      via: "text",
      confidence: 1.0,
      created_at: new Date().toISOString(),
      notes: `${entry.liters}L logged via Fuel page`
    };

    return {
      fuelEntries: [entry, ...state.fuelEntries],
      ledger: newLedger,
      trips: newTrips,
      expenses: [newExpense, ...state.expenses]
    };
  }),

  endTrip: (tripId) => set((state) => {
    const updatedTrips = state.trips.map(t => t.id === tripId ? { ...t, status: "completed" as const } : t);
    return { trips: updatedTrips };
  }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

