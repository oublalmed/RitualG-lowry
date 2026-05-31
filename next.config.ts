import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Optimize package imports for bundle size
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@sanity/client",
    ],
  },
};

export default nextConfig;
