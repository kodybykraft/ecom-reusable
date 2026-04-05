import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@ecom/core',
    '@ecom/db',
    '@ecom/server',
    '@ecom/react',
    '@ecom/next',
    '@ecom/admin',
    '@ecom/ui',
  ],
};

export default nextConfig;
