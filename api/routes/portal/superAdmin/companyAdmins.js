const express = require("express");
const router = express.Router();
const { supabase } = require("../../../services/db/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../../../middleware/auth");

const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ error: "Access denied. Super Admin only." });
  }
  next();
};

// All routes require authentication and super_admin role
router.use(authMiddleware, requireSuperAdmin);

// 1. GET / - List all company admins
router.get("/", async (req, res, next) => {
  try {
    const { data: users, error: usersErr } = await supabase
      .from("users")
      .select("*")
      .eq("role", "COMPANY_ADMIN");

    if (usersErr) throw usersErr;

    const { data: companies, error: compErr } = await supabase
      .from("companies")
      .select("*");

    if (compErr) throw compErr;

    // Join data manually since we might be using mock db
    const enrichedUsers = users.map(user => {
      const company = companies.find(c => c.id === user.company_id) || {};
      return {
        ...user,
        company_name: company.name,
        subscription_plan: company.subscription_plan,
        company_status: company.status
      };
    });

    res.json({ companyAdmins: enrichedUsers });
  } catch (err) {
    next(err);
  }
});

// 2. POST / - Create a new Company Admin
router.post("/", async (req, res, next) => {
  try {
    const { name, email, password, company_name, subscription_plan, permissions } = req.body;

    if (!name || !email || !password || !company_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Step 1: Create Company
    const { data: company, error: companyErr } = await supabase
      .from("companies")
      .insert([{
        name: company_name,
        subscription_plan: subscription_plan || "basic",
        status: "active"
      }])
      .select()
      .single();

    if (companyErr) throw companyErr;

    // Step 2: Create User
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: user, error: userErr } = await supabase
      .from("users")
      .insert([{
        name,
        email,
        password_hash,
        role: "COMPANY_ADMIN",
        company_id: company.id,
        status: "active",
        permissions: permissions || ["all"]
      }])
      .select()
      .single();

    if (userErr) throw userErr;

    res.status(201).json({
      message: "Company Admin created successfully",
      companyAdmin: { ...user, company_name: company.name, subscription_plan: company.subscription_plan }
    });
  } catch (err) {
    next(err);
  }
});

// 3. GET /:id - View details
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .eq("role", "COMPANY_ADMIN")
      .single();

    if (userErr) throw userErr;

    const { data: company, error: compErr } = await supabase
      .from("companies")
      .select("*")
      .eq("id", user.company_id)
      .single();

    if (compErr) throw compErr;

    res.json({ companyAdmin: { ...user, company } });
  } catch (err) {
    next(err);
  }
});

// 4. PUT /:id - Edit details
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, company_name, subscription_plan, permissions } = req.body;

    // Update user
    const { data: user, error: userErr } = await supabase
      .from("users")
      .update({ name, email, permissions })
      .eq("id", id)
      .select()
      .single();

    if (userErr) throw userErr;

    if (company_name || subscription_plan) {
      const { error: compErr } = await supabase
        .from("companies")
        .update({
          name: company_name || undefined,
          subscription_plan: subscription_plan || undefined
        })
        .eq("id", user.company_id);

      if (compErr) throw compErr;
    }

    res.json({ message: "Updated successfully", companyAdmin: user });
  } catch (err) {
    next(err);
  }
});

// 5. PATCH /:id/status - Activate or Suspend
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data: user, error: userErr } = await supabase
      .from("users")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (userErr) throw userErr;

    res.json({ message: `Status updated to ${status}`, companyAdmin: user });
  } catch (err) {
    next(err);
  }
});

// 6. DELETE /:id - Soft Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error: userErr } = await supabase
      .from("users")
      .update({ status: "deleted", is_deleted: true })
      .eq("id", id);

    if (userErr) throw userErr;

    res.json({ message: "Company Admin deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// 7. POST /:id/impersonate - Login as Company Admin
router.post("/:id/impersonate", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .eq("role", "COMPANY_ADMIN")
      .single();

    if (userErr || !user) {
      return res.status(404).json({ error: "Company Admin not found" });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ error: "Cannot impersonate a suspended admin" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        company_id: user.company_id,
        is_impersonated: true
      }
    };

    const impersonationToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.json({ token: impersonationToken, user });
  } catch (err) {
    next(err);
  }
});

// 8. GET /:id/activity - Fetch Activity Logs
router.get("/:id/activity", async (req, res, next) => {
  try {
    // For mock db or real db, we'd query an audit_logs table.
    // For now, return mock data.
    const { id } = req.params;
    const mockLogs = [
      { id: 1, action: "Logged in", timestamp: new Date().toISOString(), details: "IP: 192.168.1.1" },
      { id: 2, action: "Created Driver", timestamp: new Date(Date.now() - 86400000).toISOString(), details: "Driver ID: mock-178" }
    ];

    res.json({ logs: mockLogs });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
