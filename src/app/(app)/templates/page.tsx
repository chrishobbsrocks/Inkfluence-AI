import { AppHeader } from "@/components/app-shell";

export default function TemplatesPage() {
  return (
    <>
      <AppHeader title="Templates" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Book templates will appear here.
        </p>
      </div>
    </>
  );
}
