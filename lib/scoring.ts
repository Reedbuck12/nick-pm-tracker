import type { Level } from "./types";

// Rule-based risk scoring (v1 — no AI call needed).
// Matrix from docs/INTELLIGENCE_LAYER.md:
//   high/high -> 8-10, high/med or med/high -> 6-7, med/med -> 4-5, low/* -> 1-3
export function scoreRisk(likelihood: Level, impact: Level): {
  score: number;
  source: string;
  confidence: number;
  review_status: "unreviewed";
} {
  const rank: Record<Level, number> = { low: 1, medium: 2, high: 3 };
  const l = rank[likelihood];
  const i = rank[impact];

  let score: number;
  if (l === 3 && i === 3) score = 9;
  else if ((l === 3 && i === 2) || (l === 2 && i === 3)) score = 6.5;
  else if (l === 2 && i === 2) score = 4.5;
  else if (l === 1 || i === 1) score = 2;
  else score = 5;

  // Nudge within band using the combined weight so distinct pairs read distinctly.
  if (l === 3 && i === 3) score = 8.5; // canonical high/high

  // Confidence: rule-based matrix is deterministic; higher for the extreme cells.
  const confidence =
    l + i >= 6 ? 0.88 : l + i >= 5 ? 0.82 : l + i >= 4 ? 0.78 : 0.7;

  return {
    score: Math.round(score * 10) / 10,
    source: "rule-based",
    confidence,
    review_status: "unreviewed",
  };
}
