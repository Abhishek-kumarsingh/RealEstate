/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.pexels.com', 'localhost'],
    unoptimized: false
  },
  experimental: {
    fontLoaders: [
      {
        loader: '@next/font/google',
        options: { timeout: 15000 }, // Extend timeout to 15 seconds
      },
    ],
  },
};

module.exports = nextConfig;