"use client";
import React, { useEffect, useState } from 'react';
import ActivityGrid from './ActivityGrid';

export default function StudentAnalytics() {
  const [data, setData] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const userData = await res.json();
      setData(userData);
    };
    fetchProfile();
  }, []);

  if (!data) return <div className="p-10 font-black text-4xl italic animate-pulse">EXTRACTING_STATS...</div>;

  const testHistory = data.stats?.testHistory || [];

  return (
    <div className="max-w-5xl font-mono">
      <h2 className="text-6xl font-black uppercase mb-12 italic tracking-tighter">
        The <span className="bg-green-400 px-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">Dossier</span>
      </h2>
      
      <ActivityGrid activityLog={data.stats?.activityLog || []} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="border-[6px] border-black p-8 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <h3 className="font-black text-xs uppercase mb-2 underline">Missions Accomplished</h3>
          <p className="text-7xl font-black italic">{testHistory.length}</p>
        </div>
        <div className="border-[6px] border-black p-8 bg-pink-500 text-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rotate-1">
          <h3 className="font-black text-xs uppercase mb-2 underline">Neural Streak</h3>
          <p className="text-7xl font-black italic">{data.stats?.activityDays || 0}</p>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="text-3xl font-black uppercase mb-8 italic inline-block border-b-8 border-black">Evaluation Logs</h3>
        <div className="grid grid-cols-1 gap-6">
          {testHistory.length > 0 ? (
            testHistory.map((test: any, i: number) => (
              <div key={i} className="flex items-center justify-between border-[4px] border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 transition-colors">
                <div>
                  <h4 className="font-black uppercase text-2xl italic tracking-tighter">{test.testName}</h4>
                  <p className="text-xs font-black text-gray-400 uppercase">TIMESTAMP: {new Date(test.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black italic text-blue-600 leading-none mb-2">{test.score}%</div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 border-2 border-black ${test.score >= 70 ? 'bg-green-400' : 'bg-red-500 text-white'}`}>
                    {test.score >= 70 ? 'ELITE' : 'CRITICAL RE-SYNC'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="border-[6px] border-dashed border-black p-20 text-center font-black text-4xl text-gray-300 uppercase italic">
              No Data Recovered
            </div>
          )}
        </div>
      </div>
    </div>
  );
}