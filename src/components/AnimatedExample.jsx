'use client';

import MotionWrapper, { motion } from './MotionWrapper';

/**
 * Exemple d'utilisation du composant MotionWrapper et des exports de framer-motion
 */
const AnimatedExample = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Utilisation du composant wrapper */}
      <MotionWrapper 
        className="p-4 bg-blue-100 rounded-lg"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold">Animation avec MotionWrapper</h2>
        <p>Ce composant utilise notre wrapper personnalisé pour framer-motion</p>
      </MotionWrapper>

      {/* Utilisation directe de motion exporté */}
      <motion.div 
        className="p-4 bg-green-100 rounded-lg"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold">Animation directe avec motion</h2>
        <p>Ce composant utilise directement l'export motion de notre wrapper</p>
      </motion.div>
    </div>
  );
};

export default AnimatedExample;
