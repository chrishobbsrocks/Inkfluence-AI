import { Sparkles, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-shell";

interface OutlineHeaderProps {
  bookTitle: string;
}

export function OutlineHeader({ bookTitle }: OutlineHeaderProps) {
  return (
    <AppHeader title={`Outline \u2014 ${bookTitle}`}>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1">
          <Sparkles className="w-3 h-3" />
          AI Suggestions
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1">
          <Plus className="w-3 h-3" />
          Add Chapter
        </Button>
        <Button size="sm" className="h-7 text-[11px] bg-stone-900 hover:bg-stone-800 gap-1">
          Continue to Writing
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </AppHeader>
  );
}
