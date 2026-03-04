"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      router.replace("/login");
      return;
    }

    setRole(userRole);
  }, [router]);

  /* LOADING SCREEN */
  if (!role) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#fffbeb] font-mono">
        
        <div className="h-14 w-14 md:h-16 md:w-16 animate-spin border-[8px] border-black border-t-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>

        <h2 className="mt-6 text-xl md:text-2xl font-black italic uppercase tracking-tighter">
          Syncing Reality...
        </h2>

      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {role === "admin" ? <AdminDashboard /> : <StudentDashboard />}
    </main>
  );
}