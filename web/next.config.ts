import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression for production
  compress: true,

  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Strict mode for better React practices
  reactStrictMode: true,
};

export default nextConfig;
