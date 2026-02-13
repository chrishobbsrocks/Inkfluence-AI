import { AppHeader } from "@/components/app-shell";

export default function SettingsPage() {
  return (
    <>
      <AppHeader title="Settings" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Account settings will appear here.
        </p>
      </div>
    </>
  );
}
