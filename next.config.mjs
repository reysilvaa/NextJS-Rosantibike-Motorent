let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
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
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizePackageImports: ['react-icons', 'date-fns', 'lodash'],
  },
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
          source: '/notifications/:path*',
          destination: `${apiUrl}/notifications/:path*`,
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

export default nextConfig
