import { AppHeader } from "@/components/app-shell";

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="My Books" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Your books will appear here.
        </p>
      </div>
    </>
  );
}
