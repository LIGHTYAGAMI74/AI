"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { getModules } from "@/services/module";
import { logActivity } from "@/services/activity";

export default function StudentModules() {
  const [modules, setModules] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any>({});

  const [activeModule, setActiveModule] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);

  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH + GROUP
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModules();

        // 🔥 GROUP BY LEVEL
        const groupedData: { [key: string]: any[] } = {
          "6-8": [],
          "9-10": [],
          "11-12": [],
        };

        data.forEach((m: any) => {
          const level = m.level as keyof typeof groupedData;
          groupedData[level]?.push(m);
        });

        setModules(data);
        setGrouped(groupedData);
      } catch {
        console.error("Module fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // 🔹 LOAD TOPIC SAFE
  const loadTopic = async (topic: any) => {
    try {
      if (!topic.contentUrl) {
        setMarkdown("## ⏳ Waiting for the notes.\nCome back later.");
        return;
      }

      const res = await fetch(topic.contentUrl);
      const text = await res.text();

      // ❗ handle HTML response
      if (text.startsWith("<!DOCTYPE")) {
        setMarkdown("## ⚠️ Notes not available yet.");
        return;
      }

      setMarkdown(text);

      await logActivity();
    } catch {
      setMarkdown("## ⚠️ Failed to load content.");
    }
  };

  useEffect(() => {
    if (activeChapter && activeTopicIndex !== null) {
      const topic = activeChapter.topics[activeTopicIndex];
      loadTopic(topic);
    }
  }, [activeTopicIndex]);

  // 🔄 LOADING
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

        {/* 📚 MAIN CONTENT */}
        <div className="flex-1 space-y-12 pr-6">

          {['6-8', '9-10', '11-12'].map((level) => {
            const levelMap: Record<string, string> = {
              '6-8': '1',
              '9-10': '2',
              '11-12': '3',
            };
            const displayValue = levelMap[level];

            if (!displayValue || grouped[level]?.length === 0) {
              return null;
            }

            return (
              <div key={level} className="space-y-6">

                {/* LEVEL HEADER */}
                <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2">
                  Level {displayValue}
                </h2>

                {/* MODULES */}
                {grouped[level].map((m: any) => (
                  <div
                    key={m._id}
                    onClick={() => setActiveModule(m)}
                    className="cursor-pointer border-[6px] border-black p-6 bg-white shadow-[8px_8px_0px_black] hover:-rotate-1 transition"
                  >
                    <h3 className="text-xl font-black mb-3">{m.title}</h3>

                    {/* 🔥 CHAPTER PREVIEW */}
                    <ul className="text-sm font-bold text-gray-600 space-y-1">
                      {m.chapters.slice(0, 3).map((c: any, i: number) => (
                        <li key={i}>• {c.title}</li>
                      ))}
                      {m.chapters.length > 3 && (
                        <li>+ more...</li>
                      )}
                    </ul>
                  </div>
                ))}

              </div>
            )
          })}

        </div>

      </div>
    );
  }

  const levelMap: Record<string, string> = {
    "6-8": "1",
    "9-10": "2",
    "11-12": "3",
  };

  const renderBreadcrumb = () => {
    if (!activeModule) return null;

    const level = `Level ${levelMap[activeModule.level]}`;

    return (
      <div className="flex justify-end mb-4">
        <div className="text-xs md:text-sm font-black uppercase bg-yellow-400 text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_black]">

          {level} → {activeModule.title}

          {activeChapter && (
            <> → {activeChapter.title}</>
          )}

          {activeChapter && activeTopicIndex !== null && (
            <> → {activeChapter.topics[activeTopicIndex].title}</>
          )}

        </div>
      </div>
    );
  };

  // ================= CHAPTER LIST =================
  if (!activeChapter) {
    return (
      <section className="space-y-6">
        
        <button
          onClick={() => setActiveModule(null)}
          className="font-black underline"
        >
          ← Back to Modules
        </button>

        {renderBreadcrumb()}

        <h2 className="text-3xl font-black">{activeModule.title}</h2>

        {activeModule.chapters.map((c: any) => (
          <div
            key={c._id}
            onClick={() => {
              setActiveChapter(c);
              setActiveTopicIndex(null);
            }}
            className="border-4 p-6 bg-white cursor-pointer hover:bg-yellow-50"
          >
            {c.title}
          </div>
        ))}
      </section>
    );
  }

  // ================= TOPIC LIST =================
  if (activeTopicIndex === null) {
    return (
      <section className="space-y-6">
        
        <button
          onClick={() => setActiveChapter(null)}
          className="font-black underline"
        >
          ← Back to Chapters
        </button>

        {renderBreadcrumb()}

        {activeChapter.topics.map((t: any, i: number) => (
          <div
            key={t._id}
            onClick={() => setActiveTopicIndex(i)}
            className="border-4 p-6 bg-white cursor-pointer hover:bg-blue-50"
          >
            {t.title}
          </div>
        ))}
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
        onClick={() => setActiveTopicIndex(null)}
        className="font-black underline"
      >
        ← Back to Topics
      </button>

      {renderBreadcrumb()}

      {/* 🎥 VIDEO */}
      {topic.videoUrl && (
        <div className="aspect-video border-4 border-black">
          <iframe src={topic.videoUrl} className="w-full h-full" />
        </div>
      )}

      {/* 📄 MARKDOWN */}
      <div className="markdown-body border-4 border-black p-6 md:p-10 bg-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-3xl md:text-4xl font-semibold mt-6 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-2xl md:text-3xl font-semibold mt-5 mb-3" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="text-base md:text-lg leading-relaxed mb-4 text-gray-800" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="text-base md:text-lg" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold text-black" {...props} />,
            em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-600 underline font-medium" target="_blank" {...props} />,
            blockquote: ({node, ...props}) => (
              <blockquote className="border-l-4 border-black pl-4 italic text-gray-600 my-4" {...props} />
            ),
            code({inline, className, children, ...props}: any) {
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
            table: ({node, ...props}) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-2 border-black" {...props} />
              </div>
            ),
            th: ({node, ...props}) => (
              <th className="border border-black bg-yellow-300 px-4 py-2 text-left font-bold" {...props} />
            ),
            td: ({node, ...props}) => (
              <td className="border border-black px-4 py-2" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      {/* 🔄 NAV */}
      <div className="flex justify-between">

        <button
          disabled={isFirst}
          onClick={() => setActiveTopicIndex((prev) => prev! - 1)}
          className="flex items-center gap-2 border-4 px-6 py-3 bg-white disabled:opacity-30"
        >
          <ArrowLeft /> Previous
        </button>

        <button
          onClick={() => {
            if (!isLast) {
              setActiveTopicIndex((prev) => prev! + 1);
            } else {
              alert("Start Practice (5 questions)");
              setActiveTopicIndex(null);
              setActiveChapter(null);
            }
          }}
          className="flex items-center gap-2 border-4 px-6 py-3 bg-yellow-400"
        >
          {isLast ? "Practice Chapter" : "Next"}
          <ArrowRight />
        </button>

      </div>

    </section>
  );
}