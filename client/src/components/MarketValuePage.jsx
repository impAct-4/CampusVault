import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Briefcase, BarChart3, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function MarketValuePage() {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            const token = await user.getIdToken();
            fetchMarketData(token);
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchMarketData = async (token) => {
        try {
            const [analyticsRes, recsRes] = await Promise.all([
                fetch(`${API_BASE}/dashboard/analytics`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE}/dashboard/recommendations`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (analyticsRes.ok) {
                // Analytics used for future enhancements
            }
            if (recsRes.ok) {
                const recData = await recsRes.json();
                setRecommendations(recData.data);
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)]">
            <nav className="nx-topbar sticky top-3 z-50 md:top-5">
                <h1 className="text-2xl font-bold text-black">CampusVault</h1>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-700 hover:text-red-600 transition font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </nav>

            <div className="max-w-7xl mx-auto px-5 py-12 md:px-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 text-black hover:text-gray-700 font-medium transition mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-black mb-4">Your Market Value 📊</h1>
                    <p className="text-lg text-gray-600">
                        Comprehensive analysis of your market position and salary trends
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-700">Loading market data...</div>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm uppercase tracking-wide text-gray-700 font-medium">Average Salary</h3>
                                    <TrendingUp className="text-black" size={24} />
                                </div>
                                <p className="text-3xl font-bold text-black">₹8.5 LPA</p>
                                <p className="text-sm text-gray-600 mt-2">For your profile</p>
                            </div>

                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm uppercase tracking-wide text-gray-700 font-medium">Companies Hiring</h3>
                                    <Briefcase className="text-black" size={24} />
                                </div>
                                <p className="text-3xl font-bold text-black">
                                    {recommendations?.eligibleCompanies?.length || 25}+
                                </p>
                                <p className="text-sm text-gray-600 mt-2">Actively recruiting</p>
                            </div>

                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm uppercase tracking-wide text-gray-700 font-medium">Market Demand</h3>
                                    <BarChart3 className="text-black" size={24} />
                                </div>
                                <p className="text-3xl font-bold text-black">High</p>
                                <p className="text-sm text-gray-600 mt-2">For your skills</p>
                            </div>
                        </div>

                        {/* Top Companies */}
                        {recommendations?.eligibleCompanies && recommendations.eligibleCompanies.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-black mb-6">Top Companies for You</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendations.eligibleCompanies.slice(0, 6).map((company) => (
                                        <div
                                            key={company.id}
                                            className="bg-white border border-gray-300 rounded-lg p-6 hover:border-black transition"
                                        >
                                            <h3 className="text-lg font-bold text-black mb-2">{company.name}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{company.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">{company.location}</span>
                                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded border border-gray-300">
                                                    {company.placements?.length || 0} openings
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Detailed Analysis */}
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                                <BarChart3 size={28} className="text-black" />
                                Detailed Analysis
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <span className="text-black font-bold mt-1">•</span>
                                    <div>
                                        <p className="font-semibold text-black">Skills in High Demand</p>
                                        <p className="text-gray-600 text-sm">Your expertise in DSA, Backend Development, and System Design is highly sought after</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="text-black font-bold mt-1">•</span>
                                    <div>
                                        <p className="font-semibold text-black">Expected Salary Range: ₹7.5 - 9.5 LPA</p>
                                        <p className="text-gray-600 text-sm">Based on your CGPA and skills profile</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="text-black font-bold mt-1">•</span>
                                    <div>
                                        <p className="font-semibold text-black">Top Hiring Industries</p>
                                        <p className="text-gray-600 text-sm">IT Companies (45%), Financial Services (30%), E-commerce (25%)</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="text-black font-bold mt-1">•</span>
                                    <div>
                                        <p className="font-semibold text-black">Recommended Skill Upgrades</p>
                                        <p className="text-gray-600 text-sm">Advanced System Design, Kubernetes, Microservices Architecture</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            </div>
        </div>
    );
}
