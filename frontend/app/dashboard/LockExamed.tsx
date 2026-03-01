"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function LockedExam({ test, onFinish }: { test: any, onFinish: () => void }) {
  if (!test || !test.questions) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center font-black italic animate-pulse">
        INITIALIZING_TEST_DATA...
      </div>
    );
  }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(test.questions.length).fill(-1))
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Force Fullscreen
    if (containerRef.current?.requestFullscreen) containerRef.current.requestFullscreen();

    // 2. Timer Logic
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
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
    await fetch("http://localhost:5050/api/tests/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ testId: test._id, answers: selectedAnswers }),
    });
    alert("⌛ Time is up! Test submitted automatically.");
    onFinish();
  };

  const currentQ = test.questions[currentIndex];

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-[9999] p-10 flex flex-col font-sans text-black overflow-y-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b-8 border-black pb-4 mb-10">
        <h2 className="text-3xl font-black uppercase italic">{test.title}</h2>
        <div className="bg-black text-white px-8 py-3 text-3xl font-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(34,211,238,1)]">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <div className="border-4 border-black p-10 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white relative">
          <span className="absolute -top-5 -left-5 bg-yellow-300 border-4 border-black px-4 py-2 font-black text-xl italic">
            Q {currentIndex + 1} / {test.questions.length}
          </span>

          <h3 className="text-2xl font-black uppercase mb-10 mt-4 leading-tight">
            {currentQ.questionText}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentQ.options.map((opt: string, i: number) => (
              <button 
                key={i}
                onClick={() => handleSelect(i)}
                className={`text-left p-6 border-4 border-black rounded-2xl font-bold transition-all ${selectedAnswers[currentIndex] === i ? 'bg-black text-white scale-[1.02] shadow-[4px_4px_0px_0px_rgba(34,211,238,1)]' : 'bg-white hover:bg-gray-50'}`}
              >
                <span className="text-xs font-black uppercase mr-3 opacity-50">[{i + 1}]</span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between items-center mt-12 mb-20">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="border-4 border-black px-8 py-4 font-black uppercase disabled:opacity-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
          >
            Previous
          </button>
          
          {currentIndex === test.questions.length - 1 ? (
            <button 
              onClick={handleAutoSubmit}
              className="bg-green-400 border-4 border-black px-12 py-4 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-green-500"
            >
              FINISH & SUBMIT
            </button>
          ) : (
            <button 
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="bg-black text-white border-4 border-black px-12 py-4 font-black uppercase shadow-[4px_4px_0px_0px_rgba(34,211,238,1)]"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}