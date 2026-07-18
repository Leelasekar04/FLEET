---
name: parse_receipt
description: Extract accounting information from receipts, images, text messages, and audio notes for fleet expense tracking. Used by the Parser-Agent to convert WhatsApp driver messages into structured expense JSON.
---

# Parse Receipt Skill

## Purpose

Extract structured expense data from any input a truck driver might send via WhatsApp:
- **Text messages** (English, Hindi, Tamil, Telugu, Hinglish)
- **Voice notes** (audio files — OGG/MP3/WAV)
- **Receipt photos** (JPEG/PNG — petrol bills, toll receipts, workshop bills)

---

## Required Output Format

Always return this exact JSON structure:

```json
{
  "expense_type": "Diesel",
  "amount": 500,
  "location": "Vellore",
  "merchant_name": "Indian Oil Petrol Pump",
  "expense_date": "2024-01-15",
  "notes": "Full tank diesel fill",
  "confidence": 0.98
}
```

---

## Expense Type Normalization

Map all inputs to one of these categories:

| Raw Input | Normalized |
|-----------|-----------|
| diesel, fuel, petrol pump | `Diesel` |
| petrol | `Petrol` |
| tyre, tire, puncture, tube | `Tyre Repair` |
| toll, highway, nhai | `Toll` |
| food, eating, dhaba, tea, meal | `Food` |
| repair, service, mechanic, oil change | `Maintenance` |
| loading, unloading, labour | `Loading` |
| parking, park | `Parking` |
| police, fine, challan | `Police` |
| anything else | `Miscellaneous` |

---

## Validation Rules

1. **Amount** — must be a positive number
   - Remove ₹, Rs., INR, commas
   - Example: "₹1,200" → `1200`

2. **Location** — extract city/town name when mentioned
   - "at Vellore", "Vellore mein", "in Chennai" → `"Vellore"`, `"Chennai"`
   - If not mentioned → `null`

3. **Merchant Name** — only from receipt images
   - If from text/audio → `null`

4. **Expense Date** — ISO 8601 format `YYYY-MM-DD`
   - If not mentioned → `null`

5. **Confidence Score** — float between 0.0 and 1.0
   - 0.9+ = clear, unambiguous
   - 0.7–0.9 = probable, minor guesswork
   - 0.5–0.7 = ambiguous input
   - < 0.5 = reject (request clarification)

---

## Language Handling

Drivers may write in:
- **English**: "Paid 500 for diesel at Vellore"
- **Hindi**: "Vellore mein diesel ke liye 500 diya"
- **Hinglish**: "diesel 500 diya bhai Vellore pe"
- **Tamil**: "வெல்லூரில் டீசலுக்கு 500 கொடுத்தேன்"
- **Telugu**: "వెల్లూరులో డీజిల్‌కు 500 ఇచ్చాను"

Translate and extract regardless of language.

---

## Error Cases

If the input cannot be parsed with confidence ≥ 0.5:
- Return `{ "confidence": 0.0, "error": "Unable to extract expense" }`
- The system will ask the driver to resend in a clearer format

---

## Examples

### Text Input
> "Paid 1200 for tyre puncture repair"

```json
{
  "expense_type": "Tyre Repair",
  "amount": 1200,
  "location": null,
  "merchant_name": null,
  "expense_date": null,
  "notes": "Paid for tyre puncture repair",
  "confidence": 0.95
}
```

### Receipt Image (HP Petrol Pump)
```json
{
  "expense_type": "Diesel",
  "amount": 3500,
  "location": "Chennai",
  "merchant_name": "HP Petrol Pump, Anna Salai",
  "expense_date": "2024-01-15",
  "notes": "Diesel fill-up",
  "confidence": 0.92
}
```

### Voice Note
> "Toll diya 180 rupaye Krishnagiri pe"

```json
{
  "expense_type": "Toll",
  "amount": 180,
  "location": "Krishnagiri",
  "merchant_name": null,
  "expense_date": null,
  "notes": "Toll paid at Krishnagiri",
  "confidence": 0.90,
  "transcription": "Toll diya 180 rupaye Krishnagiri pe"
}
```
