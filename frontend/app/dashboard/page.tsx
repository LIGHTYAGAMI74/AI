"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const validateUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/login?reason=unauthorized");
          return;
        }

        const res = await fetchWithAuth(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const user = await res.json();

        setRole(user.role);

      } catch (err) {
        console.error("Auth error:", err);
        localStorage.clear();
        router.replace("/login?reason=unauthorized");
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="border-8 border-black border-t-blue-500 w-16 h-16 animate-spin" />
      </main>
    );
  }

  return role === "admin"
    ? <AdminDashboard />
    : <StudentDashboard />;
}