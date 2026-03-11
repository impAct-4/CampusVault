import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show navbar on landing page
  if (location.pathname !== '/') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinkStyles =
    'text-gray-300 hover:text-purple-400 transition-colors duration-200 whitespace-nowrap';
  const activeLinkStyles = 'text-purple-400 border-b-2 border-purple-400';

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="font-bold text-2xl">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CampusVault
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isAuthenticated ? (
            <>
              <Link to="/" className={navLinkStyles}>
                Features
              </Link>
              <Link to="/" className={navLinkStyles}>
                Platforms
              </Link>
              <Link to="/login" className={navLinkStyles}>
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={navLinkStyles}>
                Dashboard
              </Link>
              <Link to="/vault" className={navLinkStyles}>
                Vault
              </Link>
              <Link to="/calculator" className={navLinkStyles}>
                Calculator
              </Link>
              <Link to="/workspace" className={navLinkStyles}>
                Workspace
              </Link>
              <Link to="/profile" className={navLinkStyles}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-semibold bg-red-600/80 hover:bg-red-600 transition-all duration-300 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-purple-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-purple-500/20 px-6 py-4 flex flex-col gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Platforms
              </Link>
              <Link
                to="/login"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/vault"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Vault
              </Link>
              <Link
                to="/calculator"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Calculator
              </Link>
              <Link
                to="/workspace"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Workspace
              </Link>
              <Link
                to="/profile"
                className={navLinkStyles}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-lg font-semibold bg-red-600/80 hover:bg-red-600 transition-all duration-300 text-white text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
