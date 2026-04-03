import { useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Radar, Trophy, Sparkles } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    const pillars = [
        {
            title: 'Targeted Practice',
            detail: 'Company-specific interview patterns and role-focused question sets.',
            icon: Radar,
        },
        {
            title: 'Mentor Feedback',
            detail: 'Get direct review loops on resume, communication, and mock rounds.',
            icon: BriefcaseBusiness,
        },
        {
            title: 'Placement Outcomes',
            detail: 'Track your readiness with assessments mapped to hiring expectations.',
            icon: Trophy,
        },
    ];

    return (
        <div className="nx-shell text-black">
            <div className="nx-frame">
                <nav className="nx-topbar">
                    <div className="flex items-center gap-4 md:gap-8">
                        <h1 className="nx-logo">CAMPUSVAULT</h1>
                        <span className="hidden text-sm text-[#16385f]/70 md:block">Placement Intelligence</span>
                        <span className="hidden text-sm text-[#16385f]/70 md:block">Interview Systems</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button onClick={() => navigate('/login')} className="nx-pill-light">
                            Login
                        </button>
                        <button onClick={() => navigate('/register')} className="nx-pill">
                            Try Now
                        </button>
                    </div>
                </nav>

                <section className="relative px-4 pb-10 pt-8 md:px-10 md:pb-12 md:pt-10">
                    <div className="nx-grid-lines absolute inset-x-6 top-8 h-[360px] rounded-3xl opacity-40" />
                    <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div className="nx-reveal">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#173964]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#173964]">
                                <Sparkles size={14} /> Built For Campus Placements
                            </div>
                            <h2 className="nx-heading mt-5 text-[58px] leading-[0.9] md:text-[102px]">
                                CRACK
                                <span className="nx-gradient-text"> DREAM OFFERS</span>
                            </h2>
                            <p className="mt-5 max-w-xl text-base text-[#16385f]/80 md:text-xl">
                                From aptitude sprints to final HR rounds, CampusVault gives you a structured
                                prep engine to turn potential into placement results.
                            </p>
                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                <button onClick={() => navigate('/register')} className="nx-pill">
                                    Start Your Track <ArrowRight size={18} />
                                </button>
                                <button onClick={() => navigate('/login')} className="nx-pill-light">
                                    Continue Learning
                                </button>
                            </div>
                            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                                <div className="nx-glass rounded-2xl p-4">
                                    <p className="text-xs font-semibold uppercase text-[#14355d]/70">Mock Rounds</p>
                                    <p className="mt-2 text-3xl font-extrabold text-[#0f2b4d]">1,200+</p>
                                </div>
                                <div className="nx-glass rounded-2xl p-4">
                                    <p className="text-xs font-semibold uppercase text-[#14355d]/70">Hiring Firms</p>
                                    <p className="mt-2 text-3xl font-extrabold text-[#0f2b4d]">90+</p>
                                </div>
                                <div className="nx-glass rounded-2xl p-4">
                                    <p className="text-xs font-semibold uppercase text-[#14355d]/70">Success Rate</p>
                                    <p className="mt-2 text-3xl font-extrabold text-[#0f2b4d]">87%</p>
                                </div>
                            </div>
                        </div>

                        <div className="nx-reveal-delay-1">
                            <div className="nx-glass rounded-3xl p-6 md:p-8">
                                <p className="text-xs font-bold uppercase tracking-wide text-[#173964]/70">Placement Flight Plan</p>
                                <div className="mt-4 space-y-4">
                                    {pillars.map((pillar) => {
                                        const Icon = pillar.icon;
                                        return (
                                            <div key={pillar.title} className="nx-hover-lift rounded-2xl border border-[#173964]/10 bg-white/80 p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="rounded-xl bg-[#e7f0fb] p-2 text-[#174c86]">
                                                        <Icon size={18} />
                                                    </span>
                                                    <div>
                                                        <h3 className="text-lg font-extrabold text-[#0f2b4d]">{pillar.title}</h3>
                                                        <p className="mt-1 text-sm text-[#16385f]/75">{pillar.detail}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="nx-reveal-delay-2 mt-10 border-t border-[#13355f]/14 pt-5 text-center md:mt-12">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#16385f]/65">Students preparing for top recruiters</p>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm font-bold text-[#0f2b4d]/85 md:grid-cols-8">
                            <span>GOOGLE</span>
                            <span>AMAZON</span>
                            <span>MICROSOFT</span>
                            <span>ADOBE</span>
                            <span>ZOHO</span>
                            <span>JPMC</span>
                            <span>DELOITTE</span>
                            <span>TCS DIGITAL</span>
                        </div>
                    </div>
                </section>
            </div>
            <div className="mt-4 text-center text-xs text-[#16385f]/60">
                © 2026 CampusVault. All rights reserved.
            </div>
        </div>
    );
}
