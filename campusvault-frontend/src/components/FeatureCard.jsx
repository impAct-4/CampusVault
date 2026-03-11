import { motion } from 'framer-motion';

export default function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer"
    >
      <Icon className="w-10 h-10 text-cyan-400 mb-4" />
      <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
      <p className="text-sm text-gray-400">{feature.description}</p>
    </motion.div>
  );
}
