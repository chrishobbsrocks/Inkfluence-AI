"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarLogo } from "./sidebar-logo";
import { SidebarNavGlobal } from "./sidebar-nav-global";
import { SidebarNavBook } from "./sidebar-nav-book";
import { SidebarUserProfile } from "./sidebar-user-profile";
import { useBookContext } from "./book-context";

export function AppSidebar() {
  const book = useBookContext();

  return (
    <aside className="w-56 bg-stone-50 border-r border-stone-200 flex flex-col min-h-screen">
      <SidebarLogo />
      <Separator className="bg-stone-200" />
      <nav className="flex-1 p-2 space-y-0.5">
        {book ? <SidebarNavBook /> : <SidebarNavGlobal />}
      </nav>
      <Separator className="bg-stone-200" />
      <SidebarUserProfile />
    </aside>
  );
}
