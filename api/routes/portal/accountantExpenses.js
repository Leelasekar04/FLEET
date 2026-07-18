const express = require("express");
const router = express.Router();
const { supabase, isMock, mockDB } = require("../../services/db/supabase");
const { authMiddleware } = require("../../middleware/auth");

const requireAccountant = (req, res, next) => {
  if (req.user?.role !== "accountant" && req.user?.role !== "super_admin") {
    return res.status(403).json({ error: "Access denied. Accountants only." });
  }
  next();
};

// GET /api/portal/accountant/expenses
router.get("/", authMiddleware, requireAccountant, async (req, res, next) => {
  try {
    const { status, driver_id, vehicle_id, trip_id, expense_type, start_date, end_date } = req.query;

    let query = supabase
      .from("expenses")
      .select("*, trips(id, trip_code, driver_id, drivers(name, phone, vehicle_no))")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (trip_id) query = query.eq("trip_id", trip_id);
    if (expense_type) query = query.eq("expense_type", expense_type);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Map nested relations to flat structure expected by UI (since mock DB might not join properly)
    const mappedData = data.map(exp => {
      let driverName = exp.trips?.drivers?.name;
      let vehicleNo = exp.trips?.drivers?.vehicle_no;
      
      if (isMock && mockDB) {
        const trip = mockDB.trips?.find(t => t.id === exp.trip_id);
        if (trip) {
           const driver = mockDB.drivers?.find(d => d.id === trip.driver_id);
           if (driver) driverName = driver.name;
           if (trip.vehicles?.vehicle_number) vehicleNo = trip.vehicles.vehicle_number;
           else if (trip.vehicle_id) {
             const veh = mockDB.vehicles?.find(v => v.id === trip.vehicle_id);
             if (veh) vehicleNo = veh.vehicle_number;
           }
        }
      }

      return {
        ...exp,
        drivers: { name: driverName || "Demo Driver" },
        vehicles: { vehicle_number: vehicleNo || "TN01AB1234" },
        trips: { id: exp.trip_id || exp.trips?.id || "mock-trip-1" },
        status: exp.status || "Pending" // Default to pending if not set
      };
    });

    res.json(mappedData);
  } catch (err) {
    next(err);
  }
});

// PUT /api/portal/accountant/expenses/:id/status
router.put("/:id/status", authMiddleware, requireAccountant, async (req, res, next) => {
  try {
    const { status, accountant_comments } = req.body;
    
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data, error } = await supabase
      .from("expenses")
      .update({ 
        status, 
        accountant_comments, 
        updated_at: new Date() 
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    res.json({ message: `Expense ${status.toLowerCase()} successfully`, expense: data });
  } catch (err) {
    next(err);
  }
});

// PUT /api/portal/accountant/expenses/:id
router.put("/:id", authMiddleware, requireAccountant, async (req, res, next) => {
  try {
    const updates = req.body;
    delete updates.id; // Prevent updating primary key

    updates.updated_at = new Date();

    const { data, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    res.json({ message: "Expense updated successfully", expense: data });
  } catch (err) {
    next(err);
  }
});

// GET /api/portal/accountant/expenses/reports
router.get("/reports", authMiddleware, requireAccountant, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("expense_type, amount, status");

    if (error) throw new Error(error.message);

    const summary = {
      total_pending: 0,
      total_approved: 0,
      categories: {
        Fuel: 0, Batta: 0, Toll: 0, Parking: 0, Maintenance: 0, Food: 0, Other: 0
      }
    };

    data.forEach(expense => {
      const amt = parseFloat(expense.amount) || 0;
      const status = expense.status || "Pending";
      
      if (status === "Pending") summary.total_pending += amt;
      if (status === "Approved") summary.total_approved += amt;
      
      if (summary.categories[expense.expense_type] !== undefined && status === "Approved") {
        summary.categories[expense.expense_type] += amt;
      } else if (status === "Approved") {
        // Fallback for missing/misc categories
        summary.categories.Other = (summary.categories.Other || 0) + amt;
      }
    });

    res.json(summary);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
