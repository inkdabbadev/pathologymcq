export const WHATSAPP_COUNTRY_CODE = "91";

export function normalizeWhatsAppNumber(number: string | null | undefined): string {
  const digits = (number ?? "").replace(/[^0-9]/g, "");
  if (!digits) return `${WHATSAPP_COUNTRY_CODE}0000000000`;
  return digits.startsWith(WHATSAPP_COUNTRY_CODE)
    ? digits
    : `${WHATSAPP_COUNTRY_CODE}${digits.replace(/^0+/, "")}`;
}
