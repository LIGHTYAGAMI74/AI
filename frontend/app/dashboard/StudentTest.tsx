"use client";

import React, { useEffect, useState } from "react";
import LockedExam from "./LockExamed";

export default function StudentTests() {
  const [tests, setTests] = useState<any[]>([]);
  const [activeTest, setActiveTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tests/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) setTests(data);
      } catch (err) {
        console.error("Test fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  /* EXAM MODE */
  if (activeTest) {
    return (
      <LockedExam
        test={activeTest}
        onFinish={() => setActiveTest(null)}
      />
    );
  }

  /* LOADING */
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen font-mono">
        <h2 className="text-2xl md:text-4xl font-black italic uppercase animate-pulse">
          Syncing Missions...
        </h2>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 font-mono">

      {/* HEADER */}
      <header className="mb-10 md:mb-12">
        <h2 className="text-3xl md:text-6xl font-black text-black uppercase italic tracking-tighter">
          Active{" "}
          <span className="bg-pink-500 text-white px-3 md:px-4 border-4 border-black">
            Missions
          </span>
        </h2>
      </header>

      {/* TEST GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

        {tests.length > 0 ? (
          tests.map((t) => (
            <article
              key={t._id}
              className="group relative border-[6px] border-black p-6 md:p-10 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 transition overflow-hidden"
            >

              {/* BACKGROUND TEXT */}
              <div className="absolute -right-4 -top-4 text-gray-100 font-black text-7xl md:text-9xl opacity-20 pointer-events-none group-hover:text-pink-100 uppercase">
                GO
              </div>

              <h3 className="text-2xl md:text-4xl font-black text-black uppercase italic tracking-tighter mb-4 relative z-10">
                {t.title}
              </h3>

              <div className="inline-block bg-black text-white px-3 py-1 text-[10px] font-black uppercase mb-6 md:mb-8 relative z-10 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
                ⏳ Duration: {t.duration} MIN
              </div>

              <button
                onClick={() => setActiveTest(t)}
                className="w-full bg-blue-600 text-white py-4 md:py-6 border-[4px] border-black font-black uppercase text-lg md:text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition relative z-10 active:translate-y-1 active:shadow-none"
              >
                START MISSION ↗
              </button>

            </article>
          ))
        ) : (
          <div className="col-span-full border-[6px] border-dashed border-black p-10 md:p-20 text-center">
            <h3 className="font-black text-2xl md:text-4xl italic text-gray-300 uppercase">
              No Active Missions
            </h3>
          </div>
        )}

      </section>

    </main>
  );
}