// ============================================================
// Route — Trips
// ============================================================
const express = require("express");
const router = express.Router();
const { supabase } = require("../services/db/supabase");
const { authMiddleware } = require("../middleware/auth");
const { startTrip, endTrip, topUpBatta } = require("../services/db/ledger");

// GET /api/trips — List trips (with filters)
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { status, driver_id, limit = 50 } = req.query;
    let query = supabase
      .from("trips")
      .select("*, drivers(name, phone, vehicle_no), expenses(id, amount, expense_type)")
      .order("start_date", { ascending: false })
      .limit(parseInt(limit));

    if (status) query = query.eq("status", status);
    
    if (req.user.role === "driver") {
      query = query.eq("driver_id", req.user.id);
    } else if (driver_id) {
      query = query.eq("driver_id", driver_id);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    res.json({ trips: data, count: data.length });
  } catch (err) { next(err); }
});

// GET /api/trips/active — Active trips only
router.get("/active", authMiddleware, async (req, res, next) => {
  try {
    let query = supabase
      .from("trips")
      .select("*, drivers(name, phone, vehicle_no)")
      .eq("status", "active")
      .order("start_date", { ascending: false });

    if (req.user.role === "driver") {
      query = query.eq("driver_id", req.user.id);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    res.json({ trips: data, count: data.length });
  } catch (err) { next(err); }
});

// GET /api/trips/:id — Single trip detail
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    let query = supabase
      .from("trips")
      .select("*, drivers(name, phone, vehicle_no, license_no), expenses(*), ledger_entries(*)")
      .eq("id", req.params.id);

    if (req.user.role === "driver") {
      query = query.eq("driver_id", req.user.id);
    }

    const { data, error } = await query.single();

    if (error || !data) return res.status(404).json({ error: "Trip not found" });
    res.json(data);
  } catch (err) { next(err); }
});

// POST /api/trips/start — Start a new trip
router.post("/start", authMiddleware, async (req, res, next) => {
  try {
    const { driver_id, origin, destination, opening_batta, notes } = req.body;
    if (!driver_id || !opening_batta) {
      return res.status(400).json({ error: "driver_id and opening_batta are required" });
    }

    const trip = await startTrip({
      driverId: driver_id,
      origin,
      destination,
      openingBatta: parseFloat(opening_batta),
      notes,
    });

    res.status(201).json({
      message: "Trip started successfully",
      trip,
    });
  } catch (err) { next(err); }
});

// POST /api/trips/:id/end — End a trip
router.post("/:id/end", authMiddleware, async (req, res, next) => {
  try {
    const trip = await endTrip(req.params.id);
    res.json({ message: "Trip ended successfully", trip });
  } catch (err) { next(err); }
});

// POST /api/trips/:id/topup — Top up batta
router.post("/:id/topup", authMiddleware, async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    const trip = await topUpBatta(req.params.id, parseFloat(amount));
    res.json({ message: `Batta topped up by ₹${amount}`, trip });
  } catch (err) { next(err); }
});

module.exports = router;
