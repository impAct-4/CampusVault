import { useNavigate } from 'react-router-dom';
import { LogOut, User, TrendingUp, Users, Briefcase } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const quickLinks = [
    {
      icon: TrendingUp,
      title: 'Market Value',
      description: 'View your market value and salary insights',
      action: () => navigate('/market-value')
    },
    {
      icon: Users,
      title: 'Mentorship',
      description: 'Connect with experienced mentors',
      action: () => navigate('#')
    },
    {
      icon: Briefcase,
      title: 'Companies',
      description: 'Explore placement opportunities',
      action: () => navigate('#')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            CampusVault
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Explore opportunities and track your placement journey
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <button
                key={index}
                onClick={link.action}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-md hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition">
                  <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {link.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {link.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
