import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['@radix-ui/react-slot'],
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. Only enable if you know what you're doing!
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. Only enable if you know what you're doing!
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  webpack(config: any) {
    // Add SVGR loader for .svg files
    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  // Bundle analyzer
  ...(process.env['ANALYZE'] === 'true' && {
    webpack: (config: any) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer')({
          enabled: true,
        }))()
      );
      return config;
    },
  }),
};

export default nextConfig;
