import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Calendar, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function PlacementsPage() {
    const navigate = useNavigate();
    const [placements, setPlacements] = useState([]);
    const [applications, setApplications] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState('');
    const [applyingId, setApplyingId] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            const token = await user.getIdToken();
            setAuthToken(token);
            fetchPlacements(token);
            fetchApplications(token);
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchPlacements = async (token) => {
        try {
            const response = await fetch(`${API_BASE}/placements`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setPlacements(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching placements:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (token) => {
        try {
            const response = await fetch(`${API_BASE}/placements/student/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                const appliedIds = new Set(data.data.map((app) => app.placementId));
                setApplications(appliedIds);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleApply = async (placementId) => {
        try {
            setApplyingId(placementId);
            const response = await fetch(`${API_BASE}/placements/apply/${placementId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (response.ok) {
                setApplications((prev) => new Set([...prev, placementId]));
                alert('Applied successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to apply');
            }
        } catch (error) {
            console.error('Error applying:', error);
        } finally {
            setApplyingId(null);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)]">
            {/* Header */}
            <nav className="nx-topbar sticky top-3 z-50 md:top-5">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-black hover:text-gray-700 font-medium">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-black">Active Placements</h1>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-700 hover:text-red-600 font-medium">
                    <LogOut size={20} />
                    Logout
                </button>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-5 py-12 md:px-8">
                {loading ? (
                    <div className="text-center text-gray-700">Loading placements...</div>
                ) : placements.length === 0 ? (
                    <div className="text-center text-gray-700">No placements available</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {placements.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white border border-gray-300 rounded-lg p-6 hover:border-black transition"
                            >
                                {/* Company & Position */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">{p.company?.name}</p>
                                        <h3 className="text-xl font-bold text-black">{p.position}</h3>
                                    </div>
                                    {applications.has(p.id) && (
                                        <span className="px-3 py-1 bg-green-100 border border-green-300 text-green-700 rounded-full text-xs font-medium">
                                            Applied
                                        </span>
                                    )}
                                </div>

                                {/* Details Grid */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <DollarSign size={18} className="text-black" />
                                        <span>
                                            ₹{(p.ctc || p.salary).toLocaleString()} CTC
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin size={18} className="text-black" />
                                        <span>{p.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar size={18} className="text-black" />
                                        <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                {p.description && (
                                    <p className="text-gray-600 text-sm mb-4">{p.description}</p>
                                )}

                                {/* Apply Button */}
                                <button
                                    onClick={() => handleApply(p.id)}
                                    disabled={applications.has(p.id) || applyingId === p.id}
                                    className={`w-full py-2 rounded-lg font-medium transition ${
                                        applications.has(p.id)
                                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {applyingId === p.id
                                        ? 'Applying...'
                                        : applications.has(p.id)
                                        ? 'Already Applied'
                                        : 'Apply Now'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}
