"use client";

import React, { useState, useEffect } from "react";
import StudentModules from "./StudentModule";
import StudentTests from "./StudentTest";
import ActivityGrid from "../../components/ActivityGrid";
import { getProfile } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

import {
  Book,
  BarChart2,
  PenTool,
  LogOut,
  Menu,
  X,
  Lock,
  ClipboardList
} from "lucide-react";

export default function StudentDashboard() {
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "modules" | "tests"
  >("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 FETCH USER
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
      } catch {
        logout();
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateActivityLocally = () => {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    setUser((prev: any) => {
      if (!prev) return prev;

      const log = prev.stats?.activityLog || [];

      if (log.includes(today)) return prev;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          activityLog: [...log, today],
          activityDays: log.length + 1,
        },
      };
    });
  };

  // 🔄 LOADING UI
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff9e6] font-mono px-4 text-center">

        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 md:h-32 md:w-32 border-[6px] border-black border-dashed animate-spin" />
          <div className="h-12 w-12 md:h-16 md:w-16 bg-blue-500 border-4 border-black animate-pulse shadow-[6px_6px_0px_black]" />
        </div>

        <h1 className="mt-18 text-2xl md:text-4xl text-black font-black italic uppercase">
          Syncing Neural Data
        </h1>

        <p className="mt-2 text-xs md:text-sm font-bold text-black uppercase tracking-widest">
          Establishing secure connection...
        </p>

        <div className="w-64 md:w-80 h-3 border-2 border-black mt-6 overflow-hidden bg-white">
          <div className="h-full bg-black animate-[loadingBar_2s_linear_infinite]" />
        </div>

        <style jsx>{`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  const testHistory = user?.stats?.testHistory || [];

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

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[110] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
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

        {/* NAV */}
        <nav className="flex flex-col gap-5">
          {[
            { id: "dashboard", icon: <BarChart2 />, label: "Dashboard" },
            { id: "modules", icon: <Book />, label: "Modules" },
            { id: "tests", icon: <PenTool />, label: "Tests" }
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
                  : "bg-white shadow-[4px_4px_0px_black] hover:bg-yellow-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          {/* 🔒 MOCK TEST */}
          <button
            disabled
            className="flex items-center gap-4 border-[4px] border-black p-5 font-black uppercase text-sm bg-gray-200 opacity-60 cursor-not-allowed"
          >
            <ClipboardList />
            Mock Test
            <Lock size={16} className="ml-auto" />
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="mt-auto flex items-center justify-center gap-3 border-[4px] border-black p-5 font-black uppercase text-xs bg-black text-white hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-16 pt-28 md:pt-16">

        <div className="max-w-7xl mx-auto">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-10">

              {/* HEADER */}
              <div className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_black]">
                <h2 className="text-4xl font-black italic uppercase">
                  Welcome {user?.name}!
                </h2>
                <p className="font-bold mt-2 text-gray-600">
                  Continue your AI learning journey.
                </p>
              </div>

              {/* ACTION CARDS */}
              <div className="grid md:grid-cols-3 gap-6">

                <div
                  onClick={() => setActiveTab("modules")}
                  className="cursor-pointer bg-yellow-400 p-6 border-4 border-black font-black flex flex-col gap-3 hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] transition-all"
                >
                  <Book size={28} />
                  Continue Learning
                </div>

                <div
                  onClick={() => setActiveTab("tests")}
                  className="cursor-pointer bg-pink-500 text-white p-6 border-4 border-black font-black flex flex-col gap-3 hover:bg-pink-600 hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] transition-all"
                >
                  <PenTool size={28} />
                  Take Module Test
                </div>

                <div className="bg-blue-400 p-6 border-4 border-black font-black flex flex-col gap-3 hover:bg-blue-500 hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] transition-all">
                  <BarChart2 size={28} />
                  Performance Overview
                </div>

              </div>

              {/* 🔥 ANALYTICS INLINE */}
              <section>
                <ActivityGrid activityLog={user?.stats?.activityLog || []} />
              </section>

              {/* QUICK STATS */}
              <section className="grid md:grid-cols-2 gap-6">
                <div className="border-[6px] border-black p-6 bg-yellow-400 font-black">
                  Tests Completed: {testHistory.length}
                </div>
                <div className="border-[6px] border-black p-6 bg-pink-500 text-white font-black">
                  Streak: {user?.stats?.activityDays || 0}
                </div>
              </section>

            </div>
          )}

          {/* MODULES */}
          {activeTab === "modules" && (
            <StudentModules onActivity={updateActivityLocally} />
          )}

          {/* TESTS */}
          {activeTab === "tests" && <StudentTests />}

        </div>

      </main>
    </div>
  );
}