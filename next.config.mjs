/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

// Load environment variables from the appropriate .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const config = {
  reactStrictMode: false, // Disable strict mode to avoid issues with framer-motion
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  transpilePackages: ['framer-motion'], // Add framer-motion to transpilePackages
  webpack: (config) => {
    // Add alias for framer-motion
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src',
      'framer-motion': '/app/src/utils/framer-motion-fix.js'
    };
    
    // Handle CommonJS modules
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  }
}

export default config;