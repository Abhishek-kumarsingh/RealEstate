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
  }
};

module.exports = nextConfig;