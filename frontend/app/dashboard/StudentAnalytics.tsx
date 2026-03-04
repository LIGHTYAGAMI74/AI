"use client";

import React, { useEffect, useState } from "react";
import ActivityGrid from "./ActivityGrid";

export default function StudentAnalytics() {
  const [data, setData] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = await res.json();
        setData(userData);
      } catch (err) {
        console.error("Profile fetch failed");
      }
    };

    fetchProfile();
  }, []);

  /* LOADING STATE */
  if (!data)
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#fffbeb] font-mono">
        <div className="text-2xl md:text-4xl font-black italic animate-pulse">
          EXTRACTING_STATS...
        </div>
      </main>
    );

  const testHistory = data.stats?.testHistory || [];

  return (
    <main className="max-w-6xl mx-auto px-4 font-mono text-black">

      {/* PAGE HEADER */}
      <header className="mb-12">
        <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter">
          The{" "}
          <span className="bg-green-400 px-3 md:px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            Dossier
          </span>
        </h2>
      </header>

      {/* ACTIVITY GRID */}
      <section>
        <ActivityGrid activityLog={data.stats?.activityLog || []} />
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10">

        <div className="border-[6px] border-black p-6 md:p-8 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-xs uppercase mb-2 underline">
            Missions Accomplished
          </h3>
          <p className="text-5xl md:text-7xl font-black italic">
            {testHistory.length}
          </p>
        </div>

        <div className="border-[6px] border-black p-6 md:p-8 bg-pink-500 text-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-xs uppercase mb-2 underline">
            Neural Streak
          </h3>
          <p className="text-5xl md:text-7xl font-black italic">
            {data.stats?.activityDays || 0}
          </p>
        </div>

      </section>

      {/* TEST HISTORY */}
      <section className="mt-16">

        <h3 className="text-xl md:text-3xl font-black uppercase mb-6 md:mb-8 italic inline-block border-b-8 border-black">
          Evaluation Logs
        </h3>

        <div className="grid grid-cols-1 gap-5 md:gap-6">

          {testHistory.length > 0 ? (
            testHistory.map((test: any, i: number) => (
              <article
                key={i}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-[4px] border-black p-5 md:p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 transition"
              >

                <div>
                  <h4 className="font-black uppercase text-lg md:text-2xl italic tracking-tighter">
                    {test.testName}
                  </h4>

                  <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase">
                    Timestamp: {new Date(test.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-3xl md:text-5xl font-black italic text-blue-600 leading-none mb-1 md:mb-2">
                    {test.score}%
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 border-2 border-black ${
                      test.score >= 70
                        ? "bg-green-400"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {test.score >= 70 ? "ELITE" : "CRITICAL RE-SYNC"}
                  </span>
                </div>

              </article>
            ))
          ) : (
            <div className="border-[6px] border-dashed border-black p-10 md:p-20 text-center font-black text-xl md:text-3xl text-gray-300 uppercase italic">
              No Data Recovered
            </div>
          )}

        </div>

      </section>

    </main>
  );
}