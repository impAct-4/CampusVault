import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { auth } from '../config/firebase';
import { TrendingUp, Briefcase, Medal, ChevronRight, Building2, BookOpen, Leaf } from 'lucide-react';
import SideNav from './SideNav';
import StreakCalendar from './StreakCalendar';
import landingScrollVideo from '../assets/campusvault-landing-forest-scroll.mp4';
import './DashboardPage.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState('');
    const [analytics, setAnalytics]   = useState(null);
    const [stats, setStats]            = useState(null);
    const [streak, setStreak]          = useState({ activities: [], currentStreak: 0, totalActiveDays: 0 });
    const [recommendations, setRecs]   = useState(null);
    const [loading, setLoading]        = useState(true);

    // ── Auth & initial fetch ──────────────────────────────────
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) return;
            const token = await user.getIdToken();
            setAuthToken(token);
        });
        return () => unsubscribe();
    }, []);

    const fetchAll = useCallback(async (token) => {
        if (!token) return;
        try {
            // Ping streak (log today)
            await fetch(`${API}/dashboard/streak/ping`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            const [analyticsRes, statsRes, streakRes, recsRes] = await Promise.all([
                fetch(`${API}/dashboard/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/dashboard/statistics`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/dashboard/streak`,     { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/dashboard/recommendations`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (analyticsRes.ok) setAnalytics((await analyticsRes.json()).data);
            if (statsRes.ok)     setStats((await statsRes.json()).data);
            if (streakRes.ok)    setStreak((await streakRes.json()).data);
            if (recsRes.ok)      setRecs((await recsRes.json()).data);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authToken) fetchAll(authToken);
    }, [authToken, fetchAll]);

    const student  = analytics?.student;
    const skills   = analytics?.skills || [];
    const enrolled = analytics?.enrollments || [];

    const havingSkills  = skills.filter(s => s.status === 'having');
    const lackingSkills = skills.filter(s => s.status === 'lacking');

    if (loading) {
        return (
            <div className="dash-shell">
                <SideNav />
                <main className="dash-main">
                    <div className="dash-loading">
                        <div className="loading-ring" />
                        <p>Loading your dashboard…</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dash-shell">
            <div className="dash-fixed-bg">
                <video
                    className="dash-bg-video"
                    src={landingScrollVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Forest background"
                />
            </div>
            <div className="dash-bg-overlay" />
            <SideNav />

            <main className="dash-main">
                <div className="dash-topbar">
                    <div className="dash-brand">
                        <Leaf size={18} />
                        <span>CAMPUSVAULT</span>
                    </div>
                    <div className="dash-topbar-tag">Student Command Center</div>
                </div>

                {/* ── Header ──────────────────────────────── */}
                <header className="dash-header">
                    <div>
                        <h1 className="dash-greeting">
                            Hey, {student?.firstName || 'Student'} 👋
                        </h1>
                        <p className="dash-subtitle">
                            {student?.college} • {student?.branch} • CGPA {student?.cgpa?.toFixed(2)}
                        </p>
                    </div>
                    <div className="dash-skill-badge">
                        {analytics?.statistics?.skillCategory || 'Beginner'}
                    </div>
                </header>

                {/* ── Grid layout ─────────────────────────── */}
                <div className="dash-grid">

                    {/* ── Activity Streak ───────────────────── */}
                    <section className="dash-panel dash-panel--wide">
                        <h2 className="panel-title">Activity Streak</h2>
                        <StreakCalendar
                            activities={streak.activities}
                            currentStreak={streak.currentStreak}
                            totalActiveDays={streak.totalActiveDays}
                        />
                    </section>

                    {/* ── Placement Stats ─────────────────── */}
                    <section className="dash-panel">
                        <h2 className="panel-title">Applications</h2>
                        <div className="stat-grid">
                            {stats && Object.entries(stats.statusBreakdown).map(([key, val]) => (
                                <div key={key} className="stat-box">
                                    <span className="stat-val">{val}</span>
                                    <span className="stat-key">{key}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="panel-cta"
                            onClick={() => navigate('/placements')}
                        >
                            Browse Placements <ChevronRight size={14} />
                        </button>
                    </section>

                    {/* ── Skills ──────────────────────────── */}
                    <section className="dash-panel">
                        <h2 className="panel-title">Skills</h2>
                        {skills.length === 0 ? (
                            <div className="empty-state">
                                <Medal size={28} />
                                <p>Take the assessment to map your skills</p>
                                <button className="panel-cta" onClick={() => navigate('/assessment')}>
                                    Run Assessment <ChevronRight size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="skills-section">
                                    <span className="skill-section-label having">✓ Having</span>
                                    <div className="skill-chips">
                                        {havingSkills.map(s => (
                                            <div key={s.skillName} className="skill-chip having">
                                                <span>{s.skillName}</span>
                                                <span className="skill-level">{s.level}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="skills-section" style={{ marginTop: 12 }}>
                                    <span className="skill-section-label lacking">✗ Lacking</span>
                                    <div className="skill-chips">
                                        {lackingSkills.map(s => (
                                            <div key={s.skillName} className="skill-chip lacking">
                                                <span>{s.skillName}</span>
                                                <span className="skill-level">{s.level}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </section>

                    {/* ── Target Companies ────────────────── */}
                    <section className="dash-panel">
                        <h2 className="panel-title">
                            <Building2 size={16} /> Eligible Companies
                        </h2>
                        {recommendations?.eligibleCompanies?.length > 0 ? (
                            <div className="company-list">
                                {recommendations.eligibleCompanies.map(c => (
                                    <button
                                        key={c.id}
                                        className="company-row"
                                        onClick={() => navigate(`/company/${c.id}`)}
                                    >
                                        <div>
                                            <strong>{c.name}</strong>
                                            <span className="company-industry">{c.industry}</span>
                                        </div>
                                        <span className="company-min-gpa">≥ {c.minGpa} CGPA</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Briefcase size={28} />
                                <p>No companies data yet</p>
                            </div>
                        )}
                    </section>

                    {/* ── Courses Enrolled ────────────────── */}
                    <section className="dash-panel">
                        <h2 className="panel-title">
                            <BookOpen size={16} /> Courses Enrolled
                        </h2>
                        {enrolled.length === 0 ? (
                            <div className="empty-state">
                                <BookOpen size={28} />
                                <p>No courses yet — coming soon!</p>
                            </div>
                        ) : (
                            <div className="course-list">
                                {enrolled.map(e => (
                                    <div key={e.id} className="course-row">
                                        <div>
                                            <strong>{e.course.title}</strong>
                                            <span className="course-cat">{e.course.category}</span>
                                        </div>
                                        <div className="course-progress-bar">
                                            <div
                                                className="course-progress-fill"
                                                style={{ width: `${e.progress}%` }}
                                            />
                                        </div>
                                        <span className="course-pct">{e.progress}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── Quick Actions ───────────────────── */}
                    <section className="dash-panel dash-panel--accent">
                        <h2 className="panel-title">Quick Actions</h2>
                        <div className="quick-actions">
                            <button className="qa-btn" onClick={() => navigate('/assessment')}>
                                <Medal size={20} />
                                <span>Run Assessment</span>
                            </button>
                            <button className="qa-btn" onClick={() => navigate('/mentors')}>
                                <TrendingUp size={20} />
                                <span>Find Mentor</span>
                            </button>
                            <button className="qa-btn" onClick={() => navigate('/market-value')}>
                                <TrendingUp size={20} />
                                <span>Market Value</span>
                            </button>
                            <button className="qa-btn" onClick={() => navigate('/profile')}>
                                <TrendingUp size={20} />
                                <span>My Profile</span>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
