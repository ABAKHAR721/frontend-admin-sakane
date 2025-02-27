'use client';

// Utilisation de require au lieu d'import pour framer-motion
const { motion, AnimatePresence } = require("framer-motion");

/**
 * Composant wrapper pour framer-motion
 * Ce composant peut être utilisé pour envelopper n'importe quel élément avec des animations
 */
const MotionWrapper = ({ children, className, initial, animate, exit, transition, ...props }) => {
  return (
    <motion.div
      className={className}
      initial={initial || { opacity: 0 }}
      animate={animate || { opacity: 1 }}
      exit={exit || { opacity: 0 }}
      transition={transition || { duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Exporter les composants framer-motion pour une utilisation facile
export { motion, AnimatePresence };
export default MotionWrapper;
