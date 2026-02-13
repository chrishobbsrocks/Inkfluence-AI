import { AppHeader } from "@/components/app-shell";

export default function NewBookPage() {
  return (
    <>
      <AppHeader title="New Book" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Book creation wizard will appear here.
        </p>
      </div>
    </>
  );
}
