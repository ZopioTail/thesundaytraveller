import React from 'react';
import { motion } from 'framer-motion';

export default function Adventure() {
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
            Adventure
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Coming soon - Thrilling outdoor experiences and adventure stories from around the world.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
