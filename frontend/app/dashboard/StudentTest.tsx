"use client";

import React, { useEffect, useState } from "react";
import ProctoredEnv from "@/components/ProctoredEnv"; // 🔥 IMPORTANT
import { getModuleTests } from "@/services/module";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth";

export default function StudentTests() {
  const router = useRouter();
  const [modules, setModules] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any>({
    "6-8": [],
    "9-10": [],
    "11-12": [],
  });

  const [activeTest, setActiveTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const levelMap: Record<string, string> = {
    "6-8": "1",
    "9-10": "2",
    "11-12": "3",
  };

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile();
      setUser(profile);
    };
    load();
  }, []);

  // 🔥 FETCH MODULE TESTS
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModuleTests();

        // 🔥 GROUP BY LEVEL
        const groupedData: Record<string, any[]> = {
          "6-8": [],
          "9-10": [],
          "11-12": [],
        };

        data.forEach((m: any) => {
          if (groupedData[m.level]) {
            groupedData[m.level]!.push(m);
          }
        });

        setModules(data);
        setGrouped(groupedData);

      } catch (err) {
        console.error("Module test fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  /* 🔒 PROCTORED MODE */
  if (activeTest) {
    return (
      <ProctoredEnv
        module={activeTest}
        onExit={() => setActiveTest(null)}
      />
    );
  }

  /* LOADING */
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen font-mono">
        <h2 className="text-2xl md:text-4xl font-black italic uppercase animate-pulse">
          Syncing Test Modules...
        </h2>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 font-mono">

      {/* HEADER */}
      <header className="mb-10 md:mb-12">
        <h2 className="text-3xl md:text-6xl font-black text-black uppercase italic tracking-tighter">
          Module{" "}
          <span className="bg-pink-500 text-white px-3 md:px-4 border-4 border-black">
            Tests 
            <span className="ml-2 inline-block animate-pulse"></span>
          </span>
        </h2>
      </header>

      {/* LEVEL-WISE SECTIONS */}
      {["6-8", "9-10", "11-12"].map((level) => {
        if (!grouped[level]?.length) return null;

        return (
          <section key={level} className="mb-12">

            <h3 className="text-2xl md:text-4xl font-black uppercase border-b-4 border-black pb-2 mb-6">
              Level {levelMap[level]}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

              {grouped[level].map((m: any) => {
                const totalQuestions = m.moduleTestQuestions || 30;

                // ⏱ 30 sec per question → minutes
                const durationMinutes = Math.ceil((totalQuestions * 30) / 60);

                const testData = user?.stats?.testHistory?.find(
                  (t: any) => t.moduleId === m._id
                );

                return (
                  <article
                    key={m._id}
                    className="group relative border-[6px] border-black p-6 md:p-10 bg-white shadow-[12px_12px_0px_black] hover:bg-yellow-400 transition overflow-hidden"
                  >

                    {/* BACKGROUND TEXT */}
                    <div className="absolute -right-4 -top-4 text-gray-400 px-4 py-2 font-black text-7xl md:text-9xl opacity-20 pointer-events-none uppercase">
                      {testData ? `${testData.bestScore}%` : "AI"}
                    </div>

                    <h3 className="text-2xl md:text-4xl font-black uppercase italic mb-4 relative z-10">
                      {m.title}
                    </h3>

                    {/* META */}
                    <div className="flex flex-wrap gap-3 mb-6 relative z-10">

                      <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase border-2 border-black">
                        🧠 {totalQuestions} Questions
                      </span>

                      <span className="bg-blue-500 text-white px-3 py-1 text-[10px] font-black uppercase border-2 border-black">
                        ⏳ {durationMinutes} MIN
                      </span>

                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => router.push(`/test/${m._id}`)}
                      className="w-full bg-blue-600 text-white py-4 md:py-6 border-[4px] border-black font-black uppercase text-lg md:text-xl shadow-[8px_8px_0px_black] hover:bg-white hover:text-black transition active:translate-y-1 active:shadow-none relative z-10"
                    >
                      START MODULE TEST ↗
                    </button>

                  </article>
                );
              })}

            </div>

          </section>
        );
      })}

      {/* EMPTY */}
      {modules.length === 0 && (
        <div className="border-[6px] border-dashed border-black p-10 md:p-20 text-center">
          <h3 className="font-black text-2xl md:text-4xl italic text-gray-300 uppercase">
            No Module Tests Available
          </h3>
        </div>
      )}

    </main>
  );
}