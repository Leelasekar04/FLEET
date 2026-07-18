const express = require("express");
const router = express.Router();
const { supabase } = require("../../../services/db/supabase");
const { authMiddleware } = require("../../../middleware/auth");

const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ error: "Access denied. Super Admin only." });
  }
  next();
};

router.use(authMiddleware, requireSuperAdmin);

// --- PLANS ---
router.get("/plans", async (req, res, next) => {
  try {
    const { data: plans, error } = await supabase.from("subscription_plans").select("*");
    if (error) throw error;
    res.json({ plans });
  } catch (err) { next(err); }
});

router.post("/plans", async (req, res, next) => {
  try {
    const { data: plan, error } = await supabase.from("subscription_plans").insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json({ plan });
  } catch (err) { next(err); }
});

router.put("/plans/:id", async (req, res, next) => {
  try {
    const { data: plan, error } = await supabase.from("subscription_plans").update(req.body).eq("id", req.params.id).select().single();
    if (error) throw error;
    res.json({ plan });
  } catch (err) { next(err); }
});

router.delete("/plans/:id", async (req, res, next) => {
  try {
    const { error } = await supabase.from("subscription_plans").update({ status: "archived" }).eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "Plan archived" });
  } catch (err) { next(err); }
});

// --- INVOICES ---
router.get("/invoices", async (req, res, next) => {
  try {
    const { data: invoices, error } = await supabase.from("subscription_invoices").select("*");
    if (error) throw error;
    res.json({ invoices });
  } catch (err) { next(err); }
});

// --- PAYMENTS ---
router.get("/payments", async (req, res, next) => {
  try {
    const { data: payments, error } = await supabase.from("subscription_payments").select("*");
    if (error) throw error;
    res.json({ payments });
  } catch (err) { next(err); }
});

module.exports = router;
