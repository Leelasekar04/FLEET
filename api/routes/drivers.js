// ============================================================
// Route — Drivers
// ============================================================
const express = require("express");
const router = express.Router();
const { supabase } = require("../services/db/supabase");
const { authMiddleware } = require("../middleware/auth");

// GET /api/drivers — List all drivers
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("drivers")
      .select("*, trips(id, trip_code, status, current_balance)")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    res.json({ drivers: data, count: data.length });
  } catch (err) { next(err); }
});

// GET /api/drivers/:id — Single driver
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("drivers")
      .select("*, trips(*, expenses(*))")
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Driver not found" });
    res.json(data);
  } catch (err) { next(err); }
});

// POST /api/drivers — Add driver
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { name, phone, license_no, vehicle_no } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "name and phone are required" });

    const bcrypt = require("bcryptjs");
    const defaultPasswordHash = await bcrypt.hash("123456", 12);
    
    // Auto-generate employee ID
    const employee_id = `DRV${Math.floor(Math.random() * 9000) + 1000}`;

    const { data, error } = await supabase
      .from("drivers")
      .insert({ name, phone, license_no, vehicle_no, employee_id, status: "active", password_hash: defaultPasswordHash })
      .select()
      .single();

    if (error) {
      if (error.message.includes("unique")) return res.status(409).json({ error: "Phone already registered" });
      throw new Error(error.message);
    }
    res.status(201).json(data);
  } catch (err) { next(err); }
});

// PUT /api/drivers/:id — Update driver
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { name, phone, license_no, vehicle_no, status } = req.body;
    
    // Only update fields that were actually provided
    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (license_no !== undefined) updatePayload.license_no = license_no;
    if (vehicle_no !== undefined) updatePayload.vehicle_no = vehicle_no;
    if (status !== undefined) updatePayload.status = status;

    const { data, error } = await supabase
      .from("drivers")
      .update(updatePayload)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) { next(err); }
});

// DELETE /api/drivers/:id — Deactivate driver (soft delete)
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await supabase.from("drivers").update({ status: "inactive" }).eq("id", req.params.id);
    res.json({ message: "Driver deactivated" });
  } catch (err) { next(err); }
});

module.exports = router;
