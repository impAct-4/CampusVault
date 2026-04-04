import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
    LayoutDashboard, Briefcase, Users, Medal,
    TrendingUp, User, LogOut, Leaf
} from 'lucide-react';
import './SideNav.css';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase,        label: 'Placements',  path: '/placements' },
    { icon: Users,            label: 'Mentors',     path: '/mentors' },
    { icon: Medal,            label: 'Assessment',  path: '/assessment' },
    { icon: TrendingUp,       label: 'Market',      path: '/market-value' },
    { icon: User,             label: 'Profile',     path: '/profile' },
];

export default function SideNav() {
    const navigate  = useNavigate();
    const location  = useLocation();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <nav className="side-nav" aria-label="Main navigation">
            {/* Brand pill */}
            <div className="side-nav-brand">
                <Leaf size={18} className="side-nav-leaf" />
            </div>

            {/* Nav items */}
            <div className="side-nav-items">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const active = location.pathname === path;
                    return (
                        <button
                            key={path}
                            type="button"
                            className={`side-nav-item ${active ? 'active' : ''}`}
                            onClick={() => navigate(path)}
                            title={label}
                        >
                            <span className="side-nav-icon"><Icon size={20} /></span>
                            <span className="side-nav-label">{label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Logout at bottom */}
            <button
                type="button"
                className="side-nav-item side-nav-logout"
                onClick={handleLogout}
                title="Logout"
            >
                <span className="side-nav-icon"><LogOut size={20} /></span>
                <span className="side-nav-label">Logout</span>
            </button>
        </nav>
    );
}
