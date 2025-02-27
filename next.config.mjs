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
  experimental: {
    esmExternals: false // Disable ESM externals to prefer CommonJS modules
  },
  webpack: (config) => {
    // Add alias for framer-motion
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src',
    };
    
    // Handle CommonJS modules
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Add additional configuration for CommonJS modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
};

export default config;