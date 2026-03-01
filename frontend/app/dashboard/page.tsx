"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setRole(userRole);
      setLoading(false);
    }
  }, [router]);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
    </div>
  );

  return role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}