// Import bundle analyzer
import withNextIntl from 'next-intl/plugin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let userConfig = undefined;
try {
  // Fix the import to handle ESM properly
  const userConfigModule = await import('./v0-user-next.config.js');
  userConfig = userConfigModule.default || userConfigModule;
} catch (/** @type {any} */ _unused) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['next-intl'],
  images: {
    unoptimized: false,
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_WS_URL?.replace(/^https?:\/\//, '') || 'api.rosantibikemotorent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rosantibikemotorent.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'date-fns',
      'framer-motion',
      'react-hook-form',
      'embla-carousel-react',
      '@radix-ui',
      'recharts'
    ],
    optimisticClientCache: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(svg|png|jpg|jpeg|gif|ico|webp)$/i,
      type: 'asset/resource',
    });

    // Fix for module format compatibility
    if (isServer) {
      config.experiments = {
        ...config.experiments,
        layers: true,
        topLevelAwait: true,
      };
    }

    // Ensure compatibility between ESM and CommonJS
    config.output = {
      ...config.output,
      chunkFormat: isServer ? 'module' : undefined,
      module: isServer,
    };

    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      runtimeChunk: isServer ? undefined : 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Protect against null module.context
              if (!module.context) return 'npm.unknown';
              
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              if (!match) return 'npm.unknown';
              
              const packageName = match[1];
              
              // Separate larger packages
              if ([
                'framer-motion', 
                'react-icons', 
                'date-fns', 
                'recharts',
                'axios',
                'embla-carousel-react',
                'lucide-react',
                'socket.io-client',
                'video.js',
                'react-hook-form',
                'zod',
                'i18next'
              ].includes(packageName)) {
                return `npm.${packageName}`;
              }
              
              // Group all radix-ui components together
              if (packageName.startsWith('@radix-ui')) {
                return 'npm.radix-ui';
              }

              // Group remaining packages by first letter
              const firstLetter = packageName.charAt(0).toLowerCase();
              return `npm.chunk.${firstLetter}`;
            },
          },
        },
      },
    };
    
    // Alias setup in webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname),
      '@components': join(__dirname, 'components'),
      '@app': join(__dirname, 'app'),
      '@lib': join(__dirname, 'lib'),
      '@hooks': join(__dirname, 'hooks'),
      '@contexts': join(__dirname, 'contexts'),
      '@styles': join(__dirname, 'styles'),
    };
    
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const prodApiUrl = process.env.NEXT_PUBLIC_WS_URL || 'https://api.rosantibikemotorent.com';
    const devApiUrl = prodApiUrl;
    const apiUrl = isProduction ? prodApiUrl : devApiUrl;

    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
          basePath: false,
        },
        {
          source: '/socket.io/:path*',
          destination: `${apiUrl}/socket.io/:path*`,
          basePath: false,
        },
        {
          source: '/realtime/:path*',
          destination: `${apiUrl}/realtime/:path*`,
          basePath: false,
        },
      ]
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/public/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ]
      },
      {
        source: '/public/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ]
      },
    ];
  },
};

// Merge configs properly
function mergeConfig(baseConfig, userConfig) {
  if (!userConfig) {
    return baseConfig;
  }

  const mergedConfig = { ...baseConfig };

  for (const key in userConfig) {
    if (
      typeof baseConfig[key] === 'object' &&
      !Array.isArray(baseConfig[key]) &&
      baseConfig[key] !== null
    ) {
      mergedConfig[key] = {
        ...baseConfig[key],
        ...userConfig[key],
      };
    } else {
      mergedConfig[key] = userConfig[key];
    }
  }

  return mergedConfig;
}

const finalConfig = mergeConfig(nextConfig, userConfig);

// Export nextConfig with analyzer if available
let exportedConfig = finalConfig;

try {
  const bundleAnalyzerModule = await import('@next/bundle-analyzer');
  const withBundleAnalyzer = bundleAnalyzerModule.default({
    enabled: process.env.ANALYZE === 'true',
  });
  exportedConfig = withBundleAnalyzer(finalConfig);
} catch (_unused) {
  // Fallback to regular config if bundle analyzer is not available
}

// Wrap config with next-intl
export default withNextIntl('./i18n.config.js')(exportedConfig);