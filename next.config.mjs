/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

// Load environment variables from the appropriate .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const config = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src'
    };
    return config;
  }
}

export default config;