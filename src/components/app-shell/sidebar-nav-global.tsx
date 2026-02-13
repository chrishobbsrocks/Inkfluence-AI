"use client";

import {
  LayoutDashboard,
  FileText,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { SidebarSection } from "./sidebar-section";

export function SidebarNavGlobal() {
  return (
    <>
      <SidebarItem href="/dashboard" icon={LayoutDashboard} label="My Books" />
      <SidebarItem href="/templates" icon={FileText} label="Templates" />
      <SidebarSection label="Tools" />
      <SidebarItem href="/lead-magnets" icon={Target} label="Lead Magnets" />
      <SidebarItem href="/analytics" icon={BarChart3} label="Analytics" />
      <SidebarSection label="Account" />
      <SidebarItem href="/settings" icon={Settings} label="Settings" />
      <SidebarItem href="/help" icon={HelpCircle} label="Help & Support" />
    </>
  );
}
