"use client";

import React, { useEffect, useState, useRef } from "react";
import { submitModuleTest } from "@/services/activity";

export default function ProctoredEnv({ module, onExit }: any) {
  const [stage, setStage] = useState<
    "disclaimer" | "exam" | "result" | "blocked"
  >("disclaimer");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [reviewMarked, setReviewMarked] = useState<boolean[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(
    (module.moduleTestDuration || 15) * 60
  );

  const [analysis, setAnalysis] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [analysisIndex, setAnalysisIndex] = useState(0);

  const cumulativeTimeRef = useRef<number[]>([]);
  const questionEnteredAtRef = useRef<number>(0);
  const isSubmittingRef = useRef(false);
  const isBlockedRef = useRef(false);

  const formatTime = (t: number) => {
    const safe = Number.isFinite(t) ? Math.max(0, t) : 0;
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const addCurrentQuestionTime = () => {
    if (stage !== "exam") return;

    const startedAt = questionEnteredAtRef.current;
    if (!startedAt) {
      questionEnteredAtRef.current = Date.now();
      return;
    }

    const elapsedSeconds = Math.max(
      0,
      Math.floor((Date.now() - startedAt) / 1000)
    );

    cumulativeTimeRef.current[current] =
      (cumulativeTimeRef.current[current] || 0) + elapsedSeconds;

    questionEnteredAtRef.current = Date.now();
  };

  const goToQuestion = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= questions.length) return;
    addCurrentQuestionTime();
    setCurrent(nextIndex);
  };

  const exitExam = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
    onExit();
  };

  // ❌ BLOCK MOBILE
  useEffect(() => {
    if (window.innerWidth < 768) {
      alert("Use a laptop/desktop to attempt this test.");
      onExit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔥 TRY FULLSCREEN EARLY
  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  // 🔥 BLOCK AS MANY KEYBOARD SHORTCUTS AS THE BROWSER WILL ALLOW
  useEffect(() => {
    const blockKey = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const blockMouse = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const listeners: Array<[string, EventListenerOrEventListenerObject, boolean?]> =
      [
        ["keydown", blockKey, true],
        ["keyup", blockKey, true],
        ["keypress", blockKey, true],
        ["contextmenu", blockMouse, true],
        ["copy", blockMouse, true],
        ["cut", blockMouse, true],
        ["paste", blockMouse, true],
        ["selectstart", blockMouse, true],
        ["dragstart", blockMouse, true],
      ];

    listeners.forEach(([name, fn, capture]) => {
      document.addEventListener(name, fn as EventListener, capture);
      window.addEventListener(name, fn as EventListener, capture);
    });

    return () => {
      listeners.forEach(([name, fn, capture]) => {
        document.removeEventListener(name, fn as EventListener, capture);
        window.removeEventListener(name, fn as EventListener, capture);
      });
    };
  }, []);

  // 🔥 IF USER LEAVES FULLSCREEN DURING EXAM => BLOCKED, NO RESULT
  useEffect(() => {
    const handleFullscreenExit = () => {
      if (stage === "exam" && !document.fullscreenElement) {
        isBlockedRef.current = true;
        setStage("blocked");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenExit);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [stage]);

  // 🔥 LOAD QUESTIONS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(module.moduleTestUrl);
        const data = await res.json();

        const pool = Array.isArray(data) ? data : data?.questions || [];
        const shuffled = [...pool]
          .sort(() => 0.5 - Math.random())
          .slice(0, module.moduleTestQuestions || 30);

        setQuestions(shuffled);
        setAnswers(new Array(shuffled.length).fill(-1));
        setReviewMarked(new Array(shuffled.length).fill(false));
        cumulativeTimeRef.current = new Array(shuffled.length).fill(0);
      } catch {
        alert("Failed to load questions");
        onExit();
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⏱ START TIMER FOR CURRENT QUESTION
  useEffect(() => {
    if (stage === "exam") {
      questionEnteredAtRef.current = Date.now();
    }
  }, [current, stage]);

  // ⏱ GLOBAL TIMER
  useEffect(() => {
    if (stage !== "exam") return;

    const timer = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const handleAnswer = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const handleToggleReview = () => {
    const updated = [...reviewMarked];
    updated[current] = !updated[current];
    setReviewMarked(updated);
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current || isBlockedRef.current) return;
    isSubmittingRef.current = true;

    addCurrentQuestionTime();

    let correct = 0;

    const analysisData = questions.map((q, i) => {
      const optionList = Array.isArray(q?.options) ? q.options : [];
      const correctIndex = Number.isFinite(Number(q?.correctIndex))
        ? Number(q.correctIndex)
        : 0;
      const userIndex = answers[i] ?? -1;

      const isCorrect = userIndex === correctIndex;
      if (isCorrect) correct++;

      return {
        question: q?.question || "",
        userAnswer: userIndex,
        correctAnswer: correctIndex,
        userOptionText:
          userIndex === -1 || !optionList[userIndex]
            ? "Not Attempted"
            : String(optionList[userIndex]),
        correctOptionText:
          optionList[correctIndex] !== undefined
            ? String(optionList[correctIndex])
            : "N/A",
        timeTaken: Number.isFinite(cumulativeTimeRef.current[i])
          ? cumulativeTimeRef.current[i]
          : 0,
        markedForReview: !!reviewMarked[i],
      };
    });

    const finalScore =
      questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    setScore(Number.isFinite(finalScore) ? finalScore : 0);
    setAnalysis(analysisData);
    setAnalysisIndex(0);

    try {
      await submitModuleTest({
        moduleId: module._id,
        score: Number.isFinite(finalScore) ? finalScore : 0,
        moduleTitle: module.title,
      });
    } catch (err) {
      console.error("Submit failed", err);
    }

    setStage("result");
    isSubmittingRef.current = false;
  };

  const handleStartTest = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {}
    setStage("exam");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbeb] font-mono">
        <h2 className="text-2xl font-black">Loading Exam...</h2>
      </div>
    );
  }

  // ================= BLOCKED =================
  if (stage === "blocked") {
    return (
      <div className="min-h-screen bg-[#fffbeb] text-black font-mono flex items-center justify-center p-6">
        <div className="max-w-2xl w-full border-4 border-black bg-white p-8 md:p-10 text-center shadow-[10px_10px_0px_black]">
          <div className="inline-block mb-5 bg-red-500 text-white border-4 border-black px-4 py-2 font-black uppercase">
            Not Allowed
          </div>

          <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">
            You left fullscreen
          </h2>

          <p className="font-bold text-base md:text-lg mb-8 leading-7">
            Your attempt has been cancelled. Please attempt again from the tests page.
          </p>

          <button
            onClick={exitExam}
            className="bg-black text-white px-6 py-3 md:px-8 md:py-4 font-black uppercase border-4 border-black hover:bg-red-600 transition"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  // ================= DISCLAIMER =================
  if (stage === "disclaimer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbeb] text-black font-mono p-6">
        <div className="border-4 border-black bg-white p-8 md:p-10 max-w-3xl w-full text-center shadow-[10px_10px_0px_black]">
          <div className="inline-block mb-5 bg-yellow-400 border-4 border-black px-4 py-2 font-black uppercase">
            Proctored Exam
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase leading-tight">
            Exam Instructions
          </h2>

          <div className="text-left space-y-3 font-bold text-sm md:text-base leading-7 bg-[#fffbeb] border-4 border-black p-5 md:p-6">
            <p>• Stay in fullscreen throughout the test.</p>
            <p>• Leaving fullscreen will cancel your attempt.</p>
            <p>• The timer keeps running continuously.</p>
            <p>• Use only this page during the test.</p>
            <p>• Use a laptop or desktop for the best experience.</p>
          </div>

          <button
            onClick={handleStartTest}
            className="mt-8 bg-yellow-400 text-black px-8 py-4 font-black border-4 border-black hover:bg-red-500 hover:text-white transition"
          >
            START TEST
          </button>
        </div>
      </div>
    );
  }

  // ================= RESULT =================
  if (stage === "result") {
    const safeScore = Number.isFinite(score) ? score : 0;
    const correctCount = analysis.filter(
      (a) => a.userAnswer === a.correctAnswer
    ).length;
    const currentAnalysis = analysis[analysisIndex];

    return (
      <div className="min-h-screen bg-[#fffbeb] text-black font-mono p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">
            Result
          </h2>

          <div className="text-center mb-8">
            <div className="text-7xl md:text-9xl font-black text-green-500 animate-pulse">
              {safeScore}%
            </div>

            <p className="mt-4 text-xl font-bold">
              {safeScore >= 80
                ? "🔥 Excellent!"
                : safeScore >= 50
                ? "👍 Good Job!"
                : "⚠️ Needs Improvement"}
            </p>
          </div>

          <div className="w-full h-6 border-4 border-black bg-white mb-8">
            <div
              className="h-full bg-green-500 transition-all duration-1000"
              style={{ width: `${safeScore}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border-4 border-black bg-white p-4 font-bold">
              Total Questions: {questions.length}
            </div>
            <div className="border-4 border-black bg-white p-4 font-bold">
              Correct: {correctCount}
            </div>
            <div className="border-4 border-black bg-white p-4 font-bold">
              Wrong: {questions.length - correctCount}
            </div>
          </div>

          <div className="border-4 border-black bg-white p-4 md:p-6 shadow-[8px_8px_0px_black]">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h3 className="text-xl md:text-2xl font-black uppercase">
                Question Analysis
              </h3>

              <div className="text-sm font-black bg-yellow-400 border-2 border-black px-3 py-2">
                {analysisIndex + 1}/{analysis.length || 1}
              </div>
            </div>

            {currentAnalysis ? (
              <div className="space-y-5">
                <div className="border-4 border-black bg-[#fffbeb] p-4 md:p-5">
                  <p className="font-black mb-2 uppercase text-xs tracking-widest">
                    Question
                  </p>
                  <p className="text-base md:text-lg font-semibold leading-8">
                    {currentAnalysis.question}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className={`border-4 border-black p-4 md:p-5 ${
                      currentAnalysis.userAnswer === currentAnalysis.correctAnswer
                        ? "bg-green-200"
                        : "bg-red-200"
                    }`}
                  >
                    <p className="font-black uppercase text-xs tracking-widest mb-2">
                      Your Option
                    </p>
                    <p className="font-bold text-base md:text-lg leading-7">
                      {currentAnalysis.userOptionText}
                    </p>
                  </div>

                  <div className="border-4 border-black p-4 md:p-5 bg-blue-100">
                    <p className="font-black uppercase text-xs tracking-widest mb-2">
                      Correct Option
                    </p>
                    <p className="font-bold text-base md:text-lg leading-7">
                      {currentAnalysis.correctOptionText}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-4 border-black bg-white p-4 font-bold">
                    Time Taken: {formatTime(currentAnalysis.timeTaken)}
                  </div>
                  <div className="border-4 border-black bg-white p-4 font-bold">
                    Status:{" "}
                    {currentAnalysis.userAnswer === currentAnalysis.correctAnswer
                      ? "Correct"
                      : currentAnalysis.userAnswer === -1
                      ? "Not Attempted"
                      : "Wrong"}
                  </div>
                  <div className="border-4 border-black bg-white p-4 font-bold">
                    Review: {currentAnalysis.markedForReview ? "Marked" : "No"}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    disabled={analysisIndex === 0}
                    onClick={() => setAnalysisIndex((i) => Math.max(i - 1, 0))}
                    className="bg-yellow-400 text-black px-5 py-3 font-black border-4 border-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-300 transition"
                  >
                    Prev
                  </button>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {analysis.slice(0, 10).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAnalysisIndex(idx)}
                        className={`h-3 w-3 rounded-full border-2 border-black ${
                          analysisIndex === idx ? "bg-black" : "bg-white"
                        }`}
                        aria-label={`Go to analysis ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={analysisIndex === analysis.length - 1}
                    onClick={() =>
                      setAnalysisIndex((i) =>
                        Math.min(i + 1, analysis.length - 1)
                      )
                    }
                    className="bg-yellow-400 text-black px-5 py-3 font-black border-4 border-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-300 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-bold">No analysis available.</p>
            )}
          </div>

          <button
            onClick={exitExam}
            className="mt-8 bg-black text-white px-6 py-3 md:px-8 md:py-4 font-black uppercase border-4 border-black hover:bg-red-600 transition"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  // ================= EXAM =================
  return (
    <div className="flex h-screen bg-[#fffbeb] text-black font-mono">
      {/* MAIN */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="font-black text-xl mb-4">
          Question {current + 1}/{questions.length}
        </h2>

        <p className="mb-6 font-semibold text-lg leading-8">
          {questions[current]?.question}
        </p>

        <div className="space-y-3">
          {questions[current]?.options?.map((opt: any, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`block w-full border-2 border-black p-3 text-left font-bold transition ${
                answers[current] === i ? "bg-green-200" : "bg-white hover:bg-yellow-100"
              }`}
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center border-2 border-black bg-yellow-300 text-sm font-black">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 gap-4">
          <button
            disabled={current === 0}
            onClick={() => goToQuestion(current - 1)}
            className="bg-yellow-500 px-6 py-3 font-black border-4 border-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-400 transition"
          >
            Prev
          </button>

          <button
            onClick={handleToggleReview}
            className={`px-6 py-3 font-black border-4 border-black transition ${
              reviewMarked[current]
                ? "bg-purple-400 hover:bg-purple-300"
                : "bg-white hover:bg-purple-100"
            }`}
          >
            {reviewMarked[current] ? "Unmark Review" : "Mark for Review"}
          </button>

          <button
            disabled={current === questions.length - 1}
            onClick={() => goToQuestion(current + 1)}
            className="bg-yellow-500 px-6 py-3 font-black border-4 border-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-400 transition"
          >
            Next
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-red-500 text-white px-6 py-3 font-black border-4 border-black hover:bg-red-600 transition"
        >
          Submit Test
        </button>
      </div>

      {/* SIDEBAR */}
      <div className="w-64 border-l-4 border-black p-4 bg-white">
        <div className="grid grid-cols-5 gap-2">
          {answers.map((a, i) => {
            const isReview = reviewMarked[i];
            const isCurrent = current === i;
            const isAnswered = a !== -1;

            let bgClass = "bg-gray-200";
            if (isAnswered && isReview) bgClass = "bg-amber-300";
            else if (isReview) bgClass = "bg-purple-200";
            else if (isAnswered) bgClass = "bg-green-300";

            return (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`border-2 border-black p-2 text-xs font-black ${bgClass} ${
                  isCurrent ? "ring-4 ring-black" : ""
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-6 font-black text-xl">
          ⏳ {formatTime(timeLeft)}
        </div>

        <div className="mt-4 space-y-2 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 bg-gray-200 border border-black" />
            Not attempted
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 bg-green-300 border border-black" />
            Answered
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 bg-purple-200 border border-black" />
            Marked for review
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 bg-amber-300 border border-black" />
            Answered + review
          </div>
        </div>

        <button
          onClick={exitExam}
          className="mt-6 bg-black text-white w-full py-2 font-black border-4 border-black hover:bg-red-600 transition"
        >
          Exit
        </button>
      </div>
    </div>
  );
}