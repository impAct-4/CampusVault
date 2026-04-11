import type { ButtonHTMLAttributes } from "react";

export function GlowButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`glow-ring rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-5 py-2.5 font-medium text-white transition hover:-translate-y-0.5 hover:bg-indigo-500/30 ${props.className ?? ""}`.trim()}
    />
  );
}

