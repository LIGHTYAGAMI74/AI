import React from "react";

interface ActivityProps {
  activityLog: string[];
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export function calculateStreak(activityLog: string[] = []) {
  let streak = 0;
  let current = new Date();

  while (true) {
    const dateStr = formatDate(current);
    if (activityLog.includes(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else break;
  }

  return streak;
}

export default function ActivityGrid({ activityLog = [] }: ActivityProps) {
  const today = new Date();

  const days = Array.from({ length: 100 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return formatDate(d);
  }).reverse();

  const streak = calculateStreak(activityLog);

  return (
    <div className="border-[6px] border-black p-8 bg-white shadow-[12px_12px_0px_black] mb-10 -rotate-1">

      {/* HEADER */}
      <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
        <div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter bg-yellow-400 px-4 py-1 border-2 border-black inline-block -rotate-2">
            Consistency Graph
          </h3>
          <p className="text-xs font-black uppercase tracking-widest mt-2">
            Neural Commitment Log
          </p>
        </div>

        <div className="text-right bg-black text-white p-4 rotate-3 border-2 border-white shadow-[4px_4px_0px_blue]">
          <span className="text-4xl font-black italic leading-none">
            {streak}
          </span>
          <p className="text-[10px] font-black uppercase">Day Streak</p>
        </div>
      </div>

      {/* GRID */}
      <div className="flex flex-wrap gap-2">
        {days.map((date) => {
          const isActive = date ? activityLog.includes(date) : false;
          const isToday = date === formatDate(today);

          return (
            <div
              key={date}
              title={date}
              className={`
                w-5 h-5 border-[3px] transition-all duration-200
                ${isActive 
                  ? "bg-blue-500 border-black scale-110 shadow-[3px_3px_0px_black]" 
                  : "bg-white border-black/10 hover:bg-yellow-100 hover:border-black"}
                ${isToday && "ring-2 ring-red-500"}
              `}
            />
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="mt-8 flex items-center gap-4 bg-gray-100 p-3 border-2 border-black">
        <span className="text-[10px] font-black uppercase">Low</span>

        <div className="flex gap-1">
          <div className="w-4 h-4 border-2 border-black bg-white" />
          <div className="w-4 h-4 border-2 border-black bg-blue-200" />
          <div className="w-4 h-4 border-2 border-black bg-blue-400" />
          <div className="w-4 h-4 border-2 border-black bg-blue-600" />
        </div>

        <span className="text-[10px] font-black uppercase">High</span>
      </div>
    </div>
  );
}