"use client";

import React, { useEffect, useState } from "react";
import {
  fetchModules,
  updateChapterPracticeUrl,
  updateTopicContent,
  updateModuleTestUrl,
} from "@/services/admin";
import { ChevronDown } from "lucide-react";

export default function AdminModuleLinker() {
  const [modules, setModules] = useState<any[]>([]);
  const [openLevels, setOpenLevels] = useState<any>({});
  const [openModules, setOpenModules] = useState<any>({});
  const [openChapters, setOpenChapters] = useState<any>({});

  const [drafts, setDrafts] = useState<any>({});
  const [saving, setSaving] = useState<any>({});

  const loadModules = async () => {
    const data = await fetchModules();
    setModules(data.modules || []);
  };

  useEffect(() => {
    loadModules();
  }, []);

  //////////////////////////////////////////////////////////
  // 🧠 HANDLE CHANGE
  //////////////////////////////////////////////////////////

  const setDraft = (key: string, value: any) => {
    setDrafts((p: any) => ({ ...p, [key]: value }));
  };

  //////////////////////////////////////////////////////////
  // 💾 SAVE HANDLERS
  //////////////////////////////////////////////////////////

  const saveModuleTest = async (moduleId: string) => {
    const key = `module-${moduleId}`;
    setSaving((p: any) => ({ ...p, [key]: true }));

    await updateModuleTestUrl(moduleId, drafts[key]);

    setSaving((p: any) => ({ ...p, [key]: false }));
  };

  const savePractice = async (moduleId: string, chapterKey: string) => {
    const key = `practice-${moduleId}-${chapterKey}`;
    setSaving((p: any) => ({ ...p, [key]: true }));

    await updateChapterPracticeUrl(moduleId, chapterKey, drafts[key]);

    setSaving((p: any) => ({ ...p, [key]: false }));
  };

  const saveTopic = async (
    moduleId: string,
    chapterKey: string,
    topicId: string,
    field: string
  ) => {
    const key = `${field}-${topicId}`;
    setSaving((p: any) => ({ ...p, [key]: true }));

    await updateTopicContent(moduleId, chapterKey, topicId, {
      [field]: drafts[key],
    });

    setSaving((p: any) => ({ ...p, [key]: false }));
  };

  //////////////////////////////////////////////////////////

  const grouped = ["6-8", "9-10", "11-12"].map((level) => ({
    level,
    modules: modules.filter((m) => m.level === level),
  }));

  //////////////////////////////////////////////////////////

  return (
    <section className="w-full max-w-7xl mx-auto px-4">

      <header className="mb-10">
        <h2 className="text-4xl font-black italic">
          Module Control Panel
        </h2>
      </header>

      <div className="space-y-8">

        {grouped.map(({ level, modules }) => (
          <div key={level} className="border-4 border-black">

            {/* LEVEL */}
            <button
              onClick={() =>
                setOpenLevels((p: any) => ({
                  ...p,
                  [level]: !p[level],
                }))
              }
              className="w-full p-5 flex justify-between bg-yellow-300 font-black"
            >
              Class {level}
              <ChevronDown
                className={openLevels[level] ? "rotate-180" : ""}
              />
            </button>

            {openLevels[level] && (
              <div className="p-5 space-y-6">

                {modules.map((mod) => (
                  <div key={mod._id} className="border-4 p-4">

                    {/* MODULE */}
                    <button
                      onClick={() =>
                        setOpenModules((p: any) => ({
                          ...p,
                          [mod._id]: !p[mod._id],
                        }))
                      }
                      className="w-full flex justify-between font-bold"
                    >
                      {mod.title}
                      <ChevronDown
                        className={
                          openModules[mod._id] ? "rotate-180" : ""
                        }
                      />
                    </button>

                    {openModules[mod._id] && (
                      <div className="mt-4 space-y-6">

                        {/* MODULE TEST */}
                        <div>
                          <input
                            value={
                              drafts[`module-${mod._id}`] ??
                              mod.moduleTestUrl ??
                              ""
                            }
                            onChange={(e) =>
                              setDraft(
                                `module-${mod._id}`,
                                e.target.value
                              )
                            }
                            className="border p-2 w-full"
                          />

                          <button
                            onClick={() => saveModuleTest(mod._id)}
                            className="mt-2 px-4 py-2 bg-black text-white"
                          >
                            {saving[`module-${mod._id}`]
                              ? "Saving..."
                              : "Save"}
                          </button>
                        </div>

                        {/* CHAPTERS */}
                        {mod.chapters?.map((ch: any) => (
                          <div key={ch.chapterKey} className="border p-4">

                            <button
                              onClick={() =>
                                setOpenChapters((p: any) => ({
                                  ...p,
                                  [ch.chapterKey]:
                                    !p[ch.chapterKey],
                                }))
                              }
                              className="w-full flex justify-between font-bold"
                            >
                              {ch.title}
                              <ChevronDown
                                className={
                                  openChapters[ch.chapterKey]
                                    ? "rotate-180"
                                    : ""
                                }
                              />
                            </button>

                            {openChapters[ch.chapterKey] && (
                              <div className="mt-4 space-y-4">

                                {/* PRACTICE */}
                                <div>
                                  <input
                                    value={
                                      drafts[
                                        `practice-${mod._id}-${ch.chapterKey}`
                                      ] ?? ch.practiceUrl ?? ""
                                    }
                                    onChange={(e) =>
                                      setDraft(
                                        `practice-${mod._id}-${ch.chapterKey}`,
                                        e.target.value
                                      )
                                    }
                                    className="border p-2 w-full"
                                  />

                                  <button
                                    onClick={() =>
                                      savePractice(
                                        mod._id,
                                        ch.chapterKey
                                      )
                                    }
                                    className="mt-2 px-3 py-1 bg-black text-white"
                                  >
                                    {saving[
                                      `practice-${mod._id}-${ch.chapterKey}`
                                    ]
                                      ? "Saving..."
                                      : "Save"}
                                  </button>
                                </div>

                                {/* TOPICS */}
                                {ch.topics?.map((topic: any) => (
                                  <div key={topic._id} className="border p-3">

                                    <p className="font-bold">
                                      {topic.title}
                                    </p>

                                    {/* CONTENT */}
                                    <input
                                      value={
                                        drafts[
                                          `contentUrl-${topic._id}`
                                        ] ?? topic.contentUrl ?? ""
                                      }
                                      onChange={(e) =>
                                        setDraft(
                                          `contentUrl-${topic._id}`,
                                          e.target.value
                                        )
                                      }
                                      className="border p-2 w-full mb-2"
                                    />

                                    <button
                                      onClick={() =>
                                        saveTopic(
                                          mod._id,
                                          ch.chapterKey,
                                          topic._id,
                                          "contentUrl"
                                        )
                                      }
                                      className="mb-2 bg-black text-white px-3 py-1"
                                    >
                                      {saving[
                                        `contentUrl-${topic._id}`
                                      ]
                                        ? "Saving..."
                                        : "Save Content"}
                                    </button>

                                    {/* VIDEO */}
                                    <input
                                      value={
                                        drafts[
                                          `videoUrl-${topic._id}`
                                        ] ?? topic.videoUrl ?? ""
                                      }
                                      onChange={(e) =>
                                        setDraft(
                                          `videoUrl-${topic._id}`,
                                          e.target.value
                                        )
                                      }
                                      className="border p-2 w-full"
                                    />

                                    <button
                                      onClick={() =>
                                        saveTopic(
                                          mod._id,
                                          ch.chapterKey,
                                          topic._id,
                                          "videoUrl"
                                        )
                                      }
                                      className="mt-2 bg-black text-white px-3 py-1"
                                    >
                                      {saving[
                                        `videoUrl-${topic._id}`
                                      ]
                                        ? "Saving..."
                                        : "Save Video"}
                                    </button>

                                  </div>
                                ))}

                              </div>
                            )}
                          </div>
                        ))}

                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}