"use client";

import React, { useState, useEffect } from "react";
import StudentModules from "./StudentModule";
import StudentAnalytics from "./StudentAnalytics";
import StudentTests from "./StudentTest";
import { getProfile } from "@/services/auth";

import {
  Book,
  BarChart2,
  PenTool,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "modules" | "analytics" | "tests"
  >("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH + FETCH USER
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);

        if (data.role !== "student") {
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Profile fetch failed");
        localStorage.clear();
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-black text-3xl animate-pulse bg-[#fff9e6]">
        SYNCING_AGENT_DATA...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fff9e6] font-mono text-black">

      {/* 🔝 MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b-[6px] border-black flex items-center px-6 z-[100]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-black text-white p-2 border-2 border-black"
        >
          <Menu size={24} />
        </button>
        <div className="ml-4 text-2xl font-black uppercase italic">
          Gridixa<span className="text-blue-600">.</span>
        </div>
      </header>

      {/* 🔲 OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[110] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 📌 SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r-[6px] border-black p-8 flex flex-col z-[120]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex justify-between mb-12">
          <h1 className="text-3xl font-black uppercase italic bg-yellow-400 border-4 border-black px-4 py-1">
            DASHBOARD
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden border-4 border-black p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* 🧭 NAVIGATION */}
        <nav className="flex flex-col gap-5">
          {[
            { id: "dashboard", icon: <BarChart2 />, label: "Dashboard" },
            { id: "modules", icon: <Book />, label: "Modules" },
            { id: "tests", icon: <PenTool />, label: "Tests" },
            { id: "analytics", icon: <BarChart2 />, label: "Analytics" }
          ].map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`
                flex items-center gap-4 border-[4px] border-black p-5 font-black uppercase text-sm
                ${activeTab === tab.id 
                  ? "bg-blue-400 translate-x-1 translate-y-1 shadow-none" 
                  : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* 🚪 LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-auto flex items-center justify-center gap-3 border-[4px] border-black p-5 font-black uppercase text-xs bg-black text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* 🧠 MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-16 pt-28 md:pt-16">

        <div className="max-w-7xl mx-auto">

          {/* 🏠 DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">

              <div className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_black]">
                <h2 className="text-4xl font-black italic uppercase">
                  Welcome, {user?.name}
                </h2>
                <p className="font-bold mt-2 text-gray-600">
                  Continue your AI learning journey.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveTab("modules")}
                  className="cursor-pointer bg-yellow-400 p-6 border-4 border-black font-black"
                >
                  📚 Continue Learning
                </div>

                <div
                  onClick={() => setActiveTab("tests")}
                  className="cursor-pointer bg-pink-500 text-white p-6 border-4 border-black font-black"
                >
                  🧪 Take Test
                </div>

                <div
                  onClick={() => setActiveTab("analytics")}
                  className="cursor-pointer bg-blue-400 p-6 border-4 border-black font-black"
                >
                  📊 View Stats
                </div>
              </div>

            </div>
          )}

          {/* 📚 MODULES */}
          {activeTab === "modules" && <StudentModules />}

          {/* 🧪 TESTS */}
          {activeTab === "tests" && <StudentTests />}

          {/* 📊 ANALYTICS */}
          {activeTab === "analytics" && <StudentAnalytics />}

        </div>

      </main>
    </div>
  );
}