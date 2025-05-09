import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        stream: false,
        crypto: false,
        os: false,
        path: false,
        http: false,
        https: false,
        zlib: false,
        util: false,
        assert: false,
        url: false,
        buffer: false,
        process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
