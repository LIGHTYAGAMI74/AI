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
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    const parsed = JSON.parse(user);
    setRole(parsed.role);
  }, [router]);

  if (!role) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffbeb] font-mono">
        <div className="animate-spin border-8 border-black border-t-blue-500 h-16 w-16" />
      </main>
    );
  }

  return role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}