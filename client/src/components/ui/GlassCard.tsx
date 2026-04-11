import type { PropsWithChildren } from "react";

type GlassCardProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={`glass-surface p-6 ${className ?? ""}`.trim()}>{children}</div>
  );
}

