import { BookOpen } from "lucide-react";

export function SidebarLogo() {
  return (
    <div className="p-4 pb-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm text-stone-900 tracking-tight font-heading">
          Inkfluence{" "}
          <span className="text-stone-400 font-normal">AI</span>
        </span>
      </div>
    </div>
  );
}
