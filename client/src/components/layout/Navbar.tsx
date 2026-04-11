import { Link, useNavigate } from "react-router-dom";
import { CreditChip } from "../ui/CreditChip";
import { TierBadge } from "../ui/TierBadge";
import { useAuthStore } from "../../store/auth";
import { LogOut } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/forum", label: "Forum" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/analyzer", label: "Analyzer" },
];

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold text-white">
          PlacementOS
        </Link>
        <div className="hidden items-center gap-4 text-sm md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} to={item.href} className="text-slate-300 hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <CreditChip credits={user.credits} />
              <TierBadge tier={user.tier} />
              <Link to="/profile" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:border-white/30 transition-colors">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-500/60 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:border-white/30 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300 hover:border-indigo-500/80 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

