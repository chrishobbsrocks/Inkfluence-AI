"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
}

export function SidebarItem({
  href,
  icon: Icon,
  label,
  exact = false,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors",
        isActive
          ? "bg-white text-stone-900 font-semibold shadow-sm border border-stone-200"
          : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
      )}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
