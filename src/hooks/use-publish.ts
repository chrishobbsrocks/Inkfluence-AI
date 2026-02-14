"use client";

import { useState, useCallback } from "react";
import { markPlatformSubmittedAction } from "@/server/actions/publishing-platforms";
import type {
  PlatformCardData,
  PlatformExportFormat,
} from "@/types/publishing-platform";
import { PLATFORM_DEFINITIONS } from "@/types/publishing-platform";

export type PublishStatus = "idle" | "publishing" | "error";

interface PublishProgress {
  currentPlatform: string | null;
  currentStep: "export" | "metadata" | "marking" | null;
  completed: number;
  total: number;
}

interface UsePublishOptions {
  bookId: string;
  templateId: string;
}

interface UsePublishReturn {
  status: PublishStatus;
  progress: PublishProgress;
  error: string | null;
  publishSelected: (platforms: PlatformCardData[]) => void;
}

/** Trigger a browser download from a fetch response */
async function downloadResponse(response: Response, fallbackName: string) {
  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition");
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
  const filename = filenameMatch?.[1] ?? fallbackName;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getExportFormat(platformCode: string): PlatformExportFormat {
  const def = PLATFORM_DEFINITIONS.find((p) => p.code === platformCode);
  return def?.exportFormat ?? "pdf";
}

export function usePublish({
  bookId,
  templateId,
}: UsePublishOptions): UsePublishReturn {
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PublishProgress>({
    currentPlatform: null,
    currentStep: null,
    completed: 0,
    total: 0,
  });

  const publishSelected = useCallback(
    async (platforms: PlatformCardData[]) => {
      const selected = platforms.filter((p) => p.selected && p.connected);
      if (selected.length === 0) return;

      setStatus("publishing");
      setError(null);
      setProgress({
        currentPlatform: null,
        currentStep: null,
        completed: 0,
        total: selected.length,
      });

      try {
        for (let i = 0; i < selected.length; i++) {
          const platform = selected[i]!;
          const format = getExportFormat(platform.code);

          // Step 1: Export book file
          setProgress({
            currentPlatform: platform.name,
            currentStep: "export",
            completed: i,
            total: selected.length,
          });

          const exportRes = await fetch(`/api/export/${format}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId, templateId }),
          });

          if (!exportRes.ok) {
            const data = await exportRes.json().catch(() => null);
            throw new Error(
              (data as { error?: string } | null)?.error ??
                `Export failed for ${platform.name}`
            );
          }

          await downloadResponse(exportRes, `book.${format}`);

          // Step 2: Download metadata JSON
          setProgress({
            currentPlatform: platform.name,
            currentStep: "metadata",
            completed: i,
            total: selected.length,
          });

          const metadataRes = await fetch("/api/publish/metadata-json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId, platformCode: platform.code }),
          });

          if (!metadataRes.ok) {
            const data = await metadataRes.json().catch(() => null);
            throw new Error(
              (data as { error?: string } | null)?.error ??
                `Metadata export failed for ${platform.name}`
            );
          }

          await downloadResponse(metadataRes, `${platform.code}-metadata.json`);

          // Step 3: Mark platform as submitted
          setProgress({
            currentPlatform: platform.name,
            currentStep: "marking",
            completed: i,
            total: selected.length,
          });

          await markPlatformSubmittedAction(bookId, platform.code);
        }

        setProgress({
          currentPlatform: null,
          currentStep: null,
          completed: selected.length,
          total: selected.length,
        });
        setStatus("idle");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Publishing failed. Please try again.";
        setError(message);
        setStatus("error");
      }
    },
    [bookId, templateId]
  );

  return { status, progress, error, publishSelected };
}
