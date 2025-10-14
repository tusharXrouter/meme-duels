import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
        layers: true,
      };
    }
    return config;
  },
};

export default nextConfig;
