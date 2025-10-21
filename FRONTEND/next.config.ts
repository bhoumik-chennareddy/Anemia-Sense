import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration
  reactStrictMode: true,
  
  // Error handling
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Output configuration
  output: 'standalone',
  
  // Server components external packages
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `node:` protocol
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      dgram: false,
    };

    // Exclude certain Node.js built-in modules from client-side bundles
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'node-fetch': false,
        'encoding': false,
        'http': false,
        'https': false,
        'stream': false,
        'crypto': false,
        'zlib': false,
        'bufferutil': false,
        'utf-8-validate': false,
      };
    }

    return config;
  },
  
  // Disable telemetry
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
