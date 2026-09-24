/**
 * Free WhatsApp "click to chat" link. Nothing is sent by our server.
 * It opens WhatsApp on the teacher's own phone or computer with the
 * message typed in. The teacher presses send.
 */

/** Digits only, with the country code. A leading 0 is treated as Ghana (+233). */
export function toWhatsAppNumber(phone: string): string {
  const cleaned = phone.trim();
  const digits = cleaned.replace(/\D/g, "");
  if (cleaned.startsWith("+")) return digits;
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  return `233${digits}`;
}

export function whatsAppLink(phone: string, message = ""): string {
  const base = `https://wa.me/${toWhatsAppNumber(phone)}`;
  return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base;
}
