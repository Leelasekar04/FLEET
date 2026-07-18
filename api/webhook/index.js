// ============================================================
// Gateway-Agent — WhatsApp Webhook Handler
// ============================================================
const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const parserService = require("../services/ai/parser");
const ledgerService = require("../services/db/ledger");
const logger = require("../utils/logger");
const { saveWhatsAppMessage } = require("../services/db/messages");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WA_API_BASE = process.env.WHATSAPP_API_BASE || "https://graph.facebook.com";
const WA_API_VERSION = process.env.WHATSAPP_API_VERSION || "v19.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Temp directory for media files
const TEMP_DIR = path.join(__dirname, "../tmp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// ─── GET /api/webhook — Verification ──────────────────────
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    logger.info("✅ WhatsApp webhook verified successfully");
    return res.status(200).send(challenge);
  }

  logger.warn("❌ WhatsApp webhook verification failed");
  return res.status(403).json({ error: "Verification failed" });
});

// ─── POST /api/webhook — Incoming Messages ────────────────
router.post("/", async (req, res) => {
  // WhatsApp sends raw body — parse it
  let body;
  try {
    body = JSON.parse(req.body.toString());
  } catch {
    body = req.body;
  }

  // Acknowledge immediately (WhatsApp requires < 5s response)
  res.status(200).json({ status: "received" });

  // Process asynchronously
  try {
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) return;

    const message = messages[0];
    const driverPhone = message.from; // e.g. "919999999999"
    const formattedPhone = `+${driverPhone}`;
    const waMessageId = message.id;
    const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

    logger.info(`📱 Incoming message from ${formattedPhone} | type: ${message.type}`);

    // Build normalized payload
    let normalizedPayload = {
      driver_phone: formattedPhone,
      message_type: message.type,
      wa_message_id: waMessageId,
      timestamp,
      file_path: null,
      text: null,
    };

    // ── Handle message types ─────────────────────────────
    switch (message.type) {
      case "text":
        normalizedPayload.text = message.text?.body;
        break;

      case "audio":
      case "voice": {
        const mediaId = message.audio?.id || message.voice?.id;
        normalizedPayload.message_type = "audio";
        normalizedPayload.file_path = await downloadMedia(mediaId, "audio");
        break;
      }

      case "image": {
        const mediaId = message.image?.id;
        normalizedPayload.file_path = await downloadMedia(mediaId, "image");
        break;
      }

      case "document": {
        const mediaId = message.document?.id;
        normalizedPayload.file_path = await downloadMedia(mediaId, "document");
        normalizedPayload.message_type = "image"; // treat as image for parsing
        break;
      }

      default:
        logger.warn(`Unsupported message type: ${message.type}`);
        await sendWhatsAppMessage(formattedPhone,
          "Sorry, I only understand text messages, voice notes, and receipt photos. Please send your expense as one of these.");
        return;
    }

    // ── Save raw message ─────────────────────────────────
    const savedMessage = await saveWhatsAppMessage({
      driverPhone: formattedPhone,
      waMessageId,
      messageType: normalizedPayload.message_type,
      rawPayload: body,
      status: "received",
    });

    // ── Route to Parser-Agent ────────────────────────────
    logger.info(`🔀 Routing to Parser-Agent: ${JSON.stringify({ type: normalizedPayload.message_type })}`);
    const parsedExpense = await parserService.parseExpense(normalizedPayload);

    if (!parsedExpense || parsedExpense.confidence < 0.5) {
      logger.warn(`Low confidence parse: ${JSON.stringify(parsedExpense)}`);
      await sendWhatsAppMessage(formattedPhone,
        "I couldn't understand that expense clearly. Please try:\n- Text: \"Paid 500 for diesel at Vellore\"\n- Or send a receipt photo 📷");
      return;
    }

    logger.info(`✅ Parsed expense: ${JSON.stringify(parsedExpense)}`);

    // ── Route to Ledger-Agent ────────────────────────────
    const result = await ledgerService.recordExpense(formattedPhone, parsedExpense);

    if (result.error) {
      await sendWhatsAppMessage(formattedPhone, result.error);
      return;
    }

    // ── Send confirmation ────────────────────────────────
    const confirmMsg = formatConfirmation(result, parsedExpense);
    await sendWhatsAppMessage(formattedPhone, confirmMsg);

    // ── Cleanup temp file ────────────────────────────────
    if (normalizedPayload.file_path && fs.existsSync(normalizedPayload.file_path)) {
      fs.unlinkSync(normalizedPayload.file_path);
    }

  } catch (err) {
    logger.error(`❌ Webhook processing error: ${err.message}`, { stack: err.stack });
  }
});

// ─── Download Media from WhatsApp ─────────────────────────
async function downloadMedia(mediaId, type) {
  try {
    // Step 1: Get media URL
    const metaRes = await axios.get(
      `${WA_API_BASE}/${WA_API_VERSION}/${mediaId}`,
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
    const mediaUrl = metaRes.data.url;

    // Step 2: Download binary
    const fileRes = await axios.get(mediaUrl, {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
    });

    // Step 3: Save to temp
    const ext = type === "audio" ? "ogg" : type === "image" ? "jpg" : "bin";
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(TEMP_DIR, fileName);
    fs.writeFileSync(filePath, fileRes.data);

    logger.info(`💾 Media saved: ${filePath}`);
    return filePath;
  } catch (err) {
    logger.error(`Failed to download media: ${err.message}`);
    return null;
  }
}

// ─── Send WhatsApp Message ────────────────────────────────
async function sendWhatsAppMessage(to, text) {
  try {
    const phone = to.replace("+", "");
    await axios.post(
      `${WA_API_BASE}/${WA_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    logger.info(`📤 Reply sent to ${to}`);
  } catch (err) {
    logger.error(`Failed to send WhatsApp message: ${err.message}`);
  }
}

// ─── Format Confirmation Message ─────────────────────────
function formatConfirmation(ledgerResult, expense) {
  const amount = new Intl.NumberFormat("en-IN").format(expense.amount);
  const balance = new Intl.NumberFormat("en-IN").format(ledgerResult.updated_balance);
  const lines = [
    `✅ *Expense Recorded*`,
    ``,
    `🧾 Type: ${expense.expense_type}`,
    `💰 Amount: ₹${amount}`,
    expense.location ? `📍 Location: ${expense.location}` : null,
    ``,
    `🚛 Trip: ${ledgerResult.trip_code}`,
    `📊 Remaining Batta: ₹${balance}`,
    ``,
    `_${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}_`,
  ];
  return lines.filter(Boolean).join("\n");
}

module.exports = router;
