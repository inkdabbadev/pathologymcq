import Link from "next/link";
import { Microscope } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyto-100 text-rose-700">
        <Microscope className="h-10 w-10" />
      </div>
      <h1 className="mt-8 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
        Slide not found
      </h1>
      <p className="mt-4 max-w-md text-slate-700">
        We couldn&apos;t find the page you were looking for. It may have moved, or
        this section is still being built.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </Container>
  );
}
