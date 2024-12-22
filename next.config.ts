import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'hashkeyfun-bucket.s3.ap-northeast-2.amazonaws.com',
      },
      
    ],
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL, 
  },
};

export default nextConfig;
