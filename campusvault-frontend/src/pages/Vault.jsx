import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Vault() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <h1 className="text-5xl font-bold mb-4">Interview Vault</h1>
        <p className="text-gray-400 text-lg mb-12">Search and filter interview experiences from real candidates</p>

        {/* Placeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 hover:border-purple-400 transition-all duration-300"
            >
              <div className="h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded mb-4" />
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-gray-400">Interview experience #{i} will appear here</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
