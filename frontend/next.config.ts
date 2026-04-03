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
            value: "SAMEORIGIN",
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

              script-src 
                'self' 
                'unsafe-inline' 
                https://checkout.razorpay.com 
                https://fonts.googleapis.com
                https://gridixa-ai-notes.s3.ap-south-1.amazonaws.com
                https://cdn.razorpay.com;

              style-src 
                'self' 
                'unsafe-inline';
                https://fonts.googleapis.com;

              img-src 
                'self' 
                data: 
                https://*.razorpay.com;

              frame-src 
                'self' 
                https://api.razorpay.com 
                https://checkout.razorpay.com;

              connect-src 
                'self' 
                ${process.env.NEXT_PUBLIC_API_URL} 
                http://localhost:5000 
                https://api.razorpay.com 
                https://gridixa-ai-notes.s3.ap-south-1.amazonaws.com
                https://fonts.googleapis.com
                https://lumberjack.razorpay.com;

            `.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;