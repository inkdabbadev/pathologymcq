import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "910000000000";

export function getWhatsAppLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
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
  return (
    <a
      href={getWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-iris-300/70 bg-white px-5 text-sm font-semibold text-plum-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-royal-500 hover:shadow-soft",
        className
      )}
    >
      <MessageCircle className="h-4 w-4 text-rose-700" />
      {label}
    </a>
  );
}
