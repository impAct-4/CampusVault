import type { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import ParticleBackground from "../ui/ParticleBackground";

type PageWrapperProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
        <h1 className="text-4xl font-semibold text-slate-50">{title}</h1>
        {subtitle ? <p className="mt-2 text-slate-300">{subtitle}</p> : null}
        <section className="mt-8">{children}</section>
      </main>
    </div>
  );
}

