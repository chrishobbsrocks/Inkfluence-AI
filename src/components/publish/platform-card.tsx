"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlatformCardData, PlatformStatus } from "@/types/publishing-platform";

export interface PlatformCardProps {
  platform: PlatformCardData;
  onConnect: (code: string) => void;
  onDisconnect: (code: string) => void;
  onToggleSelect: (code: string) => void;
  onStatusChange: (code: string, status: PlatformStatus) => void;
  disabled?: boolean;
}

const STATUS_LABELS: Record<PlatformStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  published: "Published",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<PlatformStatus, string> = {
  draft: "bg-stone-100 text-stone-600",
  submitted: "bg-amber-50 text-amber-700",
  published: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export function PlatformCard({
  platform,
  onConnect,
  onDisconnect,
  onToggleSelect,
  onStatusChange,
  disabled = false,
}: PlatformCardProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
      {/* Platform code badge */}
      <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
        {platform.code}
      </div>

      {/* Platform info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-stone-700">
          {platform.name}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${STATUS_COLORS[platform.status]}`}
          >
            {STATUS_LABELS[platform.status]}
          </span>
          {platform.submittedAt && (
            <span className="text-[10px] text-stone-400">
              Submitted {new Date(platform.submittedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Status dropdown for connected platforms */}
      {platform.connected && (
        <Select
          value={platform.status}
          onValueChange={(val) =>
            onStatusChange(platform.code, val as PlatformStatus)
          }
          disabled={disabled}
        >
          <SelectTrigger className="h-7 w-[110px] text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_LABELS) as PlatformStatus[]).map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Connect/Disconnect + Selection checkbox */}
      {platform.connected ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSelect(platform.code)}
            disabled={disabled}
            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
              platform.selected
                ? "bg-stone-900 text-white"
                : "border-2 border-stone-300 hover:border-stone-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            aria-label={`Select ${platform.name} for publishing`}
          >
            {platform.selected && <Check className="w-3 h-3" />}
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-stone-400 hover:text-red-600"
            onClick={() => onDisconnect(platform.code)}
            disabled={disabled}
          >
            Remove
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px]"
          onClick={() => onConnect(platform.code)}
          disabled={disabled}
        >
          Connect
        </Button>
      )}
    </div>
  );
}
