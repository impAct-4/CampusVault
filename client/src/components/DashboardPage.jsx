import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Users, Briefcase, User, BookOpen, Medal, ArrowUpRight, Rocket, Target } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import CompanyMatcher from './CompanyMatcher';
import QuestionForum from './QuestionForum';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        let mounted = true;

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!mounted) return;

            if (!user) {
                setAuthToken('');
                setCurrentUserId('');
                return;
            }

            const token = await user.getIdToken();
            if (mounted) {
                setAuthToken(token);
                setCurrentUserId(user.uid);
                setUserName(user.email?.split('@')[0] || 'Student');
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    const mainFeatures = [
        {
            icon: Briefcase,
            title: 'Browse Placements',
            description: 'Explore 100+ job opportunities',
            action: () => navigate('/placements'),
            badge: 'Opportunities',
        },
        {
            icon: Users,
            title: 'Expert Mentors',
            description: 'Get guidance from industry leaders',
            action: () => navigate('/mentors'),
            badge: 'Mentorship',
        },
        {
            icon: Medal,
            title: 'Skill Assessment',
            description: 'Test your technical skills',
            action: () => navigate('/assessment'),
            badge: 'Readiness',
        },
    ];

    const sideFeatures = [
        {
            icon: User,
            title: 'My Profile',
            description: 'View and edit your profile',
            action: () => navigate('/profile'),
        },
        {
            icon: TrendingUp,
            title: 'Market Value',
            description: 'Check market trends and salaries',
            action: () => navigate('/market-value'),
        },
        {
            icon: BookOpen,
            title: 'Q&A Forum',
            description: 'Ask questions and share insights',
            action: () => window.scrollTo({ top: 1500, behavior: 'smooth' }),
        },
    ];

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-2.5rem)]">
                <nav className="nx-topbar sticky top-3 z-50 md:top-5">
                    <div>
                        <h1 className="nx-logo">CAMPUSVAULT</h1>
                        <p className="mt-1 text-xs uppercase tracking-wide text-[#16385f]/62">Placement Command Center</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </nav>

                <div className="max-w-7xl mx-auto px-5 py-10 space-y-10 md:px-8 md:py-12">
                    <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                        <div className="nx-reveal nx-glass rounded-3xl p-6 md:p-8">
                            <p className="inline-flex items-center gap-2 rounded-full border border-[#16385f]/14 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#15385f]">
                                <Rocket size={14} /> Active Preparation Window
                            </p>
                            <h2 className="nx-heading mt-4 text-[56px] md:text-[88px]">READY, {userName?.toUpperCase()}?</h2>
                            <p className="max-w-2xl text-base text-[#16385f]/76 md:text-lg">
                                This is your live placement cockpit. Prioritize interviews, close skill gaps, and move from preparation to offer conversion.
                            </p>
                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                    <p className="text-xs font-semibold uppercase text-[#16385f]/60">Weekly Focus</p>
                                    <p className="mt-2 text-lg font-extrabold text-[#0f2b4d]">Aptitude + DSA</p>
                                </div>
                                <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                    <p className="text-xs font-semibold uppercase text-[#16385f]/60">Top Signal</p>
                                    <p className="mt-2 text-lg font-extrabold text-[#0f2b4d]">Mock Interview</p>
                                </div>
                                <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                    <p className="text-xs font-semibold uppercase text-[#16385f]/60">Career Goal</p>
                                    <p className="mt-2 text-lg font-extrabold text-[#0f2b4d]">SDE Role</p>
                                </div>
                            </div>
                        </div>

                        <div className="nx-reveal-delay-1 rounded-3xl border border-[#16385f]/12 bg-white/90 p-6">
                            <h3 className="text-xl font-extrabold text-[#0f2b4d]">Preparation Pulse</h3>
                            <div className="mt-4 space-y-3">
                                <div className="rounded-2xl bg-[#edf4ff] p-4">
                                    <p className="text-xs font-semibold uppercase text-[#18447a]/65">Momentum</p>
                                    <p className="mt-1 text-2xl font-black text-[#0f2b4d]">Strong</p>
                                </div>
                                <div className="rounded-2xl bg-[#e9f8f7] p-4">
                                    <p className="text-xs font-semibold uppercase text-[#0f6f6b]/65">Interview Readiness</p>
                                    <p className="mt-1 text-2xl font-black text-[#0f2b4d]">Growing</p>
                                </div>
                                <button
                                    onClick={() => navigate('/assessment')}
                                    className="nx-pill mt-1 w-full justify-center"
                                >
                                    Run Skill Check <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="nx-heading mb-5 text-5xl">Priority Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {mainFeatures.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <button
                                        key={feature.title}
                                        onClick={feature.action}
                                        className="nx-hover-lift group relative overflow-hidden rounded-2xl border border-[#16385f]/16 bg-white/90 p-7 text-left"
                                    >
                                        <p className="inline-flex rounded-full bg-[#edf4ff] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#18447a]">
                                            {feature.badge}
                                        </p>
                                        <div className="mt-4 inline-flex rounded-xl bg-[#edf4ff] p-3 text-[#174d86]">
                                            <Icon size={26} />
                                        </div>
                                        <h4 className="mt-4 text-xl font-black text-[#0f2b4d]">{feature.title}</h4>
                                        <p className="mt-1 text-[#16385f]/72">{feature.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <h3 className="nx-heading mb-5 text-5xl">Quick Navigation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {sideFeatures.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <button
                                        key={feature.title}
                                        onClick={feature.action}
                                        className="nx-hover-lift group rounded-2xl border border-[#16385f]/16 bg-white/90 p-4 text-left"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 rounded-lg bg-[#edf4ff] p-2 text-[#174d86]">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-[#0f2b4d] mb-1">{feature.title}</h5>
                                                <p className="text-sm text-[#16385f]/70">{feature.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <div className="mb-5 flex items-center gap-2">
                            <Target size={18} className="text-[#174d86]" />
                            <h3 className="nx-heading text-5xl">Eligible Companies for You</h3>
                        </div>
                        <CompanyMatcher authToken={authToken} />
                    </section>

                    <section>
                        <div className="mb-5 flex items-center gap-2">
                            <BookOpen size={18} className="text-[#174d86]" />
                            <h3 className="nx-heading text-5xl">Community Q&A Forum</h3>
                        </div>
                        <QuestionForum authToken={authToken} currentUserId={currentUserId} />
                    </section>
                </div>
            </div>
        </div>
    );
}
