// ============================================================
// Ledger-Agent — WhatsApp Message Store
// ============================================================
const { supabase } = require("./supabase");
const logger = require("../../utils/logger");

async function saveWhatsAppMessage({ driverPhone, waMessageId, messageType, rawPayload, status }) {
  try {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .insert({
        driver_phone: driverPhone,
        wa_message_id: waMessageId,
        message_type: messageType,
        raw_payload: rawPayload,
        status,
      })
      .select()
      .single();

    if (error) {
      logger.warn(`Failed to save WhatsApp message: ${error.message}`);
      return null;
    }
    return data;
  } catch (err) {
    logger.error(`saveWhatsAppMessage error: ${err.message}`);
    return null;
  }
}

async function updateMessageStatus(waMessageId, status, parsedExpense, errorMessage) {
  try {
    await supabase
      .from("whatsapp_messages")
      .update({
        status,
        parsed_expense: parsedExpense || null,
        error_message: errorMessage || null,
      })
      .eq("wa_message_id", waMessageId);
  } catch (err) {
    logger.error(`updateMessageStatus error: ${err.message}`);
  }
}

module.exports = { saveWhatsAppMessage, updateMessageStatus };
