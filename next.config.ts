import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "http",
    //     hostname: "localhost",
    //     port: "3000",
    //     pathname: "/uploads/**",
    //   },
    // ],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
