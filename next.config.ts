import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better API route handling
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Configure webpack to handle Apollo Server dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle these server-only packages
      config.externals = config.externals || [];
      config.externals.push({
        '@yaacovcr/transform': '@yaacovcr/transform',
      });
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
