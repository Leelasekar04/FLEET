const express = require("express");
const router = express.Router();
const { supabase } = require("../../services/db/supabase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// POST /api/portal/accountant/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Development bypass
    if (email === "admin@fleet.com" || email === "accountant@fleet.com") {
      const token = jwt.sign(
        { id: "11111111-1111-1111-1111-111111111111", role: "accountant", name: "Finance Admin", email },
        process.env.JWT_SECRET || "fleet_dev_secret_change_in_production",
        { expiresIn: "7d" }
      );
      return res.json({
        message: "Login successful",
        token,
        user: {
          id: "11111111-1111-1111-1111-111111111111",
          name: "Finance Admin",
          email: email,
          role: "accountant"
        }
      });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", "accountant")
      .limit(1);

    if (error) throw new Error(error.message);
    
    const user = users?.[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Invalid credentials or unauthorized" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        company_id: user.company_id,
        name: user.name 
      },
      process.env.JWT_SECRET || "fleet_dev_secret_change_in_production",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
