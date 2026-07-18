// ============================================================
// Route — Expenses
// ============================================================
const express = require("express");
const router = express.Router();
const { supabase } = require("../services/db/supabase");
const { authMiddleware } = require("../middleware/auth");

// GET /api/expenses — List expenses with filters
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { trip_id, type, from, to, limit = 100 } = req.query;

    let query = supabase
      .from("expenses")
      .select("*, trips(trip_code, driver_id, drivers(name, phone))")
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    if (trip_id) query = query.eq("trip_id", trip_id);
    if (type) query = query.eq("expense_type", type);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const total = data.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    res.json({
      expenses: data,
      count: data.length,
      total_amount: total,
    });
  } catch (err) { next(err); }
});

// GET /api/expenses/today — Today's expenses
router.get("/today", authMiddleware, async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("expenses")
      .select("*, trips(trip_code, drivers(name))")
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const total = data.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    res.json({ expenses: data, count: data.length, total_amount: total });
  } catch (err) { next(err); }
});

// GET /api/expenses/summary — Group by type
router.get("/summary", authMiddleware, async (req, res, next) => {
  try {
    const { from, to } = req.query;
    let query = supabase
      .from("expenses")
      .select("expense_type, amount");

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Group by type
    const summary = data.reduce((acc, e) => {
      const key = e.expense_type;
      if (!acc[key]) acc[key] = { expense_type: key, total: 0, count: 0 };
      acc[key].total += parseFloat(e.amount);
      acc[key].count += 1;
      return acc;
    }, {});

    res.json({
      summary: Object.values(summary).sort((a, b) => b.total - a.total),
      grand_total: data.reduce((sum, e) => sum + parseFloat(e.amount), 0),
    });
  } catch (err) { next(err); }
});

// GET /api/expenses/:id — Single expense
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*, trips(trip_code, drivers(name, phone))")
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Expense not found" });
    res.json(data);
  } catch (err) { next(err); }
});

// POST /api/expenses — Create expense
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const payload = req.body;
    
    // Auto-generate UUID if not provided by UI
    const { v4: uuidv4 } = require('uuid');
    const newExpense = {
      ...payload,
      id: payload.id || uuidv4(),
      status: payload.status || "Pending",
      created_at: payload.created_at || new Date().toISOString()
    };

    const { data, error } = await supabase.from("expenses").insert(newExpense).select();
    
    if (error) throw new Error(error.message);
    
    res.status(201).json({ message: "Expense added successfully", expense: data[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
