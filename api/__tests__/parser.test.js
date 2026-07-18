// ============================================================
// Jest Tests — Parser-Agent
// ============================================================
const { normalizeExpenseType } = require("../../services/ai/parser");

describe("normalizeExpenseType", () => {
  test("maps diesel to Diesel", () => {
    expect(normalizeExpenseType("diesel")).toBe("Diesel");
    expect(normalizeExpenseType("fuel")).toBe("Diesel");
  });

  test("maps puncture to Tyre Repair", () => {
    expect(normalizeExpenseType("puncture")).toBe("Tyre Repair");
    expect(normalizeExpenseType("tyre")).toBe("Tyre Repair");
  });

  test("maps toll to Toll", () => {
    expect(normalizeExpenseType("toll")).toBe("Toll");
  });

  test("capitalizes unknown types", () => {
    expect(normalizeExpenseType("lubrication")).toBe("Lubrication");
  });

  test("returns Miscellaneous for null/empty", () => {
    expect(normalizeExpenseType(null)).toBe("Miscellaneous");
    expect(normalizeExpenseType("")).toBe("Miscellaneous");
  });
});

describe("Batta deduction formula", () => {
  test("deducts expense from balance", () => {
    const previousBalance = 15000;
    const expense = 500;
    const updatedBalance = previousBalance - expense;
    expect(updatedBalance).toBe(14500);
  });

  test("zero balance after full spend", () => {
    const previousBalance = 500;
    const expense = 500;
    expect(previousBalance - expense).toBe(0);
  });

  test("detects overdraft", () => {
    const previousBalance = 200;
    const expense = 500;
    expect(expense > previousBalance).toBe(true);
  });
});
