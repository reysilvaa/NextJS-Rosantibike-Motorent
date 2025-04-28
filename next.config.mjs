// Import bundle analyzer
import withNextIntl from 'next-intl/plugin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
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
  // Tambahkan transpilePackages untuk memastikan next-intl diproses dengan benar
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
        hostname: process.env.NEXT_PUBLIC_WS_URL,
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
  // Pindahkan konfigurasi turbo ke level teratas sebagai turbopack
  turbopack: {
    // Konfigurasi loader untuk Turbopack
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
      '*.yaml': {
        loaders: ['yaml-loader'],
      },
      '*.mdx': {
        loaders: ['babel-loader'],
      },
    },
    // Konfigurasi alias untuk Turbopack
    resolveAlias: {
      '@': join(__dirname),
      '@components': join(__dirname, 'components'),
      '@app': join(__dirname, 'app'),
      '@lib': join(__dirname, 'lib'),
      '@hooks': join(__dirname, 'hooks'),
      '@contexts': join(__dirname, 'contexts'),
      '@styles': join(__dirname, 'styles'),
    },
    // Ekstensi file yang didukung
    resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mdx', '.svg'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(svg|png|jpg|jpeg|gif|ico|webp)$/i,
      type: 'asset/resource',
    });

    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      runtimeChunk: 'single',
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
              
              // Separate larger packages (match these with popular deps from package.json)
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

              // Group remaining packages by first letter to create smaller bundles
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
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

// Export nextConfig with analyzer if available
let exportedConfig = nextConfig;

try {
  const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
    enabled: process.env.ANALYZE === 'true',
  });
  exportedConfig = withBundleAnalyzer(nextConfig);
} catch (_unused) {
  // Fallback to regular config if bundle analyzer is not available
}

// Wrap config dengan next-intl
export default withNextIntl('./i18n.config.js')(exportedConfig); 