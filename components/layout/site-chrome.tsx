"use client";

import { usePathname } from "next/navigation";

import { AdminBar } from "@/components/admin/admin-bar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
      {!isAdmin && <AdminBar />}
    </>
  );
}
