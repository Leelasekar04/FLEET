// ============================================================
// Parser-Agent — Gemini AI Expense Extractor
// ============================================================
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const logger = require("../../utils/logger");
const { TEXT_PROMPT, AUDIO_PROMPT, IMAGE_PROMPT } = require("./prompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// ─── Main Parse Function ──────────────────────────────────
async function parseExpense(payload) {
  const { message_type, text, file_path } = payload;

  try {
    switch (message_type) {
      case "text":
        return await parseTextExpense(text);

      case "audio":
        return await parseAudioExpense(file_path);

      case "image":
      case "document":
        return await parseImageExpense(file_path);

      default:
        logger.warn(`Unknown message type for parsing: ${message_type}`);
        return null;
    }
  } catch (err) {
    logger.error(`Parser error: ${err.message}`);
    return { confidence: 0, error: err.message };
  }
}

// ─── Text Parsing ─────────────────────────────────────────
async function parseTextExpense(text) {
  logger.info(`🔤 Parsing text expense: "${text}"`);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = TEXT_PROMPT.replace("{{INPUT}}", text);

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return extractJSON(response);
}

// ─── Audio Parsing ────────────────────────────────────────
async function parseAudioExpense(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    logger.warn("Audio file not found");
    return { confidence: 0, error: "Audio file not found" };
  }

  logger.info(`🎙️ Parsing audio expense: ${filePath}`);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const audioData = fs.readFileSync(filePath);
  const base64Audio = audioData.toString("base64");

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === ".mp3" ? "audio/mp3"
    : ext === ".ogg" ? "audio/ogg"
    : ext === ".wav" ? "audio/wav"
    : "audio/ogg";

  const result = await model.generateContent([
    { text: AUDIO_PROMPT },
    {
      inlineData: {
        mimeType,
        data: base64Audio,
      },
    },
  ]);

  const response = result.response.text();
  return extractJSON(response);
}

// ─── Image / Receipt Parsing ──────────────────────────────
async function parseImageExpense(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    logger.warn("Image file not found");
    return { confidence: 0, error: "Image file not found" };
  }

  logger.info(`🖼️ Parsing receipt image: ${filePath}`);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const imageData = fs.readFileSync(filePath);
  const base64Image = imageData.toString("base64");

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === ".png" ? "image/png"
    : ext === ".webp" ? "image/webp"
    : "image/jpeg";

  const result = await model.generateContent([
    { text: IMAGE_PROMPT },
    {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    },
  ]);

  const response = result.response.text();
  return extractJSON(response);
}

// ─── JSON Extractor ───────────────────────────────────────
function extractJSON(text) {
  try {
    // Try direct parse
    return JSON.parse(text.trim());
  } catch {
    // Try extracting JSON from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch {}
    }
    // Try finding raw JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {}
    }
    logger.error(`Could not extract JSON from Gemini response: ${text}`);
    return { confidence: 0, error: "JSON extraction failed" };
  }
}

// ─── Normalize Expense Categories ─────────────────────────
function normalizeExpenseType(type) {
  if (!type) return "Miscellaneous";
  const t = type.toLowerCase().trim();
  const map = {
    diesel: "Diesel", fuel: "Diesel", petrol: "Petrol",
    tyre: "Tyre Repair", tire: "Tyre Repair", puncture: "Tyre Repair",
    toll: "Toll", highway: "Toll",
    food: "Food", meal: "Food", eating: "Food",
    repair: "Maintenance", service: "Maintenance", maintenance: "Maintenance",
    loading: "Loading", unloading: "Loading",
    parking: "Parking",
    police: "Police", fine: "Police",
  };
  for (const [key, val] of Object.entries(map)) {
    if (t.includes(key)) return val;
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

module.exports = { parseExpense, normalizeExpenseType };
