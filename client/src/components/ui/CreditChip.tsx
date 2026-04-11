import { Coins } from "lucide-react";

export function CreditChip({ credits }: { credits: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-100">
      <Coins size={14} />
      <span>{credits} credits</span>
    </div>
  );
}

