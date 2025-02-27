// Fix for framer-motion CommonJS module issue
const framerMotion = require("framer-motion");

// Export all the components and hooks from framer-motion
module.exports = framerMotion;
module.exports.motion = framerMotion.motion;
module.exports.useIsPresent = framerMotion.useIsPresent;
module.exports.AnimatePresence = framerMotion.AnimatePresence;
