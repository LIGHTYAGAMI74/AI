"use client";
import React, { useEffect, useState } from 'react';

export default function StudentModules() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/module/all`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setModules(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchModules();
  }, []);

  const handleModuleClick = async (module: any) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/auth/log-activity`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    });
    window.open(module.notionUrl, "_blank");
  };

  if (loading) return <div className="font-black text-4xl italic animate-pulse uppercase">Opening Archives...</div>;

  return (
    <div className="max-w-5xl font-mono">
      <h2 className="text-6xl font-black uppercase mb-16 italic tracking-tighter">
        Knowledge <span className="bg-yellow-400 px-4 border-4 border-black -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">Vault</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {modules.length > 0 ? (
          modules.map((m) => (
            <div key={m._id} className="border-[6px] border-black p-10 bg-white shadow-[15px_15px_0px_0px_rgba(59,130,246,1)] hover:-rotate-1 transition-transform">
              <div className="h-2 w-full bg-black mb-6" />
              <h3 className="text-3xl font-black uppercase mb-6 leading-none italic">{m.title}</h3>
              <p className="text-black font-bold mb-10 text-sm bg-gray-100 p-4 border-2 border-black">
                {m.description || "TOP SECRET TRAINING DATA FOR NEURAL OPERATIVES."}
              </p>
              <button 
                onClick={() => handleModuleClick(m)} 
                className="w-full bg-pink-500 text-white px-8 py-5 border-[4px] border-black font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all"
              >
                ACCESS DATA ↗
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-2 border-[8px] border-dashed border-black p-20 text-center">
            <h4 className="font-black text-5xl text-gray-200 italic uppercase">Archives Empty</h4>
          </div>
        )}
      </div>
    </div>
  );
}