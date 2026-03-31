"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import StudentModules from "./StudentModule";
import StudentAnalytics from "./StudentAnalytics";
import StudentTests from "./StudentTest";

import {
  Book,
  BarChart2,
  PenTool,
  LogOut,
  Lock,
  Menu,
  X
} from "lucide-react";

export default function StudentDashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

  const [activeTab, setActiveTab] = useState<"modules" | "analytics" | "tests">("modules");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "student") {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Profile error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Gridixa AI Olympiad ACADEMY",
        description: "AI ACCESS",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API_URL}/api/payment/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(response)
          });
          const result = await verifyRes.json();
          if (result.success) {
            window.location.reload();
          }
        },
        theme: { color: "#000000" }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-black text-3xl animate-pulse bg-[#fff9e6]">
        SYNCING_AGENT_DATA...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fff9e6] font-mono text-black">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* --- FIXED MOBILE HEADER --- */}
      {/* This bar stays at the top and prevents overlaps */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b-[6px] border-black flex items-center px-6 z-[100]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-black text-white p-2 border-2 border-black hover:translate-y-1 transition-all"
        >
          <Menu size={24} />
        </button>
        <div className="ml-4 text-2xl font-black uppercase italic tracking-tighter">
          Gridixa<span className="text-blue-600">.</span>
        </div>
      </header>

      {/* --- SIDEBAR OVERLAY --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[110] md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r-[6px] border-black p-8 flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[120]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-black uppercase italic bg-yellow-400 border-4 border-black px-4 py-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            DASHBOARD
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden border-4 border-black p-1 hover:bg-red-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-5">
          {[
            { id: "modules", icon: <Book />, label: "Knowledge Vault" },
            { id: "analytics", icon: <BarChart2 />, label: "Intel Stats" },
            { id: "tests", icon: <PenTool />, label: "Active Ops" }
          ].map((tab: any) => (
            <button
              key={tab.id}
              disabled={!user?.isPaid}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`
                flex items-center gap-4 border-[4px] border-black p-5 font-black uppercase text-sm tracking-tight transition-all
                ${activeTab === tab.id 
                  ? "bg-blue-400 translate-x-1 translate-y-1 shadow-none" 
                  : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"}
                ${!user?.isPaid && "opacity-40 cursor-not-allowed"}
              `}
            >
              {tab.icon}
              {tab.label}
              {!user?.isPaid && <Lock size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-auto flex items-center justify-center gap-3 border-[4px] border-black p-5 font-black uppercase text-xs bg-black text-white hover:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          <LogOut size={20} />
          Abort Session
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      {/* pt-24 on mobile ensures it starts BELOW the fixed header bar */}
      <main className="flex-1 p-6 md:p-16 pt-28 md:pt-16 overflow-y-auto w-full min-h-screen">
        {!user?.isPaid ? (
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16 border-[6px] border-black rounded-[50px] bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-8 bg-red-400 border-4 border-black rounded-full mb-8">
               <Lock size={64} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter">
              ENCRYPTION_ACTIVE
            </h2>
            <p className="text-lg md:text-2xl mb-12 font-bold px-6">
              Full clearance required to access secure neural data nodes.
            </p>
            <button
              onClick={handlePayment}
              className="bg-yellow-400 border-4 border-black px-12 py-6 font-black text-xl md:text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
            >
              INITIALIZE_PAYMENT (₹149)
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {activeTab === "modules" && <StudentModules />}
            {activeTab === "analytics" && <StudentAnalytics />}
            {activeTab === "tests" && <StudentTests />}
          </div>
        )}
      </main>
    </div>
  );
}