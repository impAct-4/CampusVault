import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { GlassCard } from "../components/ui/GlassCard";
import { PageWrapper } from "../components/layout/PageWrapper";

export function MentorshipPage() {
  const [mentors, setMentors] = useState<unknown[]>([]);

  useEffect(() => {
    apiRequest<unknown[]>("/mentors").then(setMentors).catch(() => setMentors([]));
  }, []);

  return (
    <PageWrapper title="Mentorship" subtitle="Mentor discovery, booking, and session tracking.">
      <GlassCard>
        <p className="mb-4">Mentor profiles available: {mentors.length}</p>
        <div className="rounded border border-indigo-500/20 bg-indigo-500/10 p-4">
          <p className="font-semibold text-indigo-300 mb-1">Coming Soon: Real-time Socket.io Notifications</p>
          <p className="text-sm text-slate-300">
            The Socket.io notification system for real-time toast alerts when a mentor books/confirms a session is marked as a "Future Implementation".
          </p>
        </div>
      </GlassCard>
    </PageWrapper>
  );
}

