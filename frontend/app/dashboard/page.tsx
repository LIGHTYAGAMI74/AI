"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        router.replace("/login");
        return;
      }

      const parsed = JSON.parse(user);

      if (!parsed?.role) {
        throw new Error("Invalid user");
      }

      setRole(parsed.role);
    } catch (err) {
      console.error("Auth error:", err);
      localStorage.clear();
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🔄 MODERN LOADING SCREEN
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fffbeb] font-mono px-4 text-center">

        {/* Spinner */}
        <div className="relative">
          <div className="h-16 w-16 md:h-20 md:w-20 border-[6px] md:border-[8px] border-black border-t-blue-500 animate-spin shadow-[6px_6px_0px_black]" />
        </div>

        {/* Text */}
        <h2 className="mt-6 text-xl md:text-2xl font-black text-black italic uppercase tracking-tight">
          Initializing Dashboard
        </h2>

        <p className="text-xs md:text-sm font-bold text-black mt-2 uppercase tracking-widest">
          Authenticating Neural Identity...
        </p>

      </main>
    );
  }

  return role === "admin" ? <StudentDashboard /> : <StudentDashboard />;
}