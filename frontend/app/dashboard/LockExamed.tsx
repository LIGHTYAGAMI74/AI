"use client";

import React, { useEffect, useState, useRef } from "react";

export default function LockedExam({
  test,
  onFinish,
}: {
  test: any;
  onFinish: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(test.questions.length).fill(-1)
  );

  const [timeLeft, setTimeLeft] = useState(test.duration * 60);

  /* ---------------- FULLSCREEN ---------------- */

  useEffect(() => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  }, []);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------- BLOCK REFRESH ---------------- */

  useEffect(() => {
    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", preventClose);

    return () => window.removeEventListener("beforeunload", preventClose);
  }, []);

  /* ---------------- TAB SWITCH DETECT ---------------- */

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        alert("Tab switch detected. Exam will auto submit.");
        submitExam();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* ---------------- SELECT ANSWER ---------------- */

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  /* ---------------- SUBMIT ---------------- */

  const submitExam = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testId: test._id,
          answers: selectedAnswers,
        }),
      });
    } catch (err) {
      console.error("Submit failed");
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    onFinish();
  };

  /* ---------------- EMERGENCY EXIT ---------------- */

  const emergencyExit = async () => {
    if (confirm("Emergency exit will submit the exam. Continue?")) {
      await submitExam();
    }
  };

  const currentQ = test.questions[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-white text-black z-[9999] p-6 md:p-10 flex flex-col font-mono"
    >

      {/* HEADER */}
      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">

        <h2 className="text-xl md:text-3xl font-black uppercase">
          {test.title}
        </h2>

        <div className="bg-yellow-300 border-4 border-black px-4 py-2 text-xl md:text-2xl font-black">
          {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

      </div>

      {/* QUESTION */}
      <div className="flex-1 max-w-4xl mx-auto w-full">

        <h3 className="text-lg md:text-2xl font-black mb-6">
          {currentQ.questionText}
        </h3>

        <div className="grid grid-cols-1 gap-4">

          {currentQ.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`border-4 border-black p-4 text-left font-black text-black
              ${
                selectedAnswers[currentIndex] === i
                  ? "bg-blue-200"
                  : "bg-white"
              }`}
            >
              {opt}
            </button>
          ))}

        </div>

      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between mt-8">

        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="border-4 border-black px-6 py-3 font-black"
        >
          PREV
        </button>

        {currentIndex === test.questions.length - 1 ? (
          <button
            onClick={submitExam}
            className="bg-green-400 border-4 border-black px-6 py-3 font-black"
          >
            FINISH
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="bg-black text-white border-4 border-black px-6 py-3 font-black"
          >
            NEXT
          </button>
        )}

      </div>

      {/* EMERGENCY EXIT */}
      <button
        onClick={emergencyExit}
        className="fixed bottom-6 right-6 bg-red-600 text-white border-4 border-black px-6 py-3 font-black"
      >
        EMERGENCY EXIT
      </button>

    </div>
  );
}