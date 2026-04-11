import type { InputHTMLAttributes } from "react";

export function GlowInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`glow-ring w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 ${props.className ?? ""}`.trim()}
    />
  );
}

