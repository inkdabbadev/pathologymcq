import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MockTestProduct } from "@/lib/mock/mock-test-products";

export function MockTestCard({ product }: { product: MockTestProduct }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image src={product.imageUrl} alt="" fill className="object-cover" />
        <Badge variant="solid" className="absolute left-4 top-4">
          {product.examPattern}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-base font-semibold leading-snug text-plum-900">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-smoke-400">{product.questionCount} questions</p>
        </div>
        <Button asChild className="mt-auto w-full text-xs sm:text-sm">
          <Link href="/login?redirect=/mock-tests">Access {product.shortLabel} here</Link>
        </Button>
      </div>
    </div>
  );
}
