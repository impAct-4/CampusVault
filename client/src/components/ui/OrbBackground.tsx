export function OrbBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-24 top-6 h-80 w-80 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(99,102,241,0) 70%)",
          animation: "orbFloat 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-16 bottom-0 h-96 w-96 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.42) 0%, rgba(6,182,212,0) 70%)",
          animation: "orbFloat 18s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

