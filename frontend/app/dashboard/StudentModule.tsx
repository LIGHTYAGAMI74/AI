"use client";

import React, { useEffect, useState } from "react";

export default function StudentModules() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/module/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (Array.isArray(data)) setModules(data);
      } catch (err) {
        console.error("Module fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleModuleClick = async (module: any) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_URL}/api/auth/log-activity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Activity log failed");
    }

    window.open(module.notionUrl, "_blank");
  };

  /* LOADING SCREEN */
  if (loading)
    return (
      <main className="flex items-center justify-center min-h-screen font-mono">
        <h2 className="text-2xl md:text-4xl font-black italic uppercase animate-pulse">
          Opening Archives...
        </h2>
      </main>
    );

  return (
    <main className="max-w-6xl mx-auto px-4 font-mono text-black">

      {/* HEADER */}
      <header className="mb-12 md:mb-16">
        <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter">
          Knowledge{" "}
          <span className="bg-yellow-400 px-3 md:px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block">
            Vault
          </span>
        </h2>
      </header>

      {/* MODULE GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

        {modules.length > 0 ? (
          modules.map((m) => (
            <article
              key={m._id}
              className="border-[6px] border-black p-6 md:p-10 bg-white shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] hover:-rotate-1 transition-transform"
            >

              <div className="h-2 w-full bg-black mb-5 md:mb-6" />

              <h3 className="text-xl md:text-3xl font-black uppercase mb-4 md:mb-6 leading-tight italic">
                {m.title}
              </h3>

              <p className="text-black font-bold mb-6 md:mb-10 text-xs md:text-sm bg-gray-100 p-3 md:p-4 border-2 border-black">
                {m.description ||
                  "TOP SECRET TRAINING DATA FOR NEURAL OPERATIVES."}
              </p>

              <button
                onClick={() => handleModuleClick(m)}
                className="w-full bg-pink-500 text-white px-6 md:px-8 py-4 md:py-5 border-[4px] border-black font-black uppercase text-sm md:text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all"
              >
                ACCESS DATA ↗
              </button>

            </article>
          ))
        ) : (
          <div className="col-span-full border-[6px] md:border-[8px] border-dashed border-black p-10 md:p-20 text-center">

            <h4 className="font-black text-2xl md:text-5xl text-gray-300 italic uppercase">
              Archives Empty
            </h4>

          </div>
        )}

      </section>

    </main>
  );
}