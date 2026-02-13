import { AppHeader } from "@/components/app-shell";

export default function HelpPage() {
  return (
    <>
      <AppHeader title="Help & Support" />
      <div className="flex-1 p-6">
        <p className="text-sm text-stone-500">
          Help and support resources will appear here.
        </p>
      </div>
    </>
  );
}
