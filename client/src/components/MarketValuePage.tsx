import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Briefcase, Users } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function MarketValuePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const marketData = [
    {
      icon: TrendingUp,
      label: 'Average Salary',
      value: '₹8.5 LPA',
      change: '+12% from last year'
    },
    {
      icon: Briefcase,
      label: 'Top Companies',
      value: '25+',
      change: 'actively recruiting'
    },
    {
      icon: Users,
      label: 'Market Demand',
      value: 'High',
      change: 'for your skills'
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
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Your Market Value
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Comprehensive analysis of your market position and salary trends
          </p>
        </div>

        {/* Market Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {marketData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                  <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {item.value}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {item.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Detailed Analysis
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Based on your profile, here's a comprehensive analysis of your market position:
          </p>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              Your skills are in high demand across the tech industry
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              Expected salary range: ₹7.5 - 9.5 LPA for your profile
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              Top industries hiring for your skills: IT, Finance, E-commerce
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              Recommended skill upgrades: Advanced DSA, System Design
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
