import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Workspace() {
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
        <h1 className="text-5xl font-bold mb-4">Workspace</h1>
        <p className="text-gray-400 text-lg mb-12">Your personalized learning and practice space</p>

        {/* Placeholder Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-12 text-center"
        >
          <div className="inline-block">
            <div className="h-40 w-40 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-400 text-lg">Your workspace is being set up. Start organizing your interview prep materials soon!</p>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
