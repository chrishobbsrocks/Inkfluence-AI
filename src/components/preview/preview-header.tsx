"use client";

import Link from "next/link";
import { AppHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PreviewHeaderProps {
  bookId: string;
}

export function PreviewHeader({ bookId }: PreviewHeaderProps) {
  return (
    <AppHeader title="Preview & Format">
      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled>
        <Download className="w-3 h-3" /> PDF
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled>
        <Download className="w-3 h-3" /> EPUB
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled>
        <Download className="w-3 h-3" /> MOBI
      </Button>
      <Button size="sm" className="h-8 text-xs bg-stone-900 hover:bg-stone-800" asChild>
        <Link href={`/books/${bookId}/publish`}>Proceed to Publish &rarr;</Link>
      </Button>
    </AppHeader>
  );
}
