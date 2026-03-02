"use client";
import React, { useEffect, useState } from 'react';

export default function StudentModules() {
  // 1. Always initialize as an empty array
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/module/all`, {
          headers: { 
            "Authorization": `Bearer ${token}` // 2. MUST send token now
          }
        });
        const data = await res.json();

        // 3. SAFETY CHECK: Only set state if data is an array
        if (Array.isArray(data)) {
          setModules(data);
        } else {
          console.error("Received non-array data:", data);
          setModules([]); // Reset to empty array to prevent .map error
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
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

  if (loading) return <div className="font-black italic animate-pulse">LOADING_MODULES...</div>;

  return (
    <div className="max-w-5xl">
      <h2 className="text-4xl font-black uppercase mb-10 italic underline decoration-blue-500 decoration-8 underline-offset-8">
        Learning Modules
      </h2>

      {/* 4. Extra safety check before mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules && modules.length > 0 ? (
          modules.map((m) => (
            <div key={m._id} className="border-4 border-black p-8 rounded-3xl bg-blue-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <h3 className="text-2xl font-black uppercase mb-4 leading-tight">{m.title}</h3>
              <p className="text-gray-600 font-bold mb-6 text-sm italic">{m.description || "Deep dive into AI."}</p>
              <button 
                onClick={() => handleModuleClick(m)} 
                className="bg-black text-white px-8 py-3 font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] active:shadow-none active:translate-y-1 transition-all"
              >
                Open Notion Hub ↗
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-2 border-4 border-dashed border-black p-10 text-center font-black uppercase text-gray-400">
            No modules found for your level yet.
          </div>
        )}
      </div>
    </div>
  );
}