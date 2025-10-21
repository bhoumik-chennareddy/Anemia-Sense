import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Error handling
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // React configuration
  reactStrictMode: true,
  
  // Enable CSS modules
  sassOptions: {
    includePaths: ['./src'],
  },
  
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

    // Handle CSS loading in production
    if (!isServer) {
      config.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      });
    }

    return config;
  },
  
  // Output configuration
  output: 'standalone',
  
  // Images configuration
  images: {
    domains: ['localhost'],
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
