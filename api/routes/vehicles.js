const express = require("express");
const router = express.Router();
const { supabase } = require("../services/db/supabase");
const { authMiddleware } = require("../middleware/auth");
const { v4: uuidv4 } = require('uuid');

// GET /api/vehicles
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    res.json({ vehicles: data });
  } catch (err) {
    next(err);
  }
});

// POST /api/vehicles
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const payload = req.body;
    
    const newVehicle = {
      ...payload,
      id: uuidv4(),
      status: payload.status || "active",
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from("vehicles").insert(newVehicle).select();
    
    if (error) throw new Error(error.message);
    
    res.status(201).json({ message: "Vehicle added successfully", vehicle: data[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
