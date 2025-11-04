import type { NextConfig } from "next";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  // Enable experimental features for better API route handling
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Configure webpack to handle Apollo Server optional dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Polyfill optional dependencies that aren't needed
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias['@yaacovcr/transform'] = path.resolve(__dirname, 'lib/transform-polyfill.js');
    }
    return config;
  },

  // Ensure API routes work properly in production
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
