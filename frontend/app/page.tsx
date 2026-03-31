import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Gridixa AI Olympiad",
  description:
    "Gridixa AI Olympiad is an AI-powered platform for students with dashboards, insights, and smart learning tools.",

  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "Gridixa AI Olympiad",
    description: "Learn smarter with AI",
    url: "https://yourdomain.com",
    siteName: "Gridixa AI",
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
    title: "Gridixa AI Olympiad",
    description: "AI-powered learning platform",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}