"use client";

interface QAScoreBadgeProps {
  score: number;
  size?: "sm" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 border-green-600";
  if (score >= 60) return "text-amber-500 border-amber-500";
  return "text-red-500 border-red-500";
}

export function QAScoreBadge({ score, size = "lg" }: QAScoreBadgeProps) {
  const isLarge = size === "lg";
  const dimension = isLarge ? "w-16 h-16" : "w-10 h-10";
  const borderWidth = isLarge ? "border-4" : "border-[3px]";
  const textSize = isLarge ? "text-xl" : "text-sm";

  return (
    <div
      className={`${dimension} rounded-full ${borderWidth} ${getScoreColor(score)} flex items-center justify-center font-bold ${textSize}`}
    >
      {score}
    </div>
  );
}
