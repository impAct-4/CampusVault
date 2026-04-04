import { useNavigate } from 'react-router-dom';
import { TrendingUp, Briefcase, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import SideNav from './SideNav';
import './DashboardPage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function MarketValuePage() {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) { navigate('/'); return; }
            const token = await user.getIdToken();
            try {
                const [recsRes] = await Promise.all([
                    fetch(`${API_BASE}/dashboard/recommendations`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                if (recsRes.ok) setRecommendations((await recsRes.json()).data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="dash-shell">
            <SideNav />
            <main className="dash-main">
                <header className="dash-header">
                    <div>
                        <h1 className="dash-greeting">Market Value</h1>
                        <p className="dash-subtitle">Your market position and salary benchmarks</p>
                    </div>
                </header>

                {loading ? (
                    <div className="dash-loading"><div className="loading-ring" /></div>
                ) : (
                    <div className="dash-grid">
                        <section className="dash-panel">
                            <h2 className="panel-title"><TrendingUp size={14} /> Average Salary</h2>
                            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#4ade80' }}>₹8.5 LPA</div>
                            <p style={{ color: 'rgba(230,244,235,0.5)', fontSize: '0.85rem', marginTop: 8 }}>Based on your branch & CGPA</p>
                        </section>

                        <section className="dash-panel">
                            <h2 className="panel-title"><Briefcase size={14} /> Companies Hiring</h2>
                            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#4ade80' }}>{recommendations?.eligibleCompanies?.length || 0}</div>
                            <p style={{ color: 'rgba(230,244,235,0.5)', fontSize: '0.85rem', marginTop: 8 }}>Eligible for your CGPA</p>
                        </section>

                        <section className="dash-panel">
                            <h2 className="panel-title"><BarChart3 size={14} /> Market Demand</h2>
                            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#4ade80' }}>High</div>
                            <p style={{ color: 'rgba(230,244,235,0.5)', fontSize: '0.85rem', marginTop: 8 }}>For your skill category</p>
                        </section>

                        {recommendations?.eligibleCompanies?.length > 0 && (
                            <section className="dash-panel dash-panel--wide">
                                <h2 className="panel-title">Top Companies for You</h2>
                                <div className="company-list">
                                    {recommendations.eligibleCompanies.slice(0, 6).map(c => (
                                        <button key={c.id} className="company-row" onClick={() => navigate(`/company/${c.id}`)}>
                                            <div>
                                                <strong>{c.name}</strong>
                                                <span className="company-industry">{c.industry} · {c.location}</span>
                                            </div>
                                            <span className="company-min-gpa">≥ {c.minGpa} CGPA · {c.placements?.length || 0} openings</span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="dash-panel dash-panel--wide">
                            <h2 className="panel-title"><BarChart3 size={14} /> Skills in Demand</h2>
                            <div className="skill-chips" style={{ gap: 8 }}>
                                {['DSA', 'System Design', 'Backend Dev', 'SQL', 'Kubernetes', 'Microservices'].map(s => (
                                    <div key={s} className="skill-chip having">{s}</div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}
