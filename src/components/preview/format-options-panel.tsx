"use client";

import { Download, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TemplateSelector } from "./template-selector";
import type { BookTemplate } from "@/types/preview";
import type { ExportFormat } from "@/lib/export/types";
import type { ExportStatus } from "@/hooks/use-export";

interface FormatOptionsPanelProps {
  templates: BookTemplate[];
  selectedTemplateId: string;
  selectedTemplate: BookTemplate;
  onTemplateSelect: (templateId: string) => void;
  onExport: (format: ExportFormat) => void;
  exportStatus: ExportStatus;
  activeFormat: ExportFormat | null;
}

function getFontDisplayName(fontValue: string): string {
  if (fontValue.includes("--font-heading")) return "Instrument Serif";
  if (fontValue.includes("--font-body")) return "DM Sans";
  if (fontValue.includes("Georgia")) return "Georgia";
  return fontValue;
}

function getMarginsLabel(template: BookTemplate): string {
  const avg =
    (template.margins.top +
      template.margins.right +
      template.margins.bottom +
      template.margins.left) /
    4;
  if (avg >= 50) return "Wide";
  if (avg >= 38) return "Standard";
  return "Narrow";
}

const EXPORT_FORMATS: Array<{ format: ExportFormat | "mobi"; label: string }> = [
  { format: "pdf", label: "PDF" },
  { format: "epub", label: "EPUB" },
  { format: "mobi", label: "MOBI" },
];

export function FormatOptionsPanel({
  templates,
  selectedTemplateId,
  selectedTemplate,
  onTemplateSelect,
  onExport,
  exportStatus,
  activeFormat,
}: FormatOptionsPanelProps) {
  const isExporting = exportStatus === "generating";

  return (
    <Card className="border-stone-200 h-fit">
      <CardHeader className="p-3.5 pb-2 bg-stone-50 rounded-t-lg border-b border-stone-100">
        <CardTitle className="text-xs font-semibold">
          Formatting Options
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3.5 space-y-4">
        {/* Template selector */}
        <div>
          <div className="text-[11px] font-semibold text-stone-600 mb-2">
            Template
          </div>
          <TemplateSelector
            templates={templates}
            selectedId={selectedTemplateId}
            onSelect={onTemplateSelect}
          />
        </div>

        <Separator />

        {/* Cover Design */}
        <div>
          <div className="text-[11px] font-semibold text-stone-600 mb-2">
            Cover Design
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-[11px] gap-1"
            disabled
          >
            <Sparkles className="w-3 h-3" /> Generate AI Cover
          </Button>
        </div>

        <Separator />

        {/* Font/Size/Margins display */}
        <div className="space-y-1.5 text-[11px]">
          <div className="text-stone-600">
            Font:{" "}
            <strong>{getFontDisplayName(selectedTemplate.fonts.body)}</strong>
          </div>
          <div className="text-stone-600">
            Size: <strong>{selectedTemplate.fontSize}pt</strong>
          </div>
          <div className="text-stone-600">
            Margins: <strong>{getMarginsLabel(selectedTemplate)}</strong>
          </div>
        </div>

        <Separator />

        {/* Export buttons */}
        <div>
          <div className="text-[11px] font-semibold text-stone-600 mb-2">
            Export
          </div>
          <div className="space-y-1.5">
            {EXPORT_FORMATS.map(({ format, label }) => {
              const isMobi = format === "mobi";
              const isActive = isExporting && activeFormat === format;

              return (
                <Button
                  key={format}
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-[10px] gap-1"
                  disabled={isMobi || isExporting}
                  title={isMobi ? "MOBI export coming soon" : undefined}
                  onClick={
                    isMobi ? undefined : () => onExport(format as ExportFormat)
                  }
                >
                  {isActive ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
