const express = require("express");
const router = express.Router();
const { supabase } = require("../../services/db/supabase");
const { authMiddleware } = require("../../middleware/auth");

// Middleware to ensure super admin role
const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ error: "Access denied. Super Admin only." });
  }
  next();
};

// GET /api/portal/super-admin/dashboard — Global stats
router.get("/dashboard", authMiddleware, requireSuperAdmin, async (req, res, next) => {
  try {
    // Basic aggregation counts (can be expanded later)
    
    // 1. Companies Count
    const { count: totalCompanies, error: cErr } = await supabase
      .from("companies")
      .select('*', { count: 'exact', head: true });

    // 2. Vehicles Count
    const { count: totalVehicles, error: vErr } = await supabase
      .from("vehicles")
      .select('*', { count: 'exact', head: true });

    // 3. Drivers Count
    const { count: totalDrivers, error: dErr } = await supabase
      .from("drivers")
      .select('*', { count: 'exact', head: true });
      
    // 4. Trips Count
    const { count: totalTrips, error: tErr } = await supabase
      .from("trips")
      .select('*', { count: 'exact', head: true });

    if (cErr || vErr || dErr || tErr) {
      throw new Error("Failed to fetch aggregate counts");
    }

// You can add more complex queries for MRR, alerts, active statuses here

    res.json({
      companies: { total: totalCompanies || 0 },
      vehicles: { total: totalVehicles || 0 },
      drivers: { total: totalDrivers || 0 },
      trips: { total: totalTrips || 0 },
      // Other placeholders for the dashboard
    });
  } catch (err) {
    next(err);
  }
});

router.use("/company-admins", require("./superAdmin/companyAdmins"));
router.use("/subscriptions", require("./superAdmin/subscriptions"));

module.exports = router;
