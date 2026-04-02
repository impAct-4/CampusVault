import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <h1 className="text-5xl font-bold mb-8">Your Profile</h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-8"
        >
          {/* User Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-purple-500/20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{user?.name?.[0]}</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-gray-400 text-sm mb-2">Account Status</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-lg font-semibold text-green-400">Active</span>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Member Since</p>
              <p className="text-lg text-gray-200">{new Date().toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Tier</p>
              <p className="text-lg font-semibold text-purple-400">Free</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-white/5 rounded-lg border border-purple-500/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">0</p>
              <p className="text-sm text-gray-400">Interviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-sm text-gray-400">Skill Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-400">0</p>
              <p className="text-sm text-gray-400">Streak</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full px-6 py-3 rounded-lg font-semibold bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/30 transition-all duration-300 text-purple-300">
              Edit Profile
            </button>
            <button className="w-full px-6 py-3 rounded-lg font-semibold bg-gray-600/20 border border-gray-500/50 hover:bg-gray-600/30 transition-all duration-300 text-gray-300">
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 rounded-lg font-semibold bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 transition-all duration-300 text-red-300"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
