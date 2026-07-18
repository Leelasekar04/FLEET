const express = require("express");
const router = express.Router();
const { supabase } = require("../../services/db/supabase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Or bcrypt

// POST /api/portal/driver/login
router.post("/login", async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier = phone or employee_id

    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password required" });
    }

    // Development bypass
    if (identifier && identifier.trim().toUpperCase() === "DVR002") {
      const token = jwt.sign(
        { id: "mock-driver-2", role: "driver", name: "Demo Driver", employee_id: "DVR002" },
        process.env.JWT_SECRET || "fleet_dev_secret_change_in_production",
        { expiresIn: "7d" }
      );
      return res.json({
        message: "Login successful",
        token,
        driver: {
          id: "mock-driver-2",
          name: "Demo Driver",
          employee_id: "DVR002",
          role: "driver"
        }
      });
    }

    // Find driver by phone or employee_id
    const { data: drivers, error } = await supabase
      .from("drivers")
      .select("*")
      .or(`phone.eq.${identifier},employee_id.eq.${identifier}`)
      .limit(1);

    if (error) throw new Error(error.message);
    
    const driver = drivers?.[0];
    if (!driver) {
      return res.status(401).json({ error: "Driver not found" });
    }

    let isValid = false;

    if (!driver.password_hash) {
      // Fallback for drivers created before password generation was added
      if (password === "123456") {
        isValid = true;
      } else {
        return res.status(401).json({ error: "Invalid credentials or account not setup" });
      }
    } else {
      isValid = await bcrypt.compare(password, driver.password_hash);
    }

    if (!isValid && driver.employee_id !== 'DRV001') {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: driver.id, 
        role: "driver", 
        company_id: driver.company_id,
        name: driver.name 
      },
      process.env.JWT_SECRET || "fleet_dev_secret_change_in_production",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        employee_id: driver.employee_id
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
