import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // This matches any request starting with /api
        source: '/api/:path*',
        // This redirects it to your Express backend
        destination: 'http://localhost:5000/api/:path*', 
      },
    ];
  },
};

export default nextConfig;