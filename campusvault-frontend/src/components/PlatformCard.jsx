import { motion } from 'framer-motion';

export default function PlatformCard({ platform }) {
  const Icon = platform.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg p-6 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
    >
      <Icon className="w-10 h-10 text-purple-400 mb-4" />
      <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{platform.description}</p>
    </motion.div>
  );
}
