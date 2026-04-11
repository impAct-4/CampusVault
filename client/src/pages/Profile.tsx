import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/GlowButton";
import { GlowInput } from "../components/ui/GlowInput";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useAuthStore } from "../store/auth";

type CreditTxn = {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
};

export function ProfilePage() {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState(() => user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<CreditTxn[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }
    apiRequest<CreditTxn[]>("/credits/history", { authToken: token })
      .then(setHistory)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to load history."));
  }, [token]);

  const saveProfile = async () => {
    if (!token || !user) {
      setMessage("Login required.");
      return;
    }
    try {
      const updated = await apiRequest<typeof user>(`/users/${user.id}`, {
        method: "PUT",
        authToken: token,
        body: JSON.stringify({ name, phone: phone || undefined }),
      });
      setUser(updated);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update profile.");
    }
  };

  return (
    <PageWrapper title="Profile" subtitle="Edit profile, projects, certifications, and history.">
      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard className="space-y-3">
          <p className="text-slate-100">Profile Info</p>
          <GlowInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <GlowInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
          <GlowButton type="button" onClick={saveProfile}>
            Save Profile
          </GlowButton>
          {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        </GlassCard>
        <GlassCard>
          <p className="mb-3 text-slate-100">Credit History</p>
          <div className="space-y-2">
            {history.map((txn) => (
              <div key={txn.id} className="rounded-lg border border-white/10 p-2 text-sm">
                <p className={txn.amount >= 0 ? "text-emerald-200" : "text-rose-200"}>
                  {txn.amount >= 0 ? "+" : ""}
                  {txn.amount}
                </p>
                <p className="text-slate-300">{txn.reason}</p>
              </div>
            ))}
            {!history.length ? <p className="text-sm text-slate-400">No transactions yet.</p> : null}
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}

