import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  ambient?: boolean;
}

export function Section({ className, ambient, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "relative py-16 md:py-24",
        ambient && "bg-ambient",
        className
      )}
      {...props}
    />
  );
}
