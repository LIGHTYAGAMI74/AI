"use client";

import React, { useEffect, useState } from "react";
import {
  fetchModules,
  createModule,
  updateChapterPracticeUrl,
  updateTopicContent,
  updateModuleTestUrl,
} from "@/services/admin";

import { Layers } from "lucide-react";

export default function AdminModuleLinker() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("6-8");

  const loadModules = async () => {
    const data = await fetchModules();
    setModules(data.modules || []);
  };

  useEffect(() => {
    loadModules();
  }, []);

  // 🔥 CREATE MODULE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await createModule({ title, level });

    setTitle("");
    await loadModules();

    setLoading(false);
  };

  // 🔥 UPDATE FUNCTIONS
  const handlePracticeUpdate = async (
    moduleId: string,
    chapterKey: string,
    value: string
  ) => {
    await updateChapterPracticeUrl(moduleId, chapterKey, value);
    loadModules();
  };

  const handleTopicUpdate = async (
    moduleId: string,
    chapterKey: string,
    topicId: string,
    field: "contentUrl" | "videoUrl",
    value: string
  ) => {
    await updateTopicContent(moduleId, chapterKey, topicId, {
      [field]: value,
    });
    loadModules();
  };

  const handleModuleTest = async (moduleId: string, value: string) => {
    await updateModuleTestUrl(moduleId, value);
    loadModules();
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4">

      {/* HEADER */}
      <header className="mb-10">
        <h2 className="text-4xl font-black uppercase italic">
          Module Control
        </h2>
      </header>

      {/* CREATE MODULE */}
      <form
        onSubmit={handleCreate}
        className="border-4 border-black p-6 mb-10 bg-white"
      >
        <h3 className="font-black mb-4">Create Module</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Module Title"
          className="border-4 border-black p-3 w-full mb-4"
          required
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border-4 border-black p-3 w-full mb-4"
        >
          <option value="6-8">6-8</option>
          <option value="9-10">9-10</option>
          <option value="11-12">11-12</option>
        </select>

        <button className="bg-black text-white px-6 py-3 font-bold">
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {/* MODULE LIST */}
      <div className="space-y-10">
        {modules.map((mod) => (
          <div
            key={mod._id}
            className="border-4 border-black p-6 bg-white"
          >
            <h3 className="text-2xl font-black mb-4">
              Class {mod.level} - {mod.title}
            </h3>

            {/* MODULE TEST URL */}
            <div className="mb-6">
              <label className="font-bold">Module Test URL</label>
              <input
                defaultValue={mod.moduleTestUrl}
                onBlur={(e) =>
                  handleModuleTest(mod._id, e.target.value)
                }
                className="border-2 border-black p-2 w-full"
              />
            </div>

            {/* CHAPTERS */}
            {mod.chapters?.map((ch: any) => (
              <div
                key={ch.chapterKey}
                className="border-2 border-black p-4 mb-6"
              >
                <h4 className="font-bold mb-3">{ch.title}</h4>

                {/* PRACTICE URL */}
                <input
                  defaultValue={ch.practiceUrl}
                  onBlur={(e) =>
                    handlePracticeUpdate(
                      mod._id,
                      ch.chapterKey,
                      e.target.value
                    )
                  }
                  className="border-2 border-black p-2 w-full mb-4"
                  placeholder="Practice URL"
                />

                {/* TOPICS */}
                {ch.topics?.map((topic: any, idx: number) => (
                  <div
                    key={idx}
                    className="border p-3 mb-3 bg-gray-50"
                  >
                    <p className="font-bold">{topic.title}</p>

                    <input
                      defaultValue={topic.contentUrl}
                      onBlur={(e) =>
                        handleTopicUpdate(
                          mod._id,
                          ch.chapterKey,
                          topic._id,
                          "contentUrl",
                          e.target.value
                        )
                      }
                      className="border p-2 w-full mb-2"
                      placeholder="Content URL"
                    />

                    <input
                      defaultValue={topic.videoUrl}
                      onBlur={(e) =>
                        handleTopicUpdate(
                          mod._id,
                          ch.chapterKey,
                          topic._id,
                          "videoUrl",
                          e.target.value
                        )
                      }
                      className="border p-2 w-full"
                      placeholder="Video URL"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}