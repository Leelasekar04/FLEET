const express = require("express");
const router = express.Router();
const { supabase, isMock, mockDB } = require("../../services/db/supabase");
const { authMiddleware } = require("../../middleware/auth");

// Middleware to ensure driver role
const requireDriver = (req, res, next) => {
  if (req.user?.role !== "driver") return res.status(403).json({ error: "Access denied. Drivers only." });
  next();
};

// GET /api/portal/driver/expenses
router.get("/", authMiddleware, requireDriver, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*, vehicles(vehicle_number), trips(id, origin, destination)")
      .eq("driver_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/portal/driver/expenses
router.post("/", authMiddleware, requireDriver, async (req, res, next) => {
  try {
    const { vehicle_id, trip_id, expense_type, amount, description, receipt_url, expense_date } = req.body;
    
    const newExpense = {
      company_id: req.user.company_id,
      driver_id: req.user.id,
      vehicle_id: vehicle_id || null,
      trip_id: trip_id || null,
      expense_type,
      amount: parseFloat(amount) || 0,
      description,
      receipt_url,
      expense_date: expense_date || new Date(),
      status: "Pending"
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert([newExpense])
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (isMock && mockDB && mockDB.expenses) {
      mockDB.expenses.push({
        ...newExpense,
        id: "exp-mock-" + Date.now(),
        created_at: new Date().toISOString()
      });
    }

    res.status(201).json({ message: "Expense submitted successfully", expense: data });
  } catch (err) {
    next(err);
  }
});

// PUT /api/portal/driver/expenses/:id
router.put("/:id", authMiddleware, requireDriver, async (req, res, next) => {
  try {
    const { receipt_url } = req.body;
    
    // Ensure the expense belongs to the driver
    const { data: expense, error: fetchError } = await supabase
      .from("expenses")
      .select("id")
      .eq("id", req.params.id)
      .eq("driver_id", req.user.id)
      .single();

    if (fetchError || !expense) {
      return res.status(404).json({ error: "Expense not found or unauthorized" });
    }

    const { data, error } = await supabase
      .from("expenses")
      .update({ receipt_url })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (isMock && mockDB && mockDB.expenses) {
      const idx = mockDB.expenses.findIndex(e => e.id === req.params.id);
      if (idx !== -1) mockDB.expenses[idx].receipt_url = receipt_url;
    }

    res.json({ message: "Expense updated successfully", expense: data });
  } catch (err) {
    next(err);
  }
});

// GET /api/portal/driver/dashboard
router.get("/dashboard", authMiddleware, requireDriver, async (req, res, next) => {
  try {
    const [profile, activeTrips] = await Promise.all([
      supabase.from("drivers").select("*").eq("id", req.user.id).single(),
      supabase.from("trips").select("*, vehicles(vehicle_number)").eq("driver_id", req.user.id).eq("status", "active")
    ]);

    res.json({
      profile: profile.data,
      activeTrips: activeTrips.data || [],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
