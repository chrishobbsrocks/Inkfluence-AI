"use client";

import { useUser } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";

export function SidebarUserProfile() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-stone-200 animate-pulse" />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="h-3 w-20 bg-stone-200 rounded animate-pulse" />
            <div className="h-2.5 w-14 bg-stone-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const initials =
    (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U";
  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || "User";

  return (
    <div className="p-3">
      <div className="flex items-center gap-2.5">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-stone-300 flex items-center justify-center text-[10px] font-bold text-stone-600">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-stone-700 truncate">
            {displayName}
          </div>
          <div className="text-[10px] text-stone-400">Free Plan</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
      </div>
    </div>
  );
}
