import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 React Compiler for automatic optimization (will be configured when migrating code)
  // Note: React Compiler configuration will be added during component migration

  // 🏎️ Turbopack configuration (Next.js 16+ default)
  turbopack: {
    // Enable Turbopack for faster development builds
  },

  // 🌐 CORS and API Headers for document parsing API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },

  // 🔧 Webpack Configuration for Server Dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle your document parsing dependencies
      config.externals = config.externals || [];

      // For compromise (NLP library) - ensure it works in serverless environment
      config.externals.push('compromise');

      // For mammoth (Word parsing) - handle Node.js specific modules
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },

  // ⚡ Production Optimization
  compress: true,

  // 🚀 Deployment Configuration  
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;
