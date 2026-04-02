import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Vault, Calculator, Briefcase, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Interview Vault', icon: Vault, path: '/vault' },
    { label: 'Skill Calculator', icon: Calculator, path: '/calculator' },
    { label: 'Workspace', icon: Briefcase, path: '/workspace' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfilePopup(false);
  };

  const profileMenuItems = [
    { label: 'View Profile', icon: User, action: () => { navigate('/profile'); setShowProfilePopup(false); } },
    { label: 'Settings', icon: Settings, action: () => { setShowProfilePopup(false); } },
    { label: 'Logout', icon: LogOut, action: handleLogout, isDestructive: true },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-black/90 backdrop-blur-md border-r border-purple-500/20 flex flex-col z-40">
      {/* Logo Section */}
      <div className="sticky top-0 p-6 border-b border-purple-500/20 bg-black/95">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CampusVault
          </span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'text-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/50'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-purple-500/5'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section - Sticky Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-500/20 bg-black/95">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity relative"
          onClick={() => setShowProfilePopup(!showProfilePopup)}
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">{user?.name?.[0] || 'U'}</span>
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@email.com'}</p>
          </div>

          {/* Profile Popup */}
          <AnimatePresence>
            {showProfilePopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full right-0 mb-3 w-48 bg-black/95 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-lg shadow-purple-500/20 z-50"
              >
                {profileMenuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={item.action}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                        item.isDestructive
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-gray-300 hover:bg-purple-500/10 hover:text-purple-300'
                      } ${i !== profileMenuItems.length - 1 ? 'border-b border-purple-500/10' : ''}`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
