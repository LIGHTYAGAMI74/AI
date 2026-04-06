"use client";

import React, { useState } from "react";
import AdminModuleLinker from "./AdminModuleLinker";
import AdminUsersPanel from "./AdminUsersPanel"; // 🔥 NEW

import {
  BookOpen,
  PenTool,
  Users,
  LogOut,
  Menu,
} from "lucide-react";

type TabType = "modules" | "users";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fffbeb] font-mono text-black">

      {/* MOBILE MENU */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-3 rounded-lg"
      >
        <Menu size={22} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative z-40 w-72 bg-white border-r-[6px] border-black p-6 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <header className="bg-blue-600 text-white p-4 border-4 border-black mb-10 shadow-lg">
          <h1 className="text-3xl font-black uppercase italic">
            Admin Panel
          </h1>
        </header>

        {/* NAV */}
        <nav className="flex-1 space-y-5">

          <button
            onClick={() => switchTab("users")}
            className={`w-full flex items-center gap-3 p-4 border-[4px] border-black font-black uppercase text-sm
            ${activeTab === "users" ? "bg-green-400" : "bg-white hover:bg-gray-100"}`}
          >
            <Users size={20} /> Users
          </button>

          <button
            onClick={() => switchTab("modules")}
            className={`w-full flex items-center gap-3 p-4 border-[4px] border-black font-black uppercase text-sm
            ${activeTab === "modules" ? "bg-pink-400" : "bg-white hover:bg-gray-100"}`}
          >
            <BookOpen size={20} /> Modules
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login?reason=unauthorized";
          }}
          className="mt-auto flex items-center justify-center gap-3 p-4 border-[4px] border-black font-black uppercase text-xs bg-black text-white hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">
        <section className="max-w-7xl mx-auto">

          {activeTab === "users" && <AdminUsersPanel />}
          {activeTab === "modules" && <AdminModuleLinker />}

        </section>
      </main>
    </div>
  );
}