/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['images.pexels.com', 'localhost'],
    unoptimized: false
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  // Skip database operations during build
  env: {
    SKIP_ENV_VALIDATION: 'true',
  },
  // Webpack configuration to handle Prisma during build
  webpack: (config, { isServer, nextRuntime }) => {
    if (isServer && nextRuntime === 'nodejs') {
      config.plugins = [...config.plugins]
    }
    return config
  }
};

module.exports = nextConfig;