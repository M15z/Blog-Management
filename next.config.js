/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // optional if TS errors ever block builds:
  // typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;