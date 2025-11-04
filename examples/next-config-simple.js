/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Enable React Compiler for automatic optimization
  experimental: {
    reactCompiler: true,
    // Optional: Granular control for React Compiler
    // reactCompiler: {
    //   sources: (filename) => {
    //     return filename.includes('src/components/Entity') || 
    //            filename.includes('src/hooks/useEntity')
    //   }
    // }
  },

  // 📁 File Upload Configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Match your current 10MB limit
    },
  },

  // 🌐 CORS and API Headers  
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
      
      // For compromise (NLP library)
      config.externals.push('compromise');
      
      // For mammoth (Word parsing) - handle Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },

  // 🗂️ TypeScript Path Aliases (configure in tsconfig.json instead)
  // But you can add custom webpack aliases here if needed
  
  // ⚡ Production Optimization
  compress: true,
  
  // 🚀 Deployment Configuration
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

module.exports = nextConfig;