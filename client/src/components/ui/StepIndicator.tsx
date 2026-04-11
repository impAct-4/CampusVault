export function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>
          Step {step} of {total}
        </span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-700/60">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

