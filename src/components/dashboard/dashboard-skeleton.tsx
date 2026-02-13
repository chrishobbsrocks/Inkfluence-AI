import { Skeleton } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/app-shell";

export function DashboardSkeleton() {
  return (
    <>
      <AppHeader title="My Books" />
      <div className="flex-1 bg-stone-50/50 p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-stone-200 rounded-lg p-4 text-center">
              <Skeleton className="h-4 w-4 mx-auto mb-1.5 rounded" />
              <Skeleton className="h-7 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-stone-200 rounded-lg p-3">
              <Skeleton className="h-20 rounded-md mb-3" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2 mb-2.5" />
              <Skeleton className="h-1 mb-2.5" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
