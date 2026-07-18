import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export function useDriverSync(intervalMs = 15000) {
  const [driverMe, setDriverMe] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("driver_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [meRes, tripsRes, expensesRes] = await Promise.all([
        api.getDriverMe(),
        api.getTrips(),
        api.getDriverExpenses()
      ]);

      setDriverMe((prev: any) => JSON.stringify(prev) !== JSON.stringify(meRes) ? meRes : prev);
      setTrips((prev: any[]) => JSON.stringify(prev) !== JSON.stringify(tripsRes.trips || []) ? (tripsRes.trips || []) : prev);
      setExpenses((prev: any[]) => JSON.stringify(prev) !== JSON.stringify(expensesRes || []) ? (expensesRes || []) : prev);

      setError(null);
    } catch (err: any) {
      console.error("Driver sync error:", err);
      setError(err.message || "Failed to sync driver data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchAll();

    // Set up polling
    const interval = setInterval(fetchAll, intervalMs);

    return () => clearInterval(interval);
  }, [fetchAll, intervalMs]);

  return { driverMe, trips, expenses, loading, error, refetch: fetchAll };
}
