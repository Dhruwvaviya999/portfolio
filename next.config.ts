import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Tree-shake large, icon/util-heavy packages so only used exports ship.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
