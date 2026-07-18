// ============================================================
// Fleet API — Entry Point
// ============================================================
require("dotenv").config();
// Trigger nodemon restart
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const webhookRoutes = require("./webhook");
const driverRoutes = require("./routes/drivers");
const tripRoutes = require("./routes/trips");
const expenseRoutes = require("./routes/expenses");
const ledgerRoutes = require("./routes/ledger");
const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoices");
const vehiclesRoutes = require("./routes/vehicles");
const assignmentsRoutes = require("./routes/assignments");

// Portal Routes
const driverAuthRoutes = require("./routes/portal/driverAuth");
const accountantAuthRoutes = require("./routes/portal/accountantAuth");
const driverMeRoutes = require("./routes/portal/driverMe");
const driverExpensesRoutes = require("./routes/portal/driverExpenses");
const accountantExpensesRoutes = require("./routes/portal/accountantExpenses");

const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Security & Parsing ───────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for dev
  credentials: true,
}));
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Raw body for webhook signature verification
app.use("/api/webhook", express.raw({ type: "application/json" }));

// JSON for all other routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increased for development and polling
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

// ─── Health Check ─────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "fleet-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────
app.use("/api/webhook",  webhookRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/drivers",  driverRoutes);
app.use("/api/trips",    tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ledger",   ledgerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/assignments", assignmentsRoutes);

// Portal Routes (Role-Specific Workflows)
app.use("/api/portal/driver/me", require("./routes/portal/driverMe"));
app.use("/api/portal/driver/expenses", require("./routes/portal/driverExpenses"));
app.use("/api/portal/driver/auth", require("./routes/portal/driverAuth"));
app.use("/api/portal/accountant/expenses", require("./routes/portal/accountantExpenses"));
app.use("/api/portal/accountant/auth", require("./routes/portal/accountantAuth"));
app.use("/api/portal/super-admin", require("./routes/portal/superAdmin"));

// ─── 404 Handler ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚛 Fleet API running on http://localhost:${PORT}`);
  logger.info(`📡 Webhook endpoint: http://localhost:${PORT}/api/webhook`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
