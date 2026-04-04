import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Leaf, Shield, Users, Briefcase, TrendingUp, X } from 'lucide-react';
import landingScrollVideo from '../assets/campusvault-landing-forest-scroll.mp4';
import './LandingPage.css';
import './AuthPages.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function LandingPage() {
    const navigate = useNavigate();
    const videoRef = useRef(null);

    // Modal Auth State
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [role, setRole]         = useState('student');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        try {
            if (authMode === 'login') {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                navigate('/dashboard');
            } else {
                // Register: create Firebase user, then create student profile in DB
                const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const token = await credential.user.getIdToken();

                // Create student profile (basic fields — user can fill rest in profile page)
                await fetch(`${API}/students/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        firstName: formData.name.split(' ')[0] || formData.name,
                        lastName: formData.name.split(' ').slice(1).join(' ') || '-',
                        email: formData.email,
                        phone: '0000000000', // placeholder — editable in profile
                        college: 'Not set',
                        branch: 'Not set',
                        cgpa: 0,
                    }),
                });

                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.code === 'auth/wrong-password' ? 'Incorrect password.' :
                        err.code === 'auth/user-not-found' ? 'No account with that email.' :
                        err.code === 'auth/email-already-in-use' ? 'Email already registered.' :
                        err.code === 'auth/weak-password' ? 'Password must be 6+ characters.' :
                        'Authentication failed. Please try again.';
            setAuthError(msg);
        } finally {
            setAuthLoading(false);
        }
    };

    const openLogin = ()    => { setAuthMode('login');    setAuthError(''); setShowAuthModal(true); };
    const openRegister = () => { setAuthMode('register'); setAuthError(''); setShowAuthModal(true); };

    return (
        <div className="landing-root">
            <header className="landing-top-nav">
                <button type="button" className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Leaf size={24} className="brand-icon" />
                    <span>CampusVault</span>
                </button>
                <div className="landing-nav-links">
                    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>HOME</button>
                    <button type="button" onClick={scrollToFeatures}>FEATURES</button>
                    <button type="button" onClick={openLogin}>LOGIN</button>
                </div>
            </header>

            {/* Global Fixed Background Video — autoPlay loop, no JS scrubbing → zero lag */}
            <div className="global-fixed-bg">
                <video
                    ref={videoRef}
                    className="landing-video"
                    src={landingScrollVideo}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Forest background"
                />
            </div>

            <section className="landing-hero-section">
                {/* Layer 2: Mask Layer */}
                <div className="landing-mask-layer" aria-hidden="true">
                    <div className="hero-content-wrapper">
                        <p className="hero-kicker text-invisible">AMAZING JOURNEYS</p>
                        <h1>
                            <span className="text-invisible">CAMPUS</span><br />
                            <span className="text-mask">VAULT</span>
                        </h1>
                        <p className="hero-description text-invisible">
                            Every student starts somewhere. CampusVault turns scattered notes into one guided path.
                        </p>
                        <button type="button" className="hero-btn text-invisible" tabIndex={-1}>LEARN MORE</button>
                    </div>
                </div>

                {/* Layer 3: Solid Elements */}
                <div className="landing-solid-layer">
                    <div className="hero-content-wrapper">
                        <p className="hero-kicker">AMAZING JOURNEYS</p>
                        <h1>
                            <span className="text-solid">CAMPUS</span><br />
                            <span className="text-invisible">VAULT</span>
                        </h1>
                        <p className="hero-description">
                            Every student starts somewhere. CampusVault turns scattered notes into one guided path. Grow your skills, connect with mentors, and secure your future.
                        </p>
                        <button type="button" className="hero-btn" onClick={openRegister}>
                            GET STARTED
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="landing-features">
                <div className="features-container">
                    <h2 className="section-title">Grow Your Potential</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <Shield className="feature-icon" />
                            <h3>Secure Vault</h3>
                            <p>All your academic resources securely stored and instantly retrievable.</p>
                        </div>
                        <div className="feature-card">
                            <Users className="feature-icon" />
                            <h3>Mentorship</h3>
                            <p>Connect with industry leaders who guide your learning trajectory.</p>
                        </div>
                        <div className="feature-card">
                            <Briefcase className="feature-icon" />
                            <h3>Placements</h3>
                            <p>Track job applications, interviews, and company requirements in one place.</p>
                        </div>
                        <div className="feature-card">
                            <TrendingUp className="feature-icon" />
                            <h3>Market Value</h3>
                            <p>Understand your worth and analyze the skills companies demand today.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Leaf size={20} className="brand-icon" />
                        <span>CampusVault</span>
                    </div>
                    <div className="footer-copy">&copy; 2026 CampusVault. Grow your future.</div>
                    <div className="footer-links">
                        <button type="button">Privacy</button>
                        <button type="button">Terms</button>
                        <button type="button">Contact</button>
                    </div>
                </div>
            </footer>

            {/* ── AUTH POPUP MODAL ───────────────────────────── */}
            {showAuthModal && (
                <div className="landing-auth-overlay">
                    <button className="auth-close-btn" onClick={() => setShowAuthModal(false)} aria-label="Close">
                        <X size={24} />
                    </button>
                    <div className="auth-container">
                        <main className="auth-glass-box fade-up">
                            <h2 className="auth-title">
                                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h2>

                            {/* Role tabs */}
                            <div className="auth-role-toggles">
                                <button type="button" className={`role-tab ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>Student</button>
                                <button type="button" className={`role-tab ${role === 'mentor'  ? 'active' : ''}`} onClick={() => setRole('mentor')}>Mentor</button>
                            </div>

                            <form className="auth-form" onSubmit={handleAuthSubmit}>
                                {authMode === 'register' && (
                                    <div className="auth-field-group">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="auth-input"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="auth-field-group">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="auth-input"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="auth-field-group">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="auth-input"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                {authError && <p className="auth-error">{authError}</p>}

                                {authMode === 'login' && (
                                    <div className="auth-forgot">
                                        <button type="button">Forgot Password?</button>
                                    </div>
                                )}

                                <button type="submit" className="auth-submit-btn" disabled={authLoading}>
                                    {authLoading ? 'Please wait…' : authMode === 'login' ? 'Login' : 'Register'}
                                </button>

                                <div className="auth-register-link">
                                    {authMode === 'login' ? (
                                        <button type="button" className="auth-toggle-btn" onClick={() => setAuthMode('register')}>
                                            Create New Account
                                        </button>
                                    ) : (
                                        <button type="button" className="auth-toggle-btn" onClick={() => setAuthMode('login')}>
                                            Already have an account?
                                        </button>
                                    )}
                                </div>
                            </form>
                        </main>
                    </div>
                </div>
            )}
        </div>
    );
}
