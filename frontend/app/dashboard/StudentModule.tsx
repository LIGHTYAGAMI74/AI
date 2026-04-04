"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { ArrowLeft, ArrowRight, Lock, X } from "lucide-react";

import { getModules } from "@/services/module";
import {
  logActivity,
  markTopicComplete,
  markChapterPractice,
  getProgress,
} from "@/services/activity";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  raw?: any;
};

function shuffleArray<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i]!, arr[j]!] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function normalizeQuestion(raw: any): QuizQuestion | null {
  const question =
    raw?.question ?? raw?.q ?? raw?.prompt ?? raw?.title ?? raw?.text;

  if (!question) return null;

  let options: string[] = [];
  const sourceOptions =
    raw?.options ?? raw?.choices ?? raw?.answers ?? raw?.mcqOptions;

  if (Array.isArray(sourceOptions)) {
    options = sourceOptions.map((opt) => String(opt));
  } else if (sourceOptions && typeof sourceOptions === "object") {
    options = Object.values(sourceOptions).map((opt) => String(opt));
  }

  if (options.length < 4) {
    const fallback = [raw?.option1, raw?.option2, raw?.option3, raw?.option4]
      .filter(Boolean)
      .map(String);
    if (fallback.length) options = fallback;
  }

  if (options.length < 4) return null;

  options = options.slice(0, 4);

  const correctRaw =
    raw?.correctIndex ?? raw?.answerIndex ?? raw?.correct_answer ?? raw?.answer ?? raw?.correct;

  let correctIndex = -1;

  if (typeof correctRaw === "number") {
    correctIndex = correctRaw;
  } else if (typeof correctRaw === "string") {
    const normalized = correctRaw.trim();

    if (/^[ABCD]$/i.test(normalized)) {
      correctIndex = normalized.toUpperCase().charCodeAt(0) - 65;
    } else {
      correctIndex = options.findIndex(
        (opt) => opt.trim().toLowerCase() === normalized.toLowerCase()
      );
    }
  }

  if (correctIndex < 0 || correctIndex > 3) {
    correctIndex = 0;
  }

  const shuffled = shuffleArray(
    options.map((option, index) => ({ option, index }))
  );
  const shuffledOptions = shuffled.map((item) => item.option);
  const newCorrectIndex = shuffled.findIndex((item) => item.index === correctIndex);

  return {
    question: String(question),
    options: shuffledOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    raw,
  };
}

function pickFiveQuestions(rawQuestions: any[]): QuizQuestion[] {
  const normalized = rawQuestions
    .map(normalizeQuestion)
    .filter(Boolean) as QuizQuestion[];

  return shuffleArray(normalized).slice(0, 5);
}

function ChapterTestModal({
  isOpen,
  onClose,
  chapterTitle,
  practiceUrl,
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle: string;
  practiceUrl?: string;
  onComplete: () => Promise<void>;
}) {
  const [stage, setStage] = useState<"disclaimer" | "quiz" | "result">(
    "disclaimer"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(40);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const scoreRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const answerLockRef = useRef(false);

  const resetTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeAndReset = () => {
    resetTimer();
    setStage("disclaimer");
    setLoading(false);
    setError("");
    setQuestions([]);
    setCurrentIndex(0);
    setSecondsLeft(40);
    setScore(0);
    setSelectedIndex(null);
    setLocked(false);
    scoreRef.current = 0;
    answerLockRef.current = false;
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const loadQuestions = async () => {
      setLoading(true);
      setError("");
      setStage("disclaimer");
      setQuestions([]);
      setCurrentIndex(0);
      setSecondsLeft(40);
      setScore(0);
      setSelectedIndex(null);
      setLocked(false);
      scoreRef.current = 0;
      answerLockRef.current = false;

      try {
        if (!practiceUrl) {
          throw new Error("Practice questions are not available yet.");
        }

        const res = await fetch(practiceUrl);
        const data = await res.json();

        const pool = Array.isArray(data)
          ? data
          : Array.isArray(data?.questions)
          ? data.questions
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const selected = pickFiveQuestions(pool);

        if (selected.length < 5) {
          throw new Error(
            "Not enough valid MCQ questions found in practice content."
          );
        }

        setQuestions(selected);
      } catch (err: any) {
        setError(err?.message || "Failed to load practice test.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [isOpen, practiceUrl]);

  useEffect(() => {
    if (!isOpen || stage !== "quiz") return;

    resetTimer();
    setSecondsLeft(40);
    setSelectedIndex(null);
    setLocked(false);
    answerLockRef.current = false;

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          resetTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => resetTimer();
  }, [isOpen, stage, currentIndex]);

  const finishQuestion = async (isCorrect: boolean) => {
    if (answerLockRef.current) return;
    answerLockRef.current = true;
    setLocked(true);
    resetTimer();

    const nextScore = scoreRef.current + (isCorrect ? 1 : 0);
    scoreRef.current = nextScore;
    setScore(nextScore);

    window.setTimeout(async () => {
      const isLast = currentIndex >= questions.length - 1;

      if (!isLast) {
        answerLockRef.current = false;
        setCurrentIndex((prev) => prev + 1);
        setSelectedIndex(null);
        setLocked(false);
        setSecondsLeft(40);
        return;
      }

      setStage("result");
      try {
        await onComplete();
      } catch (err) {
        console.error("Failed to update progress", err);
      }
    }, 500);
  };

  useEffect(() => {
    if (!isOpen || stage !== "quiz") return;
    if (secondsLeft === 0 && !answerLockRef.current) {
      finishQuestion(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isOpen, stage]);

  const handleOptionClick = (index: number) => {
    if (locked || stage !== "quiz") return;
    setSelectedIndex(index);
    finishQuestion(index === questions[currentIndex]?.correctIndex);
  };

  const currentQuestion = questions[currentIndex];
  const percent = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-black bg-white shadow-[12px_12px_0px_black]">
        <button
          onClick={closeAndReset}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center border-2 border-black bg-white font-black hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="border-b-4 border-black bg-yellow-300 px-6 py-4 pr-14">
          <h3 className="text-2xl font-black uppercase">Chapter Test</h3>
          <p className="text-sm font-bold">
            {chapterTitle}
          </p>
        </div>

        <div className="p-6 md:p-8">
          {loading ? (
            <div className="animate-pulse border-4 border-black p-10 text-center font-black">
              Preparing your test...
            </div>
          ) : error ? (
            <div className="border-4 border-black bg-red-100 p-6">
              <p className="font-black text-red-700">{error}</p>
              <button
                onClick={closeAndReset}
                className="mt-4 border-4 border-black bg-white px-5 py-3 font-black"
              >
                Close
              </button>
            </div>
          ) : stage === "disclaimer" ? (
            <div className="space-y-6">
              <div className="border-4 border-black bg-gray-50 p-5">
                <p className="text-base md:text-lg font-semibold leading-8 text-gray-800">
                  This chapter test contains <strong>5 random MCQs</strong> selected from the practice bank.
                  You will get <strong>40 seconds</strong> for each question.
                  Once you select an answer, or time runs out, the next question will appear automatically.
                </p>
              </div>

              <div className="border-4 border-black bg-white p-5">
                <p className="font-black uppercase tracking-wide mb-2">Test rules</p>
                <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-gray-700">
                  <li>No marks are stored here; only your live score will be shown.</li>
                  <li>You cannot go back to a previous question.</li>
                  <li>Keep an eye on the timer for every question.</li>
                </ul>
              </div>

              <button
                onClick={() => setStage("quiz")}
                className="inline-flex items-center gap-2 border-4 border-black bg-yellow-400 px-6 py-3 font-black hover:bg-yellow-300"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          ) : stage === "result" ? (
            <div className="space-y-6 text-center">
              <div className="border-4 border-black bg-green-100 p-8">
                <h4 className="text-3xl font-black mb-3">Test Completed</h4>
                <p className="text-lg font-bold">
                  You scored <span className="text-2xl">{score}/{questions.length}</span>
                </p>
                <p className="mt-2 text-base font-semibold">
                  Performance: <span className="font-black">{percent}%</span>
                </p>
              </div>

              <button
                onClick={closeAndReset}
                className="inline-flex items-center gap-2 border-4 border-black bg-yellow-400 px-6 py-3 font-black hover:bg-yellow-300"
              >
                Close Test
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 border-4 border-black bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div className="font-black uppercase">
                  Question {currentIndex + 1} / {questions.length}
                </div>
                <div className="text-sm font-black">
                  Score: {score}/{questions.length}
                </div>
                <div className="text-sm font-black">
                  Time Left: <span className="text-red-600">{secondsLeft}s</span>
                </div>
              </div>

              <div className="border-4 border-black bg-gray-50 p-5 md:p-7">
                <p className="text-lg md:text-xl font-bold leading-relaxed">
                  {currentQuestion?.question}
                </p>
              </div>

              <div className="grid gap-4">
                {currentQuestion?.options?.map((option, index) => {
                  const isSelected = selectedIndex === index;
                  const isCorrect = currentQuestion.correctIndex === index;

                  let optionClass = "bg-white hover:bg-blue-50";
                  if (locked && isCorrect) optionClass = "bg-green-200";
                  if (locked && isSelected && !isCorrect) optionClass = "bg-red-200";

                  return (
                    <button
                      key={`${currentIndex}-${index}`}
                      onClick={() => handleOptionClick(index)}
                      disabled={locked}
                      className={`border-4 border-black px-5 py-4 text-left font-bold transition disabled:cursor-not-allowed ${optionClass}`}
                    >
                      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center border-2 border-black bg-yellow-300 text-sm font-black">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold text-gray-600">
                  The next question will load automatically after your answer or timeout.
                </div>
                <div className="text-xs font-black uppercase tracking-wide bg-yellow-300 border-2 border-black px-3 py-2">
                  Olympiad Mode
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentModules({ onActivity }: { onActivity?: () => void }) {
  const [modules, setModules] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any>({
    "6-8": [],
    "9-10": [],
    "11-12": [],
  });
  const [progress, setProgress] = useState<any>(null);

  const [activeModule, setActiveModule] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);

  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const levelMap: Record<string, string> = {
    "6-8": "1",
    "9-10": "2",
    "11-12": "3",
  };

  const topRef = useRef<HTMLDivElement>(null);

  // FETCH MODULES + PROGRESS
  useEffect(() => {
    const init = async () => {
      try {
        const [modulesData, progressData] = await Promise.all([
          getModules(),
          getProgress(),
        ]);

        const groupedData: Record<string, any[]> = {
          "6-8": [],
          "9-10": [],
          "11-12": [],
        };

        modulesData.forEach((m: any) => {
          if (groupedData[m.level]) {
            groupedData[m.level]!.push(m);
          }
        });

        setModules(modulesData);
        setGrouped(groupedData);
        setProgress(progressData);
      } catch (error) {
        console.error("Init failed", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const isModuleUnlocked = (module: any) => {
    const moduleProgress = progress?.modules?.find(
      (m: any) => m.moduleId?.toString() === module._id?.toString()
    );

    console.log(progress.modules);

    return !!moduleProgress?.unlocked;
  };

  const getModuleProgress = (moduleId: string) =>
    progress?.modules?.find(
      (m: any) => m.moduleId?.toString() === moduleId?.toString()
    );

  const getChapterProgress = (moduleId: string, chapterId: string) => {
    const module = getModuleProgress(moduleId);

    if (!module) return null;

    return module.chapters?.find(
      (c: any) => c.chapterId?.toString() === chapterId?.toString()
    ) || null;
  };

  const getTopicProgress = (moduleId: string, chapterId: string, topicId: string) =>
    getChapterProgress(moduleId, chapterId)?.topics?.find(
      (t: any) => t.topicId?.toString() === topicId?.toString()
    );

  const renderBreadcrumb = () => {
    if (!activeModule) return null;

    const levelLabel = levelMap[activeModule.level]
      ? `Level ${levelMap[activeModule.level]}`
      : activeModule.level;

    return (
      <div className="flex justify-end mb-4">
        <div className="text-xs md:text-sm font-black uppercase bg-yellow-400 text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_black]">
          {levelLabel} → {activeModule.title}
          {activeChapter && <> → {activeChapter.title}</>}
          {activeChapter && activeTopicIndex !== null && (
            <> → {activeChapter.topics[activeTopicIndex]?.title}</>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeModule, activeChapter, activeTopicIndex]);

  const loadTopic = async (topic: any) => {
    setContentLoading(true);

    try {
      if (!topic?.contentUrl) {
        setMarkdown("## ⏳ Waiting for the notes.\nCome back later.");
        return;
      }

      const res = await fetch(topic.contentUrl);
      const text = await res.text();

      if (text.startsWith("<!DOCTYPE")) {
        setMarkdown("## ⚠️ Notes not available yet.");
        return;
      }

      setMarkdown(text);
      await logActivity();
      onActivity?.(); 
    } catch {
      setMarkdown("## ⚠️ Failed to load content.");
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    if (activeChapter && activeTopicIndex !== null) {
      const topic = activeChapter.topics?.[activeTopicIndex];
      if (topic) loadTopic(topic);
    }
  }, [activeChapter, activeTopicIndex]);

  const handleNext = async () => {
    if (!activeModule || !activeChapter || activeTopicIndex === null) return;

    const topic = activeChapter.topics?.[activeTopicIndex];
    if (!topic) return;

    try {
      // ✅ STEP 1: mark topic complete
      await markTopicComplete(
        activeModule._id,
        activeChapter.chapterKey,
        topic._id
      );

      // ✅ STEP 2: refresh progress immediately
      const updated = await getProgress();
      setProgress(updated);

      const isLast = activeTopicIndex === activeChapter.topics.length - 1;

      if (!isLast) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });

      setActiveTopicIndex((prev) => (prev ?? 0) + 1);
    } else {
        // ✅ ONLY open test (DO NOT mark chapter here)
        setShowTestModal(true);
      }

    } catch (error) {
      console.error("Failed to update topic progress", error);
    }
  };

  const handleChapterTestComplete = async () => {
  try {
    // ✅ STEP 1: mark chapter complete AFTER test
    await markChapterPractice(
      activeModule._id,
      activeChapter.chapterKey, 
      activeModule.chapters.length
    );

    // ✅ STEP 2: force fresh progress
    const updated = await getProgress();
    setProgress(updated);

  } catch (error) {
    console.error("Failed to mark chapter complete", error);
  }
};

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <h2 className="text-3xl font-black animate-pulse">
          Loading Knowledge Vault...
        </h2>
      </main>
    );
  }

  // ================= MODULE LIST =================
  if (!activeModule) {
    return (
      <div className="flex">
        <div className="flex-1 space-y-12 pr-6">
          {['6-8', '9-10', '11-12'].map((level) => {
            if (!grouped[level]?.length) return null;

            return (
              <div key={level} className="space-y-6">
                <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2">
                  Level {levelMap[level]}
                </h2>

                {grouped[level].map((m: any) => {
                  const unlocked = isModuleUnlocked(m);
                  const moduleProgress = getModuleProgress(m._id);

                  return (
                    <div
                      key={m._id}
                      onClick={() => {
                        if (!unlocked) return;
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setActiveModule(m);
                      }}
                      className={`border-[6px] border-black p-6 shadow-[8px_8px_0px_black] transition ${
                        unlocked
                          ? `${
                              moduleProgress?.moduleTestPassed
                                ? "bg-green-100"
                                : "bg-white"
                            } hover:-rotate-1 cursor-pointer`
                          : "bg-gray-200 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black mb-2">{m.title}</h3>
                          <p className="text-sm font-semibold text-gray-600">
                            {m.chapters?.length || 0} chapters
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {!unlocked ? (
                            <Lock className="shrink-0" />
                          ) : moduleProgress?.moduleTestPassed ? (
                            <span className="text-xs font-black bg-green-300 border-2 border-black px-3 py-1">
                              Completed
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <ul className="text-sm font-bold text-gray-600 space-y-1 mt-4">
                        {m.chapters?.slice(0, 4).map((c: any, i: number) => (
                          <li key={c.chapterKey || i}>• {c.title}</li>
                        ))}
                        {m.chapters?.length > 4 && <li>+ more...</li>}
                      </ul>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= CHAPTER LIST =================
  if (!activeChapter) {
    return (
      <section className="space-y-6">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveModule(null);
          }}
          className="inline-flex items-center gap-2 font-black underline underline-offset-4 hover:text-blue-600"
        >
          ← Back to Modules
        </button>

        {renderBreadcrumb()}

        <h2 className="text-3xl font-black">{activeModule.title}</h2>

        <div className="space-y-4">
          {activeModule.chapters?.map((c: any) => {
            const chapterProgress = getChapterProgress(activeModule._id, c.chapterKey);
            const isCompleted = chapterProgress?.chapterTestPassed === true;

            return (
              <div
                key={c.chapterKey}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveChapter(c);
                  setActiveTopicIndex(null);
                }}
                className={`border-4 p-6 cursor-pointer transition ${
                  isCompleted
                    ? "bg-green-200 hover:bg-green-300"
                    : "bg-white hover:bg-yellow-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold">{c.title}</span>
                  {Boolean(chapterProgress?.chapterTestPassed) && (
                    <span className="text-xs font-black bg-green-100 border-2 border-black px-3 py-1">
                      Done
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ================= TOPIC LIST =================
  if (activeTopicIndex === null) {
    return (
      <section className="space-y-6">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveChapter(null);
          }}
          className="inline-flex items-center gap-2 font-black underline underline-offset-4 hover:text-blue-600"
        >
          ← Back to Chapters
        </button>

        {renderBreadcrumb()}

        <div className="space-y-4">
          {activeChapter.topics?.map((t: any, i: number) => {
            const chapterProgress = getChapterProgress(
              activeModule._id,
              activeChapter.chapterKey
            );

            const topicProgress = getTopicProgress(
              activeModule._id,
              activeChapter.chapterKey, 
              t._id
            );

            // 🔥 MAIN LOGIC
            const isCompleted =
              chapterProgress?.chapterTestPassed || topicProgress?.completed;

            return (
              <div
                key={t._id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveTopicIndex(i);
                }}
                className={`border-4 p-6 cursor-pointer transition ${
                  isCompleted
                    ? "bg-green-100 hover:bg-green-200"
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold">{t.title}</span>
                  {isCompleted && (
                    <span className="text-xs font-black bg-green-100 border-2 border-black px-3 py-1">
                      Done
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ================= TOPIC VIEW =================
  const topic = activeChapter.topics[activeTopicIndex];
  const isFirst = activeTopicIndex === 0;
  const isLast = activeTopicIndex === activeChapter.topics.length - 1;

  return (
    <section className="space-y-8">
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveTopicIndex(null);
        }}
        className="inline-flex items-center gap-2 font-black underline underline-offset-4 hover:text-blue-600"
      >
        ← Back to Topics
      </button>

      {renderBreadcrumb()}

      {/* VIDEO */}
      {topic?.videoUrl && (
        <div className="aspect-video border-4 border-black overflow-hidden">
          <iframe
            src={topic.videoUrl}
            className="w-full h-full"
            title={topic.title}
          />
        </div>
      )}

      {/* CONTENT */}
      {contentLoading ? (
        <div className="animate-pulse border-4 border-black p-10 bg-gray-100 text-center font-bold">
          Loading Notes...
        </div>
      ) : (
        <div
          ref={topRef}
          className="markdown-body border-4 border-black p-6 md:p-10 bg-white"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-4xl md:text-4xl font-bold mt-6 mb-4"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-3xl md:text-3xl font-semibold mt-6 mb-3"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-2xl md:text-2xl font-semibold mt-5 mb-3"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-base md:text-lg leading-relaxed mb-4 text-gray-800"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-base md:text-lg" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-black" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-gray-700" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-600 underline font-medium"
                  target="_blank"
                  rel="noreferrer"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-black pl-4 italic text-gray-600 my-4"
                  {...props}
                />
              ),
              code({ inline, className, children, ...props }: any) {
                return inline ? (
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-black text-green-400 p-4 rounded-lg overflow-x-auto my-4">
                    <code {...props}>{children}</code>
                  </pre>
                );
              },
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-2 border-black" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border border-black bg-yellow-300 px-4 py-2 text-left font-bold"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-black px-4 py-2" {...props} />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}

      {/* NAV */}
      <div className="flex justify-between gap-4">
        <button
          disabled={isFirst}
          onClick={() => setActiveTopicIndex((prev) => (prev ?? 0) - 1)}
          className="inline-flex items-center gap-2 border-4 border-black px-6 py-3 bg-white font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Previous
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 border-4 border-black px-6 py-3 bg-yellow-400 font-black hover:bg-yellow-300 transition"
        >
          {isLast ? "Practice Chapter" : "Next"}
          <ArrowRight size={18} />
        </button>
      </div>

      <ChapterTestModal
        isOpen={showTestModal}
        onClose={() => {
          setShowTestModal(false);
          setActiveTopicIndex(null);
          setActiveChapter(null);
        }}
        chapterTitle={activeChapter.title}
        practiceUrl={activeChapter.practiceUrl}
        onComplete={handleChapterTestComplete}
      />
    </section>
  );
}
