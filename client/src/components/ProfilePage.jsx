import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Award, Calendar } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            const token = await user.getIdToken();
            setAuthToken(token);
            fetchProfile(token);
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchProfile = async (token) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/students/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data.data);
            } else {
                console.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/students/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setProfile(formData);
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
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

    if (loading) {
        return (
            <div className="nx-shell">
                <div className="nx-frame min-h-screen flex items-center justify-center">
                    <p className="text-black/60">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="nx-shell">
                <div className="nx-frame min-h-screen flex items-center justify-center">
                    <p className="text-black/60">No profile data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)]">
                <nav className="nx-topbar sticky top-3 z-50 md:top-5">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 font-medium text-black transition hover:text-gray-700"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handleLogout}
                        className="font-medium text-red-700 transition hover:text-red-600"
                    >
                        Logout
                    </button>
                </nav>

                <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-black/15 bg-white/90 p-8">
                                <div className="mb-8 flex items-center justify-between">
                                    <h1 className="nx-heading text-5xl">My Profile</h1>
                                    <button
                                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                                        className="nx-pill px-5 py-2"
                                    >
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-black/70">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className="w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black disabled:opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-black/70">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className="w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-black/15 bg-white p-6">
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-black">
                                            <Mail size={20} /> Contact Information
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-black/70">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email || ''}
                                                    readOnly
                                                    className="w-full cursor-not-allowed rounded-2xl border border-black/15 bg-gray-50 px-4 py-3 text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-black/70">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone || ''}
                                                    readOnly
                                                    className="w-full cursor-not-allowed rounded-2xl border border-black/15 bg-gray-50 px-4 py-3 text-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-black/15 bg-white p-6">
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-black">
                                            <Award size={20} /> Education
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-black/70">College</label>
                                                <input
                                                    type="text"
                                                    value={formData.college || ''}
                                                    readOnly
                                                    className="w-full cursor-not-allowed rounded-2xl border border-black/15 bg-gray-50 px-4 py-3 text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-black/70">Branch</label>
                                                <input
                                                    type="text"
                                                    value={formData.branch || ''}
                                                    readOnly
                                                    className="w-full cursor-not-allowed rounded-2xl border border-black/15 bg-gray-50 px-4 py-3 text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-black/70">CGPA</label>
                                                <input
                                                    type="number"
                                                    value={formData.cgpa || ''}
                                                    readOnly
                                                    className="w-full cursor-not-allowed rounded-2xl border border-black/15 bg-gray-50 px-4 py-3 text-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-black/70">Bio / About</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio || ''}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-black outline-none transition placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl border border-black/15 bg-white p-6">
                                <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-black/70">Skill Level</h3>
                                <p className="text-2xl font-bold text-black">{profile?.skillCategory || 'Beginner'}</p>
                                <p className="mt-2 text-xs text-black/60">Complete the assessment to level up</p>
                            </div>

                            <div className="rounded-2xl border border-black/15 bg-white p-6">
                                <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-black/70">Credits Balance</h3>
                                <p className="text-3xl font-bold text-black">{profile?.creditBalance || 0}</p>
                                <p className="mt-2 text-xs text-black/60">Use credits to unlock answers</p>
                            </div>

                            <div className="rounded-2xl border border-black/15 bg-white p-6">
                                <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-black/70">Member Since</h3>
                                <p className="flex items-center gap-2 text-black">
                                    <Calendar size={16} />
                                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-black/15 bg-white p-6">
                                <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-black/70">Assessment</h3>
                                <button
                                    onClick={() => navigate('/assessment')}
                                    className="w-full rounded-lg bg-black py-2 font-medium text-white transition hover:bg-gray-800"
                                >
                                    {profile?.hasCompletedAssessment ? 'Retake Assessment' : 'Start Assessment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
