import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, BadgeCheck, Building2, FileText, GraduationCap } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        college: '',
        branch: '',
        cgpa: '',
        password: '',
        confirmPassword: '',
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
        if (formData.password !== formData.confirmPassword) {
            setError('Password and confirm password must match');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const token = await userCredential.user.getIdToken();

            const profileResponse = await fetch(`${API_BASE}/students/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    college: formData.college,
                    branch: formData.branch,
                    cgpa: formData.cgpa,
                }),
            });

            if (!profileResponse.ok) {
                const errorData = await profileResponse.json();
                throw new Error(errorData.error || 'Failed to create student profile');
            }

            navigate('/dashboard');
        } catch (err) {
            const code = err?.code;
            if (code === 'auth/email-already-in-use') {
                setError('This email is already in use');
            } else if (code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (code === 'auth/weak-password') {
                setError('Password should be at least 6 characters');
            } else {
                setError(err?.message || 'Failed to create account');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="nx-shell">
            <div className="nx-frame min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)]">
                <nav className="nx-topbar">
                    <h1 className="nx-logo">CAMPUSVAULT</h1>
                    <button onClick={() => navigate('/')} className="nx-pill-light">
                        Back
                    </button>
                </nav>

                <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:px-8 md:py-12 lg:grid-cols-[0.85fr_1.15fr]">
                    <section className="nx-reveal nx-glass rounded-3xl p-6 md:p-8">
                        <h2 className="nx-heading text-[64px] md:text-[80px]">JOIN THE
                            <span className="nx-gradient-text"> BATCH</span>
                        </h2>
                        <p className="mt-2 text-sm text-[#16385f]/78 md:text-base">
                            Build your placement profile once, then unlock company matching, skill tracks, and community Q&A.
                        </p>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                <div className="flex items-center gap-3">
                                    <GraduationCap size={18} className="text-[#174d86]" />
                                    <p className="text-sm font-semibold text-[#0f2b4d]">Academic profile mapping</p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                <div className="flex items-center gap-3">
                                    <Building2 size={18} className="text-[#174d86]" />
                                    <p className="text-sm font-semibold text-[#0f2b4d]">Eligible company discovery</p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-[#174d86]" />
                                    <p className="text-sm font-semibold text-[#0f2b4d]">Interview preparation feed</p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[#16385f]/12 bg-white/80 p-4">
                                <div className="flex items-center gap-3">
                                    <BadgeCheck size={18} className="text-[#174d86]" />
                                    <p className="text-sm font-semibold text-[#0f2b4d]">Skill assessment and credibility score</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="nx-reveal-delay-1 rounded-3xl border border-[#16385f]/15 bg-white/92 p-6 md:p-8">
                        <div className="mb-6">
                            <h3 className="nx-heading text-5xl">Create Account</h3>
                            <p className="text-[#16385f]/70">Set up your student profile to begin your placement journey.</p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-2xl border border-red-200 bg-white p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

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
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                placeholder="+91 9876543210"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">College Name</label>
                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                    placeholder="Your College"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">Branch/Department</label>
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                >
                                    <option value="">Select Branch</option>
                                    <option value="CSE">Computer Science</option>
                                    <option value="ECE">Electronics & Communication</option>
                                    <option value="ME">Mechanical Engineering</option>
                                    <option value="CE">Civil Engineering</option>
                                    <option value="EE">Electrical Engineering</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">CGPA (Current)</label>
                            <input
                                type="number"
                                name="cgpa"
                                value={formData.cgpa}
                                onChange={handleChange}
                                required
                                min="0"
                                max="10"
                                step="0.01"
                                disabled={isLoading}
                                className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                placeholder="7.5"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0f2b4d]">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-2xl border border-[#16385f]/20 bg-white px-4 py-3 text-[#0f2b4d] placeholder-[#16385f]/45 transition focus:border-[#174d86] focus:outline-none focus:ring-2 focus:ring-[#174d86] disabled:opacity-50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="nx-pill mt-6 w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? 'Creating account...' : (
                                <span className="inline-flex items-center gap-2">Create Account <ArrowRight size={16} /></span>
                            )}
                        </button>

                        <div className="text-center text-sm text-[#16385f]/78">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-semibold text-[#0f2b4d] hover:underline"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
