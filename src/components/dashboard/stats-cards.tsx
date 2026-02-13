import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Upload, TrendingUp, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalBooks: number;
    publishedCount: number;
    writingCount: number;
    draftCount: number;
    reviewCount: number;
  };
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <Card className="border-stone-200">
      <CardContent className="p-4 text-center">
        <Icon className="w-4 h-4 text-stone-400 mx-auto mb-1.5" />
        <div className="text-2xl font-bold text-stone-900">{value}</div>
        <div className="text-[11px] text-stone-400 mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats }: StatsCardsProps) {
  const inProgress =
    stats.writingCount + stats.draftCount + stats.reviewCount;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <StatCard icon={BookOpen} value={stats.totalBooks} label="Total Books" />
      <StatCard icon={Upload} value={stats.publishedCount} label="Published" />
      <StatCard icon={TrendingUp} value={inProgress} label="In Progress" />
      <StatCard icon={Download} value={0} label="Downloads" />
    </div>
  );
}
