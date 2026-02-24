/** @type {import('next').NextConfig} */
const isExport = process.env.BUILD_FOR_SHARE === '1';

const nextConfig = {
  reactStrictMode: true,
  ...(isExport && {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
  }),
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

module.exports = nextConfig;
