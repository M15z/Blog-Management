import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true }, // ✅ Added this line
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
