const express = require("express");
const router = express.Router();
const { supabase } = require("../services/db/supabase");
const { authMiddleware } = require("../middleware/auth");

// Get all assignments
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("vehicle_assignments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ assignments: data || [] });
  } catch (error) {
    next(error);
  }
});

// Create an assignment
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { driver_id, vehicle_id, effective_date, status } = req.body;
    
    // Deactivate previous active assignment for this driver or vehicle
    await supabase
      .from("vehicle_assignments")
      .update({ status: "inactive", end_date: effective_date || new Date().toISOString() })
      .eq("driver_id", driver_id)
      .eq("status", "active");

    await supabase
      .from("vehicle_assignments")
      .update({ status: "inactive", end_date: effective_date || new Date().toISOString() })
      .eq("vehicle_id", vehicle_id)
      .eq("status", "active");

    // Create new assignment
    const { data, error } = await supabase
      .from("vehicle_assignments")
      .insert([{ 
        driver_id, 
        vehicle_id, 
        effective_date: effective_date || new Date().toISOString(),
        status: status || "active"
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ assignment: data });
  } catch (error) {
    next(error);
  }
});

// Update assignment
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { status, end_date } = req.body;
    
    const { data, error } = await supabase
      .from("vehicle_assignments")
      .update({ status, end_date })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ assignment: data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
