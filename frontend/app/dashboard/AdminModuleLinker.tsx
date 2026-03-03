"use client";
import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export default function AdminModuleLinker() {
  const [title, setTitle] = useState("");
  const [notionUrl, setNotionUrl] = useState("");
  const [level, setLevel] = useState("6-8");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/module/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title, notionUrl, level }), 
    });
    if (res.ok) { alert(`✅ Module Saved!`); setTitle(""); setNotionUrl(""); }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-6xl font-black uppercase mb-12 italic tracking-tighter">
        Link <span className="bg-pink-400 px-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">Modules</span>
      </h2>

      <form onSubmit={handleSave} className="border-[6px] border-black p-10 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] rotate-1">
        <div className="mb-8">
          <label className="block text-sm font-black uppercase mb-2 italic">Module Designation</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border-4 border-black p-5 font-black outline-none focus:bg-yellow-50 text-xl"
            placeholder="E.G. NEURAL NETS 101" required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-black uppercase mb-2 italic">Clearance Level</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border-4 border-black p-5 font-black uppercase bg-white outline-none cursor-pointer appearance-none hover:bg-gray-50 text-xl"
          >
            <option value="6-8">Class 6-8 (Junior Agent)</option>
            <option value="9-12">Class 9-12 (Senior Agent)</option>
            <option value="College">College (Elite Operative)</option>
          </select>
        </div>

        <div className="mb-12">
          <label className="block text-sm font-black uppercase mb-2 italic">Notion Data Hub URL</label>
          <input 
            type="url" value={notionUrl} onChange={(e) => setNotionUrl(e.target.value)}
            className="w-full border-4 border-black p-5 font-black outline-none focus:bg-yellow-50"
            placeholder="HTTPS://NOTION.SITE/..." required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-6 font-black uppercase tracking-widest text-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          TRANSMIT DATA
        </button>
      </form>
    </div>
  );
}