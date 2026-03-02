"use client";
import React, { useEffect, useState } from 'react';
import LockedExam from './LockExamed'; // We will create this next

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
    <div className="max-w-5xl">
      <h2 className="text-4xl font-black uppercase mb-10 italic underline decoration-4 underline-offset-8">Available Mock Tests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tests.map((t) => (
          <div key={t._id} className="border-4 border-black p-8 rounded-3xl bg-yellow-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase mb-2">{t.title}</h3>
            <p className="font-bold text-gray-500 mb-6 uppercase text-xs tracking-widest">⏳ Duration: {t.duration} Minutes</p>
            <button 
              onClick={() => setActiveTest(t)}
              className="w-full bg-black text-white py-4 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] hover:bg-gray-800 transition-all"
            >
              Initiate Exam Protocol
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}