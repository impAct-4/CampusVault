import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Calculator() {
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
        <h1 className="text-5xl font-bold mb-4">Skill Calculator</h1>
        <p className="text-gray-400 text-lg mb-12">Calculate your placement readiness score and get personalized recommendations</p>

        {/* Placeholder Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-12 text-center"
        >
          <div className="inline-block">
            <div className="h-40 w-40 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-400 text-lg">The skill calculator feature will be available soon. Get ready to assess your placement potential!</p>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
