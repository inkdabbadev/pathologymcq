"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { useSiteSettings } from "@/lib/catalog/hooks";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const settings = useSiteSettings();
  const navLinks = settings.nav;
  const logoUrl = settings.logoUrl || "/brand/pathology-mcq-mark.png";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-center px-[var(--gutter)] pt-3">
      <div
        className={cn(
          "flex w-full max-w-[1600px] items-center justify-between gap-3 rounded-full border border-white/40 bg-white/70 backdrop-blur-xl transition-all duration-300",
          scrolled ? "h-14 px-4 shadow-soft" : "h-18 px-6 shadow-none"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-base sm:text-lg font-bold text-plum-900">
          <img src={logoUrl} alt={settings.siteName} className="h-8 w-8 shrink-0 rounded-md object-cover" />
          {settings.siteName}
        </Link>

        <nav className="hidden min-w-0 items-center gap-0 overflow-x-auto xl:flex 2xl:gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-full px-2 py-2 text-[13px] 2xl:px-3 2xl:text-sm font-medium text-slate-700 transition-colors hover:text-plum-900",
                  active && "text-plum-900"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-mist-100"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-plum-900 transition-colors hover:bg-mist-100 sm:inline-flex"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-700 text-[10px] font-semibold text-white">
              0
            </span>
          </button>
          <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href="https://pathologymcqs.com/?auth=login">
              Login
            </a>
          </Button>

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/practice">Try free MCQs</Link>
          </Button>

          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-plum-900 hover:bg-mist-100 xl:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
            <AnimatePresence>
              {mobileOpen && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild forceMount>
                    <motion.div
                      className="fixed inset-0 z-50 bg-plum-900/40 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild forceMount aria-describedby={undefined}>
                    <motion.div
                      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-lifted"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", stiffness: 320, damping: 34 }}
                    >
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="font-display text-lg font-bold text-plum-900">
                          Menu
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            aria-label="Close menu"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-plum-900 hover:bg-mist-100"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <nav className="mt-8 flex flex-col gap-1">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-mist-100 hover:text-plum-900"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>

                      <div className="mt-auto flex flex-col gap-3 pt-8">
                        <Button asChild variant="outline">
                          <a href="https://pathologymcqs.com/?auth=login" onClick={() => setMobileOpen(false)}>
                            Login
                          </a>
                        </Button>
                        <Button asChild>
                          <Link href="/practice" onClick={() => setMobileOpen(false)}>
                            Try free MCQs
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
