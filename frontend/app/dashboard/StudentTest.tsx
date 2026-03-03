"use client";
import React, { useEffect, useState } from 'react';
import LockedExam from './LockExamed'; 

export default function StudentTests() {
  const [tests, setTests] = useState<any[]>([]);
  const [activeTest, setActiveTest] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTests = async () => {
      const res = await fetch(`${API_URL}/api/tests/all`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setTests(data);
    };
    fetchTests();
  }, []);

  if (activeTest) {
    return <LockedExam test={activeTest} onFinish={() => setActiveTest(null)} />;
  }

  return (
    <div className="max-w-5xl font-mono">
      <h2 className="text-6xl font-black uppercase mb-12 italic tracking-tighter">
        Active <span className="bg-pink-500 text-white px-4 border-4 border-black">Missions</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {tests.map((t) => (
          <div key={t._id} className="group relative border-[6px] border-black p-10 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 transition-all overflow-hidden">
            {/* Action text background decoration */}
            <div className="absolute -right-4 -top-4 text-gray-100 font-black text-9xl opacity-20 pointer-events-none group-hover:text-pink-100 uppercase">
              GO!
            </div>

            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4 relative z-10">{t.title}</h3>
            <div className="inline-block bg-black text-white px-3 py-1 text-[10px] font-black uppercase mb-8 relative z-10 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
              ⏳ Duration: {t.duration} MIN
            </div>

            <button 
              onClick={() => setActiveTest(t)}
              className="w-full bg-blue-600 text-white py-6 border-[4px] border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all relative z-10 active:translate-y-1 active:shadow-none"
            >
              START MISSION ↗
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}