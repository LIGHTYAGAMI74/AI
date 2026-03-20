// "use client";
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_URL}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         router.push("/dashboard");
//       } else {
//         alert(data.msg || "Login failed");
//       }
//     } catch (err) {
//       alert("Server connection error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans text-black">
//       <div className="w-full max-w-md bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(234,179,8,1)]">
//         <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Welcome Back<span className="text-yellow-500">.</span></h1>
//         <p className="text-gray-500 font-bold mb-8 uppercase text-xs">Initiate Authentication Protocol</p>

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label className="block text-xs font-black uppercase mb-1">Email</label>
//             <input 
//               type="email" required placeholder="you@example.com"
//               className="w-full border-4 border-black p-4 rounded-xl font-bold focus:ring-4 ring-yellow-200 outline-none transition-all"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-black uppercase mb-1">Password</label>
//             <input 
//               type="password" required placeholder="Your Secret Password"
//               className="w-full border-4 border-black p-4 rounded-xl font-bold focus:ring-4 ring-yellow-200 outline-none transition-all"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
          
//           <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all">
//             ACCESS DASHBOARD
//           </button>
//         </form>

//         <div className="mt-10 pt-6 border-t-2 border-dashed border-gray-200 text-center">
//           <p className="font-bold text-sm">
//             New to the platform? <Link href="/register" className="text-blue-600 underline decoration-2 underline-offset-4">Create Account</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Pulse the server again just in case the user landed directly on the login page
  useEffect(() => {
    fetch(`${API_URL}/`).catch(() => {});
  }, [API_URL]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
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
        alert(data.msg || "Access Denied: Invalid Credentials");
      }
    } catch (err) {
      alert("System Offline: Server connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] flex items-center justify-center p-4 md:p-6 font-mono text-black">
      
      {/* 🔙 BACK BUTTON: Responsive & Themed */}
      <Link href="/">
        <button className="fixed top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all z-50">
          <ArrowLeft size={16} strokeWidth={3} />
          <span>Exit Protocol</span>
        </button>
      </Link>

      <div className="w-full max-w-md bg-white border-4 md:border-[6px] border-black p-6 md:p-10 rounded-none shadow-[12px_12px_0px_0px_rgba(234,179,8,1)]">
        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">
          Welcome Back<span className="text-yellow-500">.</span>
        </h1>
        <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] md:text-xs">Initiate Authentication Protocol</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase mb-2">Security ID (Email)</label>
            <input 
              type="email" required placeholder="you@example.com"
              className="w-full border-4 border-black p-4 rounded-none font-bold focus:bg-yellow-50 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-2">Access Key (Password)</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full border-4 border-black p-4 rounded-none font-bold focus:bg-yellow-50 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400 cursor-wait' : 'bg-black hover:bg-blue-600'} text-white py-5 rounded-none font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all`}
          >
            {isLoading ? "Waking System..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t-4 border-black border-dashed text-center">
          <p className="font-bold text-sm">
            New operative? <Link href="/register" className="text-blue-600 underline decoration-4 underline-offset-4 font-black">GET CLEARANCE</Link>
          </p>
        </div>
      </div>
    </div>
  );
}