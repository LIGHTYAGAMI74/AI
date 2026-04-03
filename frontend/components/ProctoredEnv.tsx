"use client";

import React, { useEffect, useState, useRef } from "react";

export default function ProctoredEnv({ module, onExit }: any) {
  const [stage, setStage] = useState<"disclaimer" | "exam" | "result">("disclaimer");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(module.moduleTestDuration * 60 || 900);
  const [analysis, setAnalysis] = useState<any[]>([]);

  const startTimeRef = useRef<number[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ❌ BLOCK MOBILE
  useEffect(() => {
    if (window.innerWidth < 768) {
      alert("This test is only supported on desktop/laptop.");
      onExit();
    }
  }, []);

  // 🔥 FULLSCREEN + BLOCK KEYS + TAB SWITCH
  useEffect(() => {
    if (stage !== "exam") return;

    document.documentElement.requestFullscreen().catch(() => {});

    const handleVisibility = () => {
      if (document.hidden) {
        alert("Tab switching is not allowed. Test will end.");
        handleSubmit();
      }
    };

    const handleKeys = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === "Tab"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("keydown", handleKeys);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [stage]);

  // 🔥 LOAD QUESTIONS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(module.moduleTestUrl);
        const data = await res.json();

        const pool = Array.isArray(data) ? data : data.questions || [];

        const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 30);

        setQuestions(shuffled);
        setAnswers(new Array(shuffled.length).fill(-1));
        startTimeRef.current = new Array(shuffled.length).fill(Date.now());

      } catch {
        alert("Failed to load questions");
        onExit();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ⏱ TIMER
  useEffect(() => {
    if (stage !== "exam") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage]);

  const handleAnswer = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    let correct = 0;

    const analysisData = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;

      return {
        question: q.question,
        userAnswer: answers[i],
        correctAnswer: q.correctIndex,
        timeTaken: Math.floor((Date.now() - startTimeRef.current[i]!) / 1000),
      };
    });

    setAnalysis(analysisData);

    const score = Math.round((correct / questions.length) * 100);

    try {
      await fetch(`${API_URL}/api/progress/module-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          moduleId: module._id,
          score,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    setStage("result");
  };

  if (loading) return <div className="p-10 font-black">Loading Exam...</div>;

  // ================= DISCLAIMER =================
  if (stage === "disclaimer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono p-6">
        <div className="border-4 border-white p-8 max-w-xl">
          <h2 className="text-2xl font-black mb-4">Exam Instructions</h2>
          <ul className="space-y-2">
            <li>• Fullscreen mandatory</li>
            <li>• No tab switching allowed</li>
            <li>• No keyboard shortcuts</li>
            <li>• Timer will run continuously</li>
          </ul>

          <button
            onClick={() => setStage("exam")}
            className="mt-6 bg-yellow-400 text-black px-6 py-3 font-black border-2 border-black"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  // ================= RESULT =================
  if (stage === "result") {
    return (
      <div className="p-6 font-mono">
        <h2 className="text-3xl font-black mb-6">Result</h2>

        {analysis.map((a, i) => (
          <div key={i} className="border-2 p-4 mb-4">
            <p>{a.question}</p>
            <p>Your Answer: {a.userAnswer}</p>
            <p>Correct: {a.correctAnswer}</p>
            <p>Time: {a.timeTaken}s</p>
          </div>
        ))}

        <button
          onClick={onExit}
          className="mt-6 bg-black text-white px-6 py-3"
        >
          Back
        </button>
      </div>
    );
  }

  // ================= EXAM =================
  return (
    <div className="flex h-screen font-mono">

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="font-black text-xl mb-4">
          Question {current + 1}/{questions.length}
        </h2>

        <p className="mb-6">{questions[current]?.question}</p>

        <div className="space-y-3">
          {questions[current]?.options.map((opt: any, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`block w-full border-2 p-3 ${
                answers[current] === i ? "bg-green-200" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrent((c) => Math.max(c - 1, 0))}>
            Prev
          </button>
          <button onClick={() => setCurrent((c) => Math.min(c + 1, questions.length - 1))}>
            Next
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-red-500 text-white px-6 py-3"
        >
          Submit Test
        </button>
      </div>

      {/* SIDEBAR */}
      <div className="w-64 border-l-4 p-4 overflow-y-auto">
        <h3 className="font-black mb-4">Questions</h3>

        <div className="grid grid-cols-5 gap-2">
          {answers.map((a, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`border-2 p-2 text-xs ${
                a === -1 ? "bg-gray-200" : "bg-green-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 font-black">
          ⏳ {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </div>

        <button
          onClick={onExit}
          className="mt-6 bg-black text-white w-full py-2"
        >
          Exit
        </button>
      </div>

    </div>
  );
}