import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace para evitar la advertencia por múltiples lockfiles
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
