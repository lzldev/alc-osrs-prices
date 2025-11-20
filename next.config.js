/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cacheComponents: true,
  },
  images: {
    domains: [""],
  },
};

module.exports = nextConfig;
