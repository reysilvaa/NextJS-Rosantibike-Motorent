let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.rosantibikemotorent.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async rewrites() {
    // Gunakan URL relatif untuk pengujian localhost dan URL absolut untuk production
    const isLocalDev = process.env.NODE_ENV === 'development';
    const apiUrl = isLocalDev 
      ? 'http://localhost:3030'  // Gunakan port 3030 untuk backend pada development
      : 'https://api.rosantibikemotorent.com';

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
        source: '/notifications/:path*',
        destination: `${apiUrl}/notifications/:path*`, 
      },
    ];
  },
  async headers() {
    return [];
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
