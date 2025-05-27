/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['images.pexels.com', 'localhost', 'res.cloudinary.com', 'placeholder.com'],
    unoptimized: false
  },
  experimental: {
    // Ensure we're using the App Router properly
    appDir: true,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
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
  },
  // Disable static 500 error page generation
  output: 'standalone'
};

module.exports = nextConfig;