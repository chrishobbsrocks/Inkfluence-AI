import { AppHeader } from "@/components/app-shell";

export default function AnalyticsPage() {
  return (
    <>
      <AppHeader title="Analytics" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Analytics dashboard will appear here.
        </p>
      </div>
    </>
  );
}
