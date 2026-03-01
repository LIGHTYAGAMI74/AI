
import React from 'react';

interface ActivityProps {
  activityLog: string[]; // Expected format: ["2026-03-01", "2026-02-28"]
}

export default function ActivityGrid({ activityLog = [] }: ActivityProps) {
  // 1. Generate the last 100 days for the grid
  const today = new Date();
  const days = Array.from({ length: 100 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse(); // Reverse so the most recent day is at the end

  return (
    <div className="border-4 border-black p-8 rounded-[40px] bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Consistency Graph</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Neural Commitment Log</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black italic">{activityLog.length}</span>
          <span className="text-xs font-black uppercase ml-2 text-blue-600">Total Commits</span>
        </div>
      </div>

      {/* THE GRID */}
      <div className="flex flex-wrap gap-2">
        {days.map((date) => {
          const isActive = activityLog.includes(date);
          return (
            <div
              key={date}
              title={date}
              className={`
                w-5 h-5 rounded-md border-2 transition-all duration-300
                ${isActive 
                  ? 'bg-black border-black scale-110 shadow-[3px_3px_0px_0px_rgba(59,130,246,1)]' 
                  : 'bg-white border-gray-100 hover:border-black hover:scale-105'
                }
              `}
            />
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="mt-8 flex items-center gap-4">
        <span className="text-[10px] font-black uppercase text-gray-400">Low Activity</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 border-2 border-gray-100 bg-white rounded-sm" />
          <div className="w-3 h-3 border-2 border-gray-300 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 border-2 border-black bg-gray-500 rounded-sm" />
          <div className="w-3 h-3 border-2 border-black bg-black rounded-sm shadow-[1px_1px_0px_0px_rgba(59,130,246,1)]" />
        </div>
        <span className="text-[10px] font-black uppercase text-gray-400">Peak Performance</span>
      </div>
    </div>
  );
}