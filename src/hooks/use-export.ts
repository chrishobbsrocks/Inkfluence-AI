"use client";

import { useState, useCallback } from "react";
import type { ExportFormat } from "@/lib/export/types";

export type ExportStatus = "idle" | "generating" | "error";

interface UseExportOptions {
  bookId: string;
  templateId: string;
}

interface UseExportReturn {
  status: ExportStatus;
  activeFormat: ExportFormat | null;
  error: string | null;
  exportBook: (format: ExportFormat) => void;
}

export function useExport({
  bookId,
  templateId,
}: UseExportOptions): UseExportReturn {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exportBook = useCallback(
    async (format: ExportFormat) => {
      setStatus("generating");
      setActiveFormat(format);
      setError(null);

      try {
        const response = await fetch(`/api/export/${format}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId, templateId }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          const message =
            (data as { error?: string } | null)?.error ??
            `Export failed (${response.status})`;
          throw new Error(message);
        }

        // Get the blob and trigger download
        const blob = await response.blob();
        const contentDisposition = response.headers.get("Content-Disposition");
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
        const filename = filenameMatch?.[1] ?? `export.${format}`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setStatus("idle");
        setActiveFormat(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Export failed. Please try again.";
        setError(message);
        setStatus("error");
        setActiveFormat(null);
      }
    },
    [bookId, templateId]
  );

  return { status, activeFormat, error, exportBook };
}
