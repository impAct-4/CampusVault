import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import TabButton from '../components/TabButton';
import PlatformCard from '../components/PlatformCard';
import FeatureCard from '../components/FeatureCard';
import { platforms, features } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('platforms');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabButtonClass = 'px-6 py-3 font-semibold transition-all duration-300';

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = ['platforms', 'features', 'vault', 'calculator', 'workspace', 'profile'];
  const tabLabels = {
    platforms: 'Platforms',
    features: 'Features',
    vault: 'Interview Vault',
    calculator: 'Skill Calculator',
    workspace: 'Workspace',
    profile: 'Profile',
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2">Welcome Back, {user?.name}!</h1>
          <p className="text-gray-400">Explore platforms, track your progress, and master interviews</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 border-b border-purple-500/20 overflow-x-auto"
        >
          <div className="flex gap-2 md:gap-0">
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                name={tabLabels[tab]}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'platforms' && (
            <motion.div
              key="platforms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform, i) => (
                  <motion.div
                    key={platform.id}
                    custom={i}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <PlatformCard platform={platform} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.id}
                    custom={i}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FeatureCard feature={feature} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div
              key="vault"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="inline-block bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-12 backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-4">Interview Vault</h2>
                <p className="text-gray-400 text-lg">Coming Soon - Access 500+ real interview experiences from top companies</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="inline-block bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-12 backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-4">Skill Calculator</h2>
                <p className="text-gray-400 text-lg">Coming Soon - Calculate your placement readiness with AI-powered analysis</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'workspace' && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="inline-block bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-12 backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-4">Workspace</h2>
                <p className="text-gray-400 text-lg">Coming Soon - Your personalized learning and practice space</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-8 backdrop-blur-md">
                  <h2 className="text-3xl font-bold mb-8">Your Profile</h2>

                  {/* User Info */}
                  <div className="space-y-6 mb-8">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Name</p>
                      <p className="text-2xl font-semibold">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Email</p>
                      <p className="text-xl text-gray-200">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Account Status</p>
                      <p className="text-lg">
                        <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-300">
                          Active
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-purple-500/20 space-y-3">
                    <button className="w-full px-6 py-3 rounded-lg font-semibold bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/30 transition-all duration-300 text-purple-300">
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-6 py-3 rounded-lg font-semibold bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 transition-all duration-300 text-red-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
