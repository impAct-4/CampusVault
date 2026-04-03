import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function MentorshipPage() {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) navigate('/login');
            else fetchMentors();
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchMentors = async () => {
        try {
            const response = await fetch(`${API_BASE}/mentors`);
            if (response.ok) {
                const data = await response.json();
                setMentors(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSession = (mentor) => {
        alert(`Booking session with ${mentor.firstName}. Feature coming soon!`);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)]">
            {/* Header */}
            <nav className="nx-topbar sticky top-3 z-50 md:top-5">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-black font-medium">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-black">Expert Mentors</h1>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-700 font-medium">
                    <LogOut size={20} />
                    Logout
                </button>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-5 py-12 md:px-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-black mb-2">Learn from Industry Experts</h2>
                    <p className="text-gray-600">Get personalized guidance from experienced professionals</p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-700">Loading mentors...</div>
                ) : mentors.length === 0 ? (
                    <div className="text-center text-gray-700">No mentors available</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map((mentor) => (
                            <div
                                key={mentor.id}
                                className="bg-white border border-gray-300 rounded-lg p-6 hover:border-black transition group"
                            >
                                {/* Verified Badge */}
                                {mentor.isVerified && (
                                    <div className="flex justify-end mb-2">
                                        <span className="px-3 py-1 bg-green-100 border border-green-300 text-green-700 text-xs rounded-full font-medium">
                                            ✓ Verified
                                        </span>
                                    </div>
                                )}

                                {/* Mentor Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-black mb-1">
                                        {mentor.firstName} {mentor.lastName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                                        <Briefcase size={16} className="text-black" />
                                        <span>{mentor.designation}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium">{mentor.company}</p>
                                </div>

                                {/* Bio */}
                                {mentor.bio && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mentor.bio}</p>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-t border-b border-gray-300">
                                    <div>
                                        <div className="text-lg font-bold text-black">{mentor.experience}+</div>
                                        <div className="text-xs text-gray-600">Years Experience</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-black">₹{mentor.hourlyRate}/hr</div>
                                        <div className="text-xs text-gray-600">Hourly Rate</div>
                                    </div>
                                </div>

                                {/* Expertise */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-2">Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                        {mentor.expertise?.slice(0, 3).map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-gray-100 border border-gray-300 text-gray-800 text-xs rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {mentor.expertise?.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-medium">
                                                +{mentor.expertise.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Book Button */}
                                <button
                                    onClick={() => handleBookSession(mentor)}
                                    className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                                >
                                    Book Session
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
