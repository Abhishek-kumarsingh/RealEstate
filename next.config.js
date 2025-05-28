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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  env: {
    SKIP_ENV_VALIDATION: 'true',
  },
  output: 'standalone',
};

module.exports = nextConfig;
