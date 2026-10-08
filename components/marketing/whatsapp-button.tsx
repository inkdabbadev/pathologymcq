"use client";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/lib/catalog/hooks";
import { normalizeWhatsAppNumber } from "@/lib/site/whatsapp";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "910000000000";

export function getWhatsAppLink(message?: string) {
  return buildWaLink(WHATSAPP_NUMBER, message);
}

/** Build a wa.me link for a specific number (from site settings). */
export function buildWaLink(number: string, message?: string) {
  const base = `https://wa.me/${normalizeWhatsAppNumber(number || WHATSAPP_NUMBER)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function WhatsAppButton({
  message,
  className,
  label = "Chat on WhatsApp",
}: {
  message?: string;
  className?: string;
  label?: string;
}) {
  const settings = useSiteSettings();

  return (
    <a
      href={buildWaLink(settings.whatsappNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2.5 rounded-full border border-iris-300/70 bg-white px-6 text-sm font-semibold leading-none text-plum-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-royal-500 hover:shadow-soft",
        className
      )}
    >
      <WhatsAppIcon className="h-[18px] w-[18px] shrink-0 text-[#25D366]" />
      <span className="block leading-none">{label}</span>
    </a>
  );
}
