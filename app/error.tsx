"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyto-100 text-rose-700">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="mt-8 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-slate-700">
        An unexpected error occurred while loading this page. You can try again.
      </p>
      <Button className="mt-8" onClick={() => reset()}>
        Try again
      </Button>
    </Container>
  );
}
