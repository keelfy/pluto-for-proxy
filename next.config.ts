import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "8bslhl87ch.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
