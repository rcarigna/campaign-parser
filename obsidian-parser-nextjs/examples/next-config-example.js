/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Compiler for automatic optimization
  experimental: {
    reactCompiler: true,
  },

  // API Routes Configuration
  api: {
    // Increase body size limit for file uploads (10MB to match current server)
    bodyParser: {
      sizeLimit: '10mb',
    },
    // Disable default body parser for file upload routes
    // We'll handle multipart/form-data manually in API routes
    externalResolver: true,
  },

  // Server-side configuration
  serverRuntimeConfig: {
    // File upload limits (matching current server configuration)
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    allowedFileTypes: ['.doc', '.docx', '.md'],
    corsOrigin: process.env.NODE_ENV === 'production' 
      ? process.env.PRODUCTION_URL 
      : 'http://localhost:3000',
  },

  // Public runtime config (available on client-side)
  publicRuntimeConfig: {
    // Client-side file validation
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc  
      'text/markdown', // .md
      'text/plain', // .txt (if you want to support)
    ],
  },

  // Headers configuration for file uploads and CORS
  async headers() {
    return [
      {
        // Apply headers to API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? process.env.PRODUCTION_URL || '*'
              : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // Cache preflight for 24 hours
          },
        ],
      },
    ];
  },

  // Rewrites for API compatibility (if needed during migration)
  async rewrites() {
    return [
      // This allows your existing client code to work during migration
      // Remove these after migration is complete
      {
        source: '/api/health',
        destination: '/api/health',
      },
      {
        source: '/api/parse',
        destination: '/api/parse',
      },
    ];
  },

  // Webpack configuration for server-side dependencies
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle node modules that need special treatment
    if (isServer) {
      // For compromise (NLP library) - ensure it works in serverless
      config.externals = config.externals || [];
      config.externals.push({
        'compromise': 'commonjs compromise',
      });

      // For mammoth (Word document parsing)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Handle file extensions for imports
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');

    return config;
  },

  // Environment variables validation
  env: {
    // Validate required environment variables
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization (if you plan to add image support later)
  images: {
    domains: [], // Add domains if you serve images from external sources
    formats: ['image/webp', 'image/avif'],
  },

  // Compression for production
  compress: true,

  // Generate standalone output for deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors. Only use this if you know what you're doing!
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },

  // Redirects (if needed for your application)
  async redirects() {
    return [
      // Add redirects here if needed
    ];
  },
};

module.exports = nextConfig;