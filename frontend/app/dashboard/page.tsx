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
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#fffbeb]">
      <div className="h-16 w-16 animate-spin border-[8px] border-black border-t-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
      <h2 className="mt-8 font-black text-2xl italic uppercase tracking-tighter">Syncing Reality...</h2>
    </div>
  );

  return role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}