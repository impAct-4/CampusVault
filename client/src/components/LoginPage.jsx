import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, ShieldCheck, Target, Zap } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            const code = err?.code;
            if (code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (code === 'auth/invalid-credential') {
                setError('Invalid email or password');
            } else if (code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else if (code === 'auth/wrong-password') {
                setError('Incorrect password');
            } else if (code === 'auth/too-many-requests') {
                setError('Too many failed login attempts. Please try again later');
            } else {
                setError(err?.message || 'Failed to sign in. Please try again');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-2.5rem)]">
                <nav className="nx-topbar">
                    <h1 className="nx-logo">CAMPUSVAULT</h1>
                    <button onClick={() => navigate('/')} className="nx-pill-light">
                        Back
                    </button>
                </nav>

                <div className="mx-auto grid min-h-[74vh] max-w-6xl gap-6 px-5 pb-10 pt-10 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="nx-reveal nx-glass rounded-3xl p-6 md:p-10">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#16385f]/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#16385f]">
                            <Target size={14} /> Placement Command Center
                        </p>
                        <h2 className="nx-heading mt-5 text-[54px] md:text-[88px]">WELCOME BACK</h2>
                        <p className="max-w-xl text-base text-[#16385f]/78 md:text-lg">
                            Continue your preparation streak, review company trends, and sharpen your interview edge in one dashboard.
                        </p>
                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                <ShieldCheck size={18} className="text-[#174d86]" />
                                <p className="mt-2 text-xs font-semibold uppercase text-[#16385f]/60">Secure Auth</p>
                                <p className="text-lg font-extrabold text-[#0f2b4d]">Firebase</p>
                            </div>
                            <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                <Zap size={18} className="text-[#174d86]" />
                                <p className="mt-2 text-xs font-semibold uppercase text-[#16385f]/60">Daily Drills</p>
                                <p className="text-lg font-extrabold text-[#0f2b4d]">Adaptive</p>
                            </div>
                            <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                <ArrowRight size={18} className="text-[#174d86]" />
                                <p className="mt-2 text-xs font-semibold uppercase text-[#16385f]/60">Career Move</p>
                                <p className="text-lg font-extrabold text-[#0f2b4d]">Placement</p>
                            </div>
                        </div>
                    </section>

                    <section className="nx-reveal-delay-1 rounded-3xl border border-[#16385f]/15 bg-white/90 p-6 md:p-8">
                        <h3 className="nx-heading text-4xl">Sign In</h3>
                        <p className="mt-1 text-sm text-[#16385f]/70">Access your prep progress and opportunities.</p>

                        {error && (
                            <div className="mt-5 rounded-2xl border border-red-200 bg-white p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="nx-pill mt-2 w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? 'Signing in...' : 'Enter Dashboard'}
                            </button>

                            <div className="text-center text-sm text-[#16385f]/78">
                                Don&apos;t have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    className="font-semibold text-[#0f2b4d] hover:underline"
                                >
                                    Create one
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
