import { Skeleton } from "@/components/ui/skeleton";

export default function OutlineLoading() {
  return (
    <div className="flex-1 p-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
