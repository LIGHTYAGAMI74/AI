"use client";
import React, { useState } from 'react';
import AdminTestCreator from './AdminTestCreator';
import AdminModuleLinker from './AdminModuleLinker';
import { LayoutDashboard, BookOpen, PenTool, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tests' | 'modules'>('tests');

  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      {/* SIDEBAR */}
      <aside className="w-64 border-r-4 border-black p-6 flex flex-col">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-10">
          Admin<span className="text-blue-500">.</span>
        </h1>
        
        <nav className="flex-1 space-y-4">
          <button 
            onClick={() => setActiveTab('tests')}
            className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all ${activeTab === 'tests' ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'}`}
          >
            <PenTool size={20} /> Mock Tests
          </button>

          <button 
            onClick={() => setActiveTab('modules')}
            className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all ${activeTab === 'modules' ? 'bg-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'}`}
          >
            <BookOpen size={20} /> Notion Modules
          </button>
        </nav>

        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="mt-auto flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm bg-red-100 hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto max-h-screen">
        {activeTab === 'tests' ? <AdminTestCreator /> : <AdminModuleLinker />}
      </main>
    </div>
  );
}