"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
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
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white p-6 shadow-lifted"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-lg font-bold text-plum-900">
                    Your Cart
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close cart"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-plum-900 hover:bg-mist-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyto-100 text-rose-700">
                    <ShoppingBag className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-plum-900">
                      Your cart is empty
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      Looks like you haven&apos;t added any courses yet.
                    </p>
                  </div>
                  <Button asChild size="lg" onClick={() => onOpenChange(false)}>
                    <Link href="/courses">Continue shopping</Link>
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
