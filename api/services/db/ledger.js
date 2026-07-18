// ============================================================
// Ledger-Agent — Core Ledger Business Logic
// ============================================================
const { supabase } = require("./supabase");
const logger = require("../../utils/logger");
const { v4: uuidv4 } = require("uuid");

// ─── Validate Driver by Phone ─────────────────────────────
async function validateDriver(phone) {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("phone", phone)
    .single();

  if (error || !data) {
    logger.warn(`Driver not found: ${phone}`);
    return null;
  }
  if (data.status !== "active") {
    logger.warn(`Driver inactive: ${phone} | status: ${data.status}`);
    return null;
  }
  return data;
}

// ─── Get Active Trip for Driver ───────────────────────────
async function getActiveTrip(driverId) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("driver_id", driverId)
    .eq("status", "active")
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    logger.warn(`No active trip for driver: ${driverId}`);
    return null;
  }
  return data;
}

// ─── Record Expense + Deduct Batta ───────────────────────
async function recordExpense(driverPhone, parsedExpense) {
  try {
    // 1. Validate driver
    const driver = await validateDriver(driverPhone);
    if (!driver) {
      return {
        error: `❌ Your phone number (${driverPhone}) is not registered in our system. Please contact your fleet manager.`,
      };
    }

    // 2. Get active trip
    const trip = await getActiveTrip(driver.id);
    if (!trip) {
      return {
        error: `⚠️ You don't have an active trip right now. Please ask your fleet manager to start a trip before submitting expenses.`,
      };
    }

    // 3. Check batta balance
    const previousBalance = parseFloat(trip.current_balance);
    const expenseAmount = parseFloat(parsedExpense.amount);

    if (expenseAmount > previousBalance) {
      return {
        error: `💸 Insufficient batta balance!\n\nExpense: ₹${expenseAmount.toLocaleString("en-IN")}\nAvailable: ₹${previousBalance.toLocaleString("en-IN")}\n\nPlease contact your fleet manager for a top-up.`,
      };
    }

    const updatedBalance = previousBalance - expenseAmount;

    // 4. Insert expense record
    const { data: expense, error: expError } = await supabase
      .from("expenses")
      .insert({
        trip_id: trip.id,
        expense_type: parsedExpense.expense_type || "Miscellaneous",
        amount: expenseAmount,
        location: parsedExpense.location || null,
        merchant_name: parsedExpense.merchant_name || null,
        notes: parsedExpense.notes || null,
        receipt_url: parsedExpense.receipt_url || null,
        message_type: parsedExpense.message_type || "text",
        confidence: parsedExpense.confidence || null,
      })
      .select()
      .single();

    if (expError) {
      logger.error(`Expense insert error: ${expError.message}`);
      return { error: "Failed to record expense. Please try again." };
    }

    // 5. Deduct batta — update trip balance
    const { error: tripError } = await supabase
      .from("trips")
      .update({ current_balance: updatedBalance, updated_at: new Date().toISOString() })
      .eq("id", trip.id);

    if (tripError) {
      logger.error(`Balance update error: ${tripError.message}`);
      return { error: "Failed to update batta balance. Please try again." };
    }

    // 6. Create ledger entry
    await supabase.from("ledger_entries").insert({
      trip_id: trip.id,
      expense_id: expense.id,
      transaction_type: "debit",
      amount: expenseAmount,
      balance_after: updatedBalance,
      description: `${parsedExpense.expense_type} expense${parsedExpense.location ? " at " + parsedExpense.location : ""}`,
    });

    logger.info(`✅ Expense recorded: ₹${expenseAmount} | Trip: ${trip.trip_code} | Balance: ₹${updatedBalance}`);

    return {
      trip_id: trip.id,
      trip_code: trip.trip_code,
      expense_id: expense.id,
      previous_balance: previousBalance,
      expense: expenseAmount,
      updated_balance: updatedBalance,
      driver_name: driver.name,
    };
  } catch (err) {
    logger.error(`recordExpense error: ${err.message}`);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// ─── Start a New Trip ─────────────────────────────────────
async function startTrip({ driverId, origin, destination, openingBatta, notes }) {
  // End any existing active trip first
  await supabase
    .from("trips")
    .update({ status: "completed", end_date: new Date().toISOString() })
    .eq("driver_id", driverId)
    .eq("status", "active");

  // Generate trip code
  const tripCode = `TRIP-${Date.now().toString().slice(-6)}`;

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({
      driver_id: driverId,
      trip_code: tripCode,
      origin,
      destination,
      opening_batta: openingBatta,
      current_balance: openingBatta,
      status: "active",
      notes,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Create opening ledger entry
  await supabase.from("ledger_entries").insert({
    trip_id: trip.id,
    transaction_type: "opening",
    amount: openingBatta,
    balance_after: openingBatta,
    description: `Trip started. Opening batta allocated.`,
  });

  return trip;
}

// ─── End Trip ─────────────────────────────────────────────
async function endTrip(tripId) {
  const { data: trip, error } = await supabase
    .from("trips")
    .update({ status: "completed", end_date: new Date().toISOString() })
    .eq("id", tripId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Settlement ledger entry
  await supabase.from("ledger_entries").insert({
    trip_id: tripId,
    transaction_type: "settlement",
    amount: trip.current_balance,
    balance_after: 0,
    description: `Trip completed. Final balance: ₹${trip.current_balance}`,
  });

  return trip;
}

// ─── Top Up Batta ─────────────────────────────────────────
async function topUpBatta(tripId, amount) {
  const { data: trip } = await supabase.from("trips").select("*").eq("id", tripId).single();
  if (!trip) throw new Error("Trip not found");

  const newBalance = parseFloat(trip.current_balance) + parseFloat(amount);

  const { data: updated, error } = await supabase
    .from("trips")
    .update({ current_balance: newBalance })
    .eq("id", tripId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("ledger_entries").insert({
    trip_id: tripId,
    transaction_type: "topup",
    amount: parseFloat(amount),
    balance_after: newBalance,
    description: `Batta top-up of ₹${amount}`,
  });

  return updated;
}

// ─── Get Full Ledger for a Trip ───────────────────────────
async function getTripLedger(tripId) {
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("*, expenses(*)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

// ─── Get Expenses Summary ─────────────────────────────────
async function getExpensesSummary(filters = {}) {
  let query = supabase
    .from("expenses")
    .select("*, trips(trip_code, driver_id, drivers(name, phone))")
    .order("created_at", { ascending: false });

  if (filters.tripId) query = query.eq("trip_id", filters.tripId);
  if (filters.type) query = query.eq("expense_type", filters.type);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", filters.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  validateDriver,
  getActiveTrip,
  recordExpense,
  startTrip,
  endTrip,
  topUpBatta,
  getTripLedger,
  getExpensesSummary,
};
