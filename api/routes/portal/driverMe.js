const express = require("express");
const router = express.Router();
const { supabase } = require("../../services/db/supabase");
const { authMiddleware } = require("../../middleware/auth");

// Middleware to ensure driver role
const requireDriver = (req, res, next) => {
  if (req.user?.role !== "driver") return res.status(403).json({ error: "Access denied. Drivers only." });
  next();
};

// GET /api/portal/driver/me
router.get("/", authMiddleware, requireDriver, async (req, res, next) => {
  try {
    // Fetch the driver and related vehicle data
    const { data: driver, error } = await supabase
      .from("drivers")
      .select(`
        *,
        driver_documents(*),
        trips(
          *,
          vehicles(*)
        )
      `)
      .eq("id", req.user.id)
      .single();

    if (error) throw new Error(error.message);

    // Get active vehicle assignment
    let assignedVehicle = null;
    const { data: assignmentData } = await supabase
      .from("vehicle_assignments")
      .select(`*, vehicles(*)`)
      .eq("driver_id", req.user.id)
      .eq("status", "active")
      .single();

    if (assignmentData && assignmentData.vehicles) {
      assignedVehicle = assignmentData.vehicles;
    } else {
      // Fallback to active trip vehicle
      const activeTrip = driver.trips?.find(t => t.status === "active" || t.status === "started" || t.status === "in_progress");
      if (activeTrip && activeTrip.vehicles) {
        assignedVehicle = activeTrip.vehicles;
      }
    }

    res.json({
      driver,
      assignedVehicle,
      documents: driver.driver_documents || []
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/portal/driver/me/document — Upload a document + optional profile fields
router.put("/document", authMiddleware, requireDriver, async (req, res, next) => {
  try {
    const { document_type, document_url, license_no, license_expiry } = req.body;

    const allowed = ["license_url", "rc_url", "insurance_url", "fitness_url", "permit_url", "puc_url"];
    if (!allowed.includes(document_type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    // Build the update payload — always include the document URL
    const updatePayload = { [document_type]: document_url };

    // If license fields are provided alongside the license doc, save them too
    if (document_type === "license_url") {
      if (license_no) updatePayload.license_no = license_no;
      if (license_expiry) updatePayload.license_expiry = license_expiry;
    }

    const { data, error } = await supabase
      .from("drivers")
      .update(updatePayload)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.json({ message: "Document uploaded successfully", driver: data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
