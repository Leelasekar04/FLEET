// ============================================================
// Route — Ledger
// ============================================================
const express = require("express");
const router = express.Router();
const { supabase } = require("../services/db/supabase");
const { authMiddleware } = require("../middleware/auth");
const { getTripLedger } = require("../services/db/ledger");

// GET /api/ledger/trip/:tripId — Full ledger for a trip
router.get("/trip/:tripId", authMiddleware, async (req, res, next) => {
  try {
    const entries = await getTripLedger(req.params.tripId);
    res.json({ ledger: entries, count: entries.length });
  } catch (err) { next(err); }
});

// GET /api/ledger/driver/:driverId — All ledger entries for a driver
router.get("/driver/:driverId", authMiddleware, async (req, res, next) => {
  try {
    const { data: trips } = await supabase
      .from("trips")
      .select("id, trip_code")
      .eq("driver_id", req.params.driverId);

    if (!trips || trips.length === 0) {
      return res.json({ ledger: [], count: 0 });
    }

    const tripIds = trips.map((t) => t.id);

    const { data, error } = await supabase
      .from("ledger_entries")
      .select("*, trips(trip_code, drivers(name)), expenses(expense_type, location)")
      .in("trip_id", tripIds)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    res.json({ ledger: data, count: data.length });
  } catch (err) { next(err); }
});

// GET /api/ledger/dashboard — Dashboard summary stats
router.get("/dashboard", authMiddleware, async (req, res, next) => {
  try {
    // Active trips
    const { data: activeTrips } = await supabase
      .from("trips")
      .select("id, trip_code, current_balance, opening_batta, drivers(name)")
      .eq("status", "active");

    // Today's expenses
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayExpenses } = await supabase
      .from("expenses")
      .select("amount, expense_type")
      .gte("created_at", today.toISOString());

    // Total outstanding batta (sum of current balances across active trips)
    const totalBatta = (activeTrips || []).reduce(
      (sum, t) => sum + parseFloat(t.current_balance), 0
    );

    // Today's spend
    const todaySpend = (todayExpenses || []).reduce(
      (sum, e) => sum + parseFloat(e.amount), 0
    );

    // Driver count
    const { count: driverCount } = await supabase
      .from("drivers")
      .select("id", { count: "exact" })
      .eq("status", "active");

    res.json({
      active_trips: activeTrips?.length || 0,
      driver_count: driverCount || 0,
      today_expenses: todayExpenses?.length || 0,
      today_spend: todaySpend,
      outstanding_batta: totalBatta,
      active_trips_detail: activeTrips || [],
      today_expenses_detail: todayExpenses || [],
    });
  } catch (err) { next(err); }
});

module.exports = router;
