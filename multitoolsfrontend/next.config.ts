import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV !== 'production'
  }
};

export default nextConfig;
