"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface NavDropdownItem {
  category: string;
  label: string;
  children?: NavDropdownItem[];
}

export function NavDropdown({
  label,
  active,
  browseHref,
  browseLabel,
  items,
  getItemHref = (item) => `/courses?exam=${item.category}`,
}: {
  label: string;
  active: boolean;
  browseHref: string;
  browseLabel: string;
  items: NavDropdownItem[];
  /** Builds the href for a leaf item; defaults to the course-catalog filter. */
  getItemHref?: (item: NavDropdownItem) => string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-plum-900 focus:outline-none",
            active && "text-plum-900"
          )}
        >
          {label}
          <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <Link href={browseHref} className="font-semibold text-plum-900">
            {browseLabel}
          </Link>
        </DropdownMenuItem>
        <div className="my-1 h-px bg-iris-300/30" />
        {items.map((item) =>
          item.children?.length ? (
            <DropdownMenuSub key={item.category}>
              <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {item.children.map((child) => (
                  <DropdownMenuItem key={child.category} asChild>
                    <Link href={getItemHref(child)}>{child.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={item.category} asChild>
              <Link href={getItemHref(item)}>{item.label}</Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
