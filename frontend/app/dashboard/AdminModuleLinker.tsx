"use client";
import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export default function AdminModuleLinker() {
  const [title, setTitle] = useState("");
  const [notionUrl, setNotionUrl] = useState("");
  const [level, setLevel] = useState("6-8"); // NEW: State for level

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const res = await fetch("http://localhost:5050/api/module/add", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      // NEW: Sending level in the body
      body: JSON.stringify({ title, notionUrl, level }), 
    });

    if (res.ok) { 
      alert(`✅ Module Linked for Level ${level}!`); 
      setTitle(""); 
      setNotionUrl(""); 
    } else {
      alert("❌ Failed to link module. Check console.");
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-4xl font-black uppercase mb-8 italic underline decoration-blue-500 decoration-8 underline-offset-8">
        Link Notion Modules
      </h2>

      <form onSubmit={handleSave} className="border-4 border-black p-8 rounded-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-blue-50">
        
        {/* MODULE TITLE */}
        <div className="mb-6">
          <label className="block text-xs font-black uppercase mb-2">Module Title</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-white"
            placeholder="e.g. Deep Learning Module 1" required
          />
        </div>

        {/* LEVEL SELECTOR */}
        <div className="mb-6">
          <label className="block text-xs font-black uppercase mb-2">Target Academic Level</label>
          <div className="relative flex items-center">
            <Layers className="absolute left-4 z-10" size={20} />
            <select 
              value={level} 
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border-4 border-black p-4 pl-12 font-black uppercase bg-white outline-none cursor-pointer appearance-none hover:bg-gray-50 focus:bg-purple-50"
            >
              <option value="6-8">Class 6 - 8 (Junior)</option>
              <option value="9-12">Class 9 - 12 (Senior)</option>
              <option value="College">College / Professional</option>
            </select>
          </div>
        </div>

        {/* NOTION URL */}
        <div className="mb-10">
          <label className="block text-xs font-black uppercase mb-2">Public Notion URL</label>
          <input 
            type="url" value={notionUrl} onChange={(e) => setNotionUrl(e.target.value)}
            className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-white"
            placeholder="https://notion.site/..." required
          />
        </div>

        <button type="submit" className="w-full bg-black text-white py-5 font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-gray-800">
          SAVE MODULE TO PLATFORM
        </button>
      </form>
    </div>
  );
}