"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function LockedExam({ test, onFinish }: { test: any, onFinish: () => void }) {
  if (!test || !test.questions) return <div className="fixed inset-0 bg-yellow-400 z-[9999] flex items-center justify-center font-black text-6xl italic animate-bounce">SYNCING...</div>;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(test.questions.length).fill(-1))
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current?.requestFullscreen) containerRef.current.requestFullscreen();
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => { if (prev <= 1) { handleAutoSubmit(); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleAutoSubmit = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ testId: test._id, answers: selectedAnswers }),
    });
    onFinish();
  };

  const currentQ = test.questions[currentIndex];

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-[9999] p-10 flex flex-col font-mono text-black">
      <div className="flex justify-between items-center border-b-[8px] border-black pb-6 mb-12">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter bg-black text-white px-6 py-2 -rotate-1">{test.title}</h2>
        <div className="bg-yellow-400 border-[6px] border-black px-10 py-4 text-5xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full">
        <div className="border-[6px] border-black p-12 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-pink-500 text-white border-b-4 border-l-4 border-black px-6 py-2 font-black text-2xl italic">
            Q {currentIndex + 1} / {test.questions.length}
          </div>

          <h3 className="text-4xl font-black uppercase mb-16 leading-none tracking-tighter">
            {currentQ.questionText}
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {currentQ.options.map((opt: string, i: number) => (
              <button 
                key={i}
                onClick={() => handleSelect(i)}
                className={`text-left p-8 border-[4px] border-black font-black text-2xl transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${selectedAnswers[currentIndex] === i ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                <span className="mr-6 opacity-50 underline">0{i + 1}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-16 mb-12">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="border-4 border-black px-12 py-5 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white disabled:opacity-20"
          >
            PREV
          </button>
          
          {currentIndex === test.questions.length - 1 ? (
            <button 
              onClick={handleAutoSubmit}
              className="bg-green-500 border-4 border-black px-16 py-5 font-black uppercase text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600"
            >
              FINISH MISSION
            </button>
          ) : (
            <button 
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="bg-black text-white border-4 border-black px-16 py-5 font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]"
            >
              NEXT DATA POINT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}