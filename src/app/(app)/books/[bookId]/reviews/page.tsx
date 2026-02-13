import { AppHeader } from "@/components/app-shell";

export default function ReviewsPage() {
  return (
    <>
      <AppHeader title="Reviews" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Book reviews will appear here.
        </p>
      </div>
    </>
  );
}
