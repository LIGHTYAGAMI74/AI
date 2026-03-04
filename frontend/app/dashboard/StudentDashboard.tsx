"use client";

import React, { useState } from "react";
import StudentModules from "./StudentModule";
import StudentAnalytics from "./StudentAnalytics";
import StudentTests from "./StudentTest";

import { Book, BarChart2, PenTool, LogOut, Menu } from "lucide-react";

export default function StudentDashboard() {

  const [activeTab, setActiveTab] = useState<
    "modules" | "analytics" | "tests"
  >("modules");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTab = (tab:any) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fff9e6] font-mono text-black">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <Menu size={20}/>
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
        fixed md:static top-0 left-0 h-full w-64 bg-white border-r-[6px] border-black p-6 flex flex-col
        transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        `}
      >

        {/* LOGO */}
        <h1 className="text-4xl font-black uppercase italic mb-12 bg-yellow-400 border-4 border-black px-4 py-2 -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          Agent<span className="text-blue-600">!</span>
        </h1>

        {/* NAV */}
        <nav className="flex flex-col gap-6">

          <button
            onClick={() => handleTab("modules")}
            className={`flex items-center gap-3 border-[4px] border-black p-4 font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
            ${activeTab === "modules" ? "bg-blue-400" : "bg-white"}
            `}
          >
            <Book size={22}/> Data Hub
          </button>

          <button
            onClick={() => handleTab("analytics")}
            className={`flex items-center gap-3 border-[4px] border-black p-4 font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
            ${activeTab === "analytics" ? "bg-green-400" : "bg-white"}
            `}
          >
            <BarChart2 size={22}/> Stats
          </button>

          <button
            onClick={() => handleTab("tests")}
            className={`flex items-center gap-3 border-[4px] border-black p-4 font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
            ${activeTab === "tests" ? "bg-pink-400" : "bg-white"}
            `}
          >
            <PenTool size={22}/> Missions
          </button>

        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-auto flex items-center gap-3 border-[4px] border-black p-4 font-black uppercase text-xs bg-black text-white shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] hover:bg-red-600 transition-colors"
        >
          <LogOut size={20}/> Terminate
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">

        <div className="animate-in fade-in zoom-in-95 duration-300">

          {activeTab === "modules" && <StudentModules />}
          {activeTab === "analytics" && <StudentAnalytics />}
          {activeTab === "tests" && <StudentTests />}

        </div>

      </main>

    </div>
  );
}