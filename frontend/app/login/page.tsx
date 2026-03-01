"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const API_URL = "http://localhost:5050/api";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        router.push("/dashboard");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      alert("Server connection error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans text-black">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(234,179,8,1)]">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Welcome Back<span className="text-yellow-500">.</span></h1>
        <p className="text-gray-500 font-bold mb-8 uppercase text-xs">Initiate Authentication Protocol</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase mb-1">Email</label>
            <input 
              type="email" required placeholder="you@example.com"
              className="w-full border-4 border-black p-4 rounded-xl font-bold focus:ring-4 ring-yellow-200 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Password</label>
            <input 
              type="password" required placeholder="Your Secret Password"
              className="w-full border-4 border-black p-4 rounded-xl font-bold focus:ring-4 ring-yellow-200 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all">
            ACCESS DASHBOARD
          </button>
        </form>

        <div className="mt-10 pt-6 border-t-2 border-dashed border-gray-200 text-center">
          <p className="font-bold text-sm">
            New to the platform? <Link href="/register" className="text-blue-600 underline decoration-2 underline-offset-4">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}