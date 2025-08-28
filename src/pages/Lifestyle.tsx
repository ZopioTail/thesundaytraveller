
import { motion } from 'framer-motion';

export default function Lifestyle() {
  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8">
            Lifestyle
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Coming soon - Travel lifestyle, culture, and personal insights from my journeys.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
