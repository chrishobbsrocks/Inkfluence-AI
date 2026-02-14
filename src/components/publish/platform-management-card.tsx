"use client";

import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformCard } from "./platform-card";
import {
  PLATFORM_DEFINITIONS,
  type PlatformCardData,
  type PlatformStatus,
} from "@/types/publishing-platform";

export interface PlatformManagementCardProps {
  platforms: PlatformCardData[];
  onConnect: (code: string) => void;
  onDisconnect: (code: string) => void;
  onToggleSelect: (code: string) => void;
  onStatusChange: (code: string, status: PlatformStatus) => void;
  disabled?: boolean;
}

export function PlatformManagementCard({
  platforms,
  onConnect,
  onDisconnect,
  onToggleSelect,
  onStatusChange,
  disabled = false,
}: PlatformManagementCardProps) {
  const connectedPlatforms = platforms.filter((p) => p.connected);
  const unconnectedCodes = PLATFORM_DEFINITIONS.filter(
    (def) => !platforms.some((p) => p.code === def.code && p.connected)
  ).map((def) => def.code);

  return (
    <Card className="border-stone-200">
      <CardHeader className="p-3.5 pb-2 bg-stone-50 border-b border-stone-100">
        <CardTitle className="text-xs font-semibold flex items-center justify-between">
          <span>Publishing Platforms</span>
          <span className="text-[10px] font-normal text-stone-400">
            {connectedPlatforms.length} connected
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3.5">
        {connectedPlatforms.length > 0 ? (
          connectedPlatforms.map((platform) => (
            <PlatformCard
              key={platform.code}
              platform={platform}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onToggleSelect={onToggleSelect}
              onStatusChange={onStatusChange}
              disabled={disabled}
            />
          ))
        ) : (
          <p className="text-xs text-stone-400 py-2">
            No platforms connected yet. Add a platform to get started.
          </p>
        )}

        {/* Add platform */}
        {unconnectedCodes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <Select
              onValueChange={(code) => onConnect(code)}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 text-xs border-dashed border-stone-300">
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Plus className="w-3 h-3" />
                  <SelectValue placeholder="Add platform..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                {unconnectedCodes.map((code) => {
                  const def = PLATFORM_DEFINITIONS.find(
                    (d) => d.code === code
                  )!;
                  return (
                    <SelectItem key={code} value={code} className="text-xs">
                      {def.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
