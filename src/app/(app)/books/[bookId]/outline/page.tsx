import { AppHeader } from "@/components/app-shell";

export default function OutlinePage() {
  return (
    <>
      <AppHeader title="Outline" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Book outline editor will appear here.
        </p>
      </div>
    </>
  );
}
