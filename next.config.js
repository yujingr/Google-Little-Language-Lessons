/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Skip ESLint during builds to prevent interactive prompts
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
