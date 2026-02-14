"use client";

interface QADimensionScoreProps {
  label: string;
  score: number;
}

export function QADimensionScore({ label, score }: QADimensionScoreProps) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-stone-700">{score}</div>
      <div className="text-[10px] text-stone-400">{label}</div>
    </div>
  );
}
