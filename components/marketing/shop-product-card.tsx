import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/components/marketing/whatsapp-button";
import type { Product } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";

export function ShopProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image src={product.imageUrl} alt="" fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-plum-900">
          {product.name}
        </h3>
        <p className="text-sm leading-relaxed text-slate-700">{product.description}</p>

        {product.includes && (
          <ul className="flex flex-col gap-1 text-xs text-smoke-400">
            {product.includes.map((item) => (
              <li key={item}>&bull; {item}</li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-plum-900">
            {formatPrice(product.priceCents, product.currency)}
          </span>
        </div>

        <Button asChild className="w-full">
          <a
            href={getWhatsAppLink(`Hi! I'd like to order the ${product.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order via WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
