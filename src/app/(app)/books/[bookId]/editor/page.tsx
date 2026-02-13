import { AppHeader } from "@/components/app-shell";

export default function EditorPage() {
  return (
    <>
      <AppHeader title="Chapters" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Chapter editor will appear here.
        </p>
      </div>
    </>
  );
}
