"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/components/marketing/whatsapp-button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

/**
 * Site-wide floating support entry point — replaces the nav's "Contact /
 * WhatsApp" link. Lifted higher on course detail pages so it clears the
 * full-width sticky "Enroll now" bar (components/course/sticky-enroll-bar.tsx)
 * instead of overlapping it.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const hasStickyEnrollBar = pathname?.startsWith("/courses/") && pathname !== "/courses/";

  return (
    <a
      href={getWhatsAppLink("Hi! I have a question about Pathology MCQ.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lifted transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(37,211,102,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:right-8",
        hasStickyEnrollBar ? "bottom-24 sm:bottom-28" : "bottom-5 sm:bottom-8"
      )}
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
