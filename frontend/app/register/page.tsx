"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student", level: "" });
  const router = useRouter();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.level) return alert("Please select your class level!");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration Successful!");
        router.push("/login");
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (err) {
      alert("Server connection error");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] flex items-center justify-center p-6 font-sans text-black">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2 underline decoration-yellow-400">Join Gridixa<span className="text-blue-500">.</span></h1>
        <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] tracking-widest">Create your intelligence profile</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Full Name</label>
            <input 
              type="text" required placeholder="Mayank Yadav"
              className="w-full border-4 border-black p-3 rounded-xl font-bold focus:bg-yellow-50 outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Email Address</label>
            <input 
              type="email" required placeholder="hello@Gridixa.ai"
              className="w-full border-4 border-black p-3 rounded-xl font-bold focus:bg-blue-50 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Password</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full border-4 border-black p-3 rounded-xl font-bold focus:bg-green-50 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-1 text-gray-500">Academic Level</label>
            <select 
              required
              className="w-full border-4 border-black p-4 rounded-xl font-black bg-white focus:bg-purple-100 outline-none appearance-none cursor-pointer"
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option value="">-- CHOOSE LEVEL --</option>
              <option value="6-8">Class 6 - 8</option>
              <option value="9-12">Class 9 - 10</option>
              <option value="College">Class 11- 12</option>
            </select>
          </div>  
          
          <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 active:translate-y-0 transition-all">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="mt-8 text-center font-bold text-sm">
          Already a member? <Link href="/login" className="text-blue-600 underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}