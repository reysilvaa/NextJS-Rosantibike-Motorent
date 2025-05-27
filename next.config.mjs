import withNextIntl from 'next-intl/plugin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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
  transpilePackages: ['next-intl'],
  images: {
    formats: ['image/avif', 'image/webp'],
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
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
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
  },
  webpack: (config, { isServer }) => {
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // Handle other image types
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|ico|webp)$/i,
      type: 'asset/resource',
    });

    // Fix for module format compatibility
    if (isServer) {
      config.experiments = {
        ...config.experiments,
        layers: true,
      };
    }

    // Alias setup
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
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_WS_URL || 'https://api.rosantibikemotorent.com';

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${apiUrl}/socket.io/:path*`,
      },
      {
        source: '/realtime/:path*',
        destination: `${apiUrl}/realtime/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
    ];
  },
};

// For bundle analyzer support
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

// Apply plugins
export default withNextIntl('./i18n.config.js')(withBundleAnalyzer(nextConfig));