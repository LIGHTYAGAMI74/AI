import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai.gridixa.in"),

  title: {
    default: "Gridixa AI Olympiad – India's Smart AI Learning & Olympiad Platform",
    template: "%s | Gridixa AI Olympiad",
  },

  description:
    "Gridixa AI Olympiad is an AI-powered learning and assessment platform for students. Practice Olympiad-level questions, track performance, and improve with smart AI insights.",

  keywords: [
    "AI Olympiad",
    "Gridixa",
    "Olympiad preparation",
    "AI learning platform",
    "student dashboard AI",
    "online olympiad tests",
    "adaptive learning",
    "India olympiad platform",
    "AI education tools",
  ],

  authors: [{ name: "Gridixa Team" }],
  creator: "Gridixa",
  publisher: "Gridixa",

  alternates: {
    canonical: "https://ai.gridixa.in",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Gridixa AI Olympiad – Smart AI Learning Platform",
    description:
      "Prepare for Olympiads with AI-powered insights, adaptive tests, and personalized dashboards.",
    url: "https://ai.gridixa.in",
    siteName: "Gridixa AI Olympiad",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gridixa AI Olympiad Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Gridixa AI Olympiad",
    description:
      "AI-powered Olympiad preparation platform with smart insights & analytics.",
    creator: "@gridixa", // update if you have one
    images: ["/og-image.png"],
  },

  category: "education",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  applicationName: "Gridixa AI Olympiad",

  other: {
    "theme-color": "#00b000",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    name: "Gridixa AI Olympiad",
    url: "https://ai.gridixa.in",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "AI-powered Olympiad learning platform with smart analytics, adaptive tests, and student dashboards.",
    creator: {
      "@type": "Organization",
      name: "Gridixa",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return (
    <>
      {/* ✅ JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeClient />
    </>
  );
}