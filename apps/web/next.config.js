/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@studyverse/shared", "three"],
  experimental: {
    optimizePackageImports: ["@react-three/drei", "framer-motion"],
  },
  webpack: (config) => {
    // Required for @react-three/rapier WASM
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

module.exports = nextConfig;
