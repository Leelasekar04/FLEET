const express = require("express");
const router = express.Router();
const { supabase } = require("../services/db/supabase");
const { authMiddleware } = require("../middleware/auth");

// GET /api/invoices - List invoices
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, customers(name), trips(id)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/invoices/:id - Get specific invoice
router.get("/:id", authMiddleware, async (req, res, next) => {
  console.log(`[GET /api/invoices/:id] Fetching invoice ID: ${req.params.id}`);
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, customers(name, address, gst_number), trips(id, distance_km, origin, destination)")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      console.log(`[GET /api/invoices/:id] FAILED. Error:`, error, `Data:`, data);
      return res.status(404).json({ error: "Invoice not found" });
    }
    console.log(`[GET /api/invoices/:id] SUCCESS.`);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/invoices - Create invoice
router.post("/", authMiddleware, async (req, res, next) => {
  console.log(`[POST /api/invoices] Received payload:`, req.body);
  try {
    const { customer_id, trip_id, subtotal, fuel_amount, batta_amount, tax_amount } = req.body;
    
    // Convert to numbers and calculate grand total
    const numSubtotal = parseFloat(subtotal) || 0;
    const numFuel = parseFloat(fuel_amount) || 0;
    const numBatta = parseFloat(batta_amount) || 0;
    const numTax = parseFloat(tax_amount) || 0;
    
    const grand_total = numSubtotal + numFuel + numBatta + numTax;

    const { data, error } = await supabase
      .from("invoices")
      .insert([{
        company_id: req.user?.company_id, // assuming req.user has company_id from authMiddleware
        customer_id,
        trip_id,
        subtotal: numSubtotal,
        fuel_amount: numFuel,
        batta_amount: numBatta,
        tax_amount: numTax,
        grand_total,
        status: "draft"
      }])
      .select()
      .single();

    if (error) {
      console.log(`[POST /api/invoices] DB Error:`, error);
      throw new Error(error.message);
    }
    console.log(`[POST /api/invoices] Successfully created invoice with ID:`, data.id);
    res.status(201).json({ message: "Invoice created successfully", invoice: data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
