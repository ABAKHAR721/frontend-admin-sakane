// Fix for framer-motion CommonJS module issue
import pkg from 'framer-motion';

export const motion = pkg.motion;
export const useIsPresent = pkg.useIsPresent;
export const AnimatePresence = pkg.AnimatePresence;
export default pkg;
