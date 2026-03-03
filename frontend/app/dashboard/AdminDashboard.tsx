"use client";
import React, { useState } from 'react';
import AdminTestCreator from './AdminTestCreator';
import AdminModuleLinker from './AdminModuleLinker';
import { LayoutDashboard, BookOpen, PenTool, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tests' | 'modules'>('tests');

  return (
    <div className="flex min-h-screen bg-[#fffbeb] font-mono text-black">
      <aside className="w-72 border-r-[6px] border-black p-6 flex flex-col bg-white">
        <div className="bg-blue-600 text-white p-4 border-4 border-black -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Admin!</h1>
        </div>
        
        <nav className="flex-1 space-y-6">
          <button 
            onClick={() => setActiveTab('tests')}
            className={`w-full flex items-center gap-3 p-5 border-[4px] border-black font-black uppercase text-sm transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${activeTab === 'tests' ? 'bg-yellow-400' : 'bg-white'}`}
          >
            <PenTool size={24} strokeWidth={3} /> Create Test
          </button>

          <button 
            onClick={() => setActiveTab('modules')}
            className={`w-full flex items-center gap-3 p-5 border-[4px] border-black font-black uppercase text-sm transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${activeTab === 'modules' ? 'bg-pink-400' : 'bg-white'}`}
          >
            <BookOpen size={24} strokeWidth={3} /> Notion Links
          </button>
        </nav>

        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="mt-auto flex items-center justify-center gap-3 p-4 border-[4px] border-black font-black uppercase text-xs bg-black text-white hover:bg-red-600 transition-colors"
        >
          <LogOut size={18} /> Kill Session
        </button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto max-h-screen">
        {activeTab === 'tests' ? <AdminTestCreator /> : <AdminModuleLinker />}
      </main>
    </div>
  );
}