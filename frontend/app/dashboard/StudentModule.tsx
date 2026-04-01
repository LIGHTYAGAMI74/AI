"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function StudentModules() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [modules, setModules] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);

  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH ALL DATA ONCE
  useEffect(() => {
    const fetchModules = async () => {
      const res = await fetch(`${API_URL}/api/module/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setModules(data || []);
      setLoading(false);
    };

    fetchModules();
  }, []);

  // 🔹 LOAD TOPIC CONTENT
  const loadTopic = async (topic: any) => {
    const res = await fetch(topic.contentUrl);
    const text = await res.text();
    setMarkdown(text);

    // 🔥 ACTIVITY TRACK
    await fetch(`${API_URL}/api/auth/log-activity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

  // 🔹 WHEN TOPIC CHANGES
  useEffect(() => {
    if (activeChapter && activeTopicIndex !== null) {
      const topic = activeChapter.topics[activeTopicIndex];
      loadTopic(topic);
    }
  }, [activeTopicIndex]);

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
      <section className="grid md:grid-cols-2 gap-8">
        {modules.map((m) => (
          <div
            key={m._id}
            onClick={() => setActiveModule(m)}
            className="cursor-pointer border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_black] hover:-rotate-1"
          >
            <h3 className="text-2xl font-black">{m.title}</h3>
          </div>
        ))}
      </section>
    );
  }

  // ================= CHAPTER LIST =================
  if (!activeChapter) {
    return (
      <section className="space-y-6">
        <button onClick={() => setActiveModule(null)}>← Back</button>

        {activeModule.chapters.map((c: any) => (
          <div
            key={c._id}
            onClick={() => {
              setActiveChapter(c);
              setActiveTopicIndex(null);
            }}
            className="border-4 p-6 bg-white cursor-pointer"
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
        <button onClick={() => setActiveChapter(null)}>← Back</button>

        {activeChapter.topics.map((t: any, i: number) => (
          <div
            key={t._id}
            onClick={() => setActiveTopicIndex(i)}
            className="border-4 p-6 bg-white cursor-pointer"
          >
            {t.title}
          </div>
        ))}
      </section>
    );
  }

  // ================= TOPIC VIEW =================
  const topic = activeChapter.topics[activeTopicIndex];

  const isLast = activeTopicIndex === activeChapter.topics.length - 1;
  const isFirst = activeTopicIndex === 0;

  return (
    <section className="space-y-8">

      {/* BACK */}
      <button onClick={() => setActiveTopicIndex(null)}>
        ← Back to Topics
      </button>

      {/* VIDEO */}
      {topic.videoUrl && (
        <div className="aspect-video border-4 border-black">
          <iframe src={topic.videoUrl} className="w-full h-full" />
        </div>
      )}

      {/* NOTES */}
      <div className="prose max-w-none border-4 border-black p-6 bg-white">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>

      {/* NAVIGATION */}
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
              // 🔥 END OF CHAPTER → PRACTICE
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