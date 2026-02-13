import { AppHeader } from "@/components/app-shell";

export default function PreviewPage() {
  return (
    <>
      <AppHeader title="Preview" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Book preview will appear here.
        </p>
      </div>
    </>
  );
}
