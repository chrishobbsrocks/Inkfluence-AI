"use client";

import Link from "next/link";
import { AppHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { ExportFormat } from "@/lib/export/types";
import type { ExportStatus } from "@/hooks/use-export";

interface PreviewHeaderProps {
  bookId: string;
  onExport: (format: ExportFormat) => void;
  exportStatus: ExportStatus;
  activeFormat: ExportFormat | null;
  exportError: string | null;
}

export function PreviewHeader({
  bookId,
  onExport,
  exportStatus,
  activeFormat,
  exportError,
}: PreviewHeaderProps) {
  const isExporting = exportStatus === "generating";

  return (
    <AppHeader title="Preview & Format">
      {exportError && (
        <span className="text-[10px] text-red-500 mr-2">{exportError}</span>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5"
        onClick={() => onExport("pdf")}
        disabled={isExporting}
      >
        {isExporting && activeFormat === "pdf" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Download className="w-3 h-3" />
        )}
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5"
        onClick={() => onExport("epub")}
        disabled={isExporting}
      >
        {isExporting && activeFormat === "epub" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Download className="w-3 h-3" />
        )}
        EPUB
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5"
        disabled
        title="MOBI export coming soon. Modern Kindles support EPUB."
      >
        <Download className="w-3 h-3" /> MOBI
      </Button>
      <Button size="sm" className="h-8 text-xs bg-stone-900 hover:bg-stone-800" asChild>
        <Link href={`/books/${bookId}/publish`}>Proceed to Publish &rarr;</Link>
      </Button>
    </AppHeader>
  );
}
