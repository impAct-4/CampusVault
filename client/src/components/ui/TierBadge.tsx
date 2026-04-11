import type { Tier } from "../../store/auth";

const tierStyle: Record<Tier, string> = {
  BEGINNER: "bg-rose-500/20 text-rose-200 border-rose-400/30",
  INTERMEDIATE: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  ADVANCED: "bg-indigo-500/20 text-indigo-100 border-indigo-400/40",
  PLACEMENT_READY: "bg-emerald-500/20 text-emerald-100 border-emerald-400/40",
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${tierStyle[tier]}`}>{tier}</span>
  );
}

