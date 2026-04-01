"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function StudentModules() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [modules, setModules] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [activeTopic, setActiveTopic] = useState<any>(null);

  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 STEP 1: FETCH MODULES
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

  // 🔹 FETCH CHAPTERS
  const openModule = async (moduleId: string) => {
    setActiveTopic(null);
    const res = await fetch(`${API_URL}/api/module/${moduleId}/chapters`);
    const data = await res.json();
    setChapters(data);
    setTopics([]);
  };

  // 🔹 FETCH TOPICS
  const openChapter = async (chapterId: string) => {
    const res = await fetch(`${API_URL}/api/module/chapter/${chapterId}/topics`);
    const data = await res.json();
    setTopics(data);
  };

  // 🔹 FETCH MARKDOWN + VIDEO
  const openTopic = async (topic: any) => {
    setActiveTopic(topic);

    const res = await fetch(topic.contentUrl);
    const text = await res.text();

    setMarkdown(text);

    // 🔥 log activity (streak)
    await fetch(`${API_URL}/api/auth/log-activity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

  // 🔥 LOADING
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen font-mono">
        <h2 className="text-4xl font-black italic animate-pulse">
          Loading Knowledge Vault...
        </h2>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 font-mono text-black">

      {/* HEADER */}
      <header className="mb-12">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter">
          Knowledge{" "}
          <span className="bg-yellow-400 px-4 border-4 border-black">
            Vault
          </span>
        </h2>
      </header>

      {/* ================= MODULE LIST ================= */}
      {!chapters.length && (
        <section className="grid md:grid-cols-2 gap-8">
          {modules.map((m) => (
            <div
              key={m._id}
              onClick={() => openModule(m._id)}
              className="cursor-pointer border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_black] hover:-rotate-1 transition"
            >
              <h3 className="text-2xl font-black italic">{m.title}</h3>
              <p className="mt-4 text-sm font-bold">
                {m.description || "Secure Training Module"}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* ================= CHAPTER LIST ================= */}
      {chapters.length > 0 && !topics.length && (
        <section className="space-y-6">
          <button
            onClick={() => setChapters([])}
            className="font-black underline"
          >
            ← Back to Modules
          </button>

          {chapters.map((c) => (
            <div
              key={c._id}
              onClick={() => openChapter(c._id)}
              className="cursor-pointer border-4 border-black p-6 bg-white hover:bg-yellow-50"
            >
              <h3 className="font-black text-xl">{c.title}</h3>
            </div>
          ))}
        </section>
      )}

      {/* ================= TOPIC LIST ================= */}
      {topics.length > 0 && !activeTopic && (
        <section className="space-y-6">
          <button
            onClick={() => setTopics([])}
            className="font-black underline"
          >
            ← Back to Chapters
          </button>

          {topics.map((t) => (
            <div
              key={t._id}
              onClick={() => openTopic(t)}
              className="cursor-pointer border-4 border-black p-6 bg-white hover:bg-blue-50"
            >
              <h3 className="font-black text-lg">{t.title}</h3>
            </div>
          ))}
        </section>
      )}

      {/* ================= TOPIC VIEW ================= */}
      {activeTopic && (
        <section className="space-y-8">

          <button
            onClick={() => setActiveTopic(null)}
            className="font-black underline"
          >
            ← Back to Topics
          </button>

          {/* 🎥 YOUTUBE VIDEO */}
          {activeTopic.videoUrl && (
            <div className="aspect-video border-4 border-black">
              <iframe
                src={activeTopic.videoUrl}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {/* 📄 MARKDOWN NOTES */}
          <div className="prose max-w-none border-4 border-black p-6 bg-white">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>

          {/* ✅ COMPLETE BUTTON */}
          <button
            className="bg-green-400 border-4 border-black px-6 py-3 font-black"
            onClick={() => alert("Marked complete (backend next step)")}
          >
            MARK AS COMPLETE ✔
          </button>

        </section>
      )}
    </main>
  );
}