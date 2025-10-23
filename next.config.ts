import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable CSS optimization that breaks Tailwind v4 animations in production
    optimizeCss: false,
  },
  // Ensure CSS is processed correctly in production builds
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
