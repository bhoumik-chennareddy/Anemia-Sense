import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  
  // Experimental features configuration
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Configure webpack to handle the Supabase client-side only modules
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
  
  // Use standalone output for better compatibility
  output: 'standalone',
};

export default nextConfig;
