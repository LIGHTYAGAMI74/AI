import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "BEN AI - Smart Learning Platform",
  description:
    "BEN AI is an AI-powered platform for students with dashboards, insights, and smart learning tools.",

  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "BEN AI",
    description: "Learn smarter with AI",
    url: "https://yourdomain.com",
    siteName: "BEN AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BEN AI",
    description: "AI-powered learning platform",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}