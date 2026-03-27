import type { NextConfig } from "next";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://checkout.razorpay.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL} http://localhost:5000;
            `.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;