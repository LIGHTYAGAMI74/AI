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

  if (!data) return <div className="p-10 font-black italic animate-pulse">SYNCING_DATA...</div>;

  const testHistory = data.stats?.testHistory || [];

  return (
    <div className="max-w-5xl">
      <h2 className="text-4xl font-black uppercase mb-10 italic underline decoration-blue-500 decoration-8 underline-offset-8">
        Performance Metrics
      </h2>
      
      <ActivityGrid activityLog={data.stats?.activityLog || []} />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="border-4 border-black p-6 rounded-3xl bg-yellow-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-[10px] uppercase mb-1">Total Challenges Met</h3>
          <p className="text-5xl font-black italic">{testHistory.length}</p>
        </div>
        <div className="border-4 border-black p-6 rounded-3xl bg-green-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-[10px] uppercase mb-1">Consistency Days</h3>
          <p className="text-5xl font-black italic">{data.stats?.activityDays || 0}</p>
        </div>
      </div>

      {/* DETAILED SCORE LIST */}
      <div className="mt-12">
        <h3 className="text-xl font-black uppercase mb-6 italic">Evaluation History</h3>
        <div className="grid grid-cols-1 gap-4">
          {testHistory.length > 0 ? (
            testHistory.map((test: any, i: number) => (
              <div key={i} className="flex items-center justify-between border-4 border-black p-6 rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <h4 className="font-black uppercase text-lg">{test.testName}</h4>
                  <p className="text-[10px] font-bold text-gray-400">
                    LAST ATTEMPT: {new Date(test.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black italic text-blue-600">{test.score}%</div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black rounded-md ${test.score >= 70 ? 'bg-green-200' : 'bg-red-200'}`}>
                    {test.score >= 70 ? 'Optimal' : 'Needs Review'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="border-4 border-dashed border-black p-10 text-center font-black text-gray-400 uppercase">
              No Evaluation Data Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}