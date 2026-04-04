import { apiRequest } from "@/lib/api";

// 🔥 STREAK
export async function logActivity() {
  return apiRequest("/auth/log-activity", {
    method: "POST",
  });
}

// 🔥 MARK TOPIC COMPLETE
export async function markTopicComplete(moduleId: string, chapterId: string, topicId: string) {
  return apiRequest("/progress/topic-complete", {
    method: "POST",
    body: JSON.stringify({ moduleId, chapterId, topicId }),
  });
}

// 🔥 CHAPTER PRACTICE ATTEMPT
export async function markChapterPractice(
  moduleId: string,
  chapterId: string,
  totalChapters: number
) {
  return apiRequest("/progress/chapter-practice", {
    method: "POST",
    body: JSON.stringify({ moduleId, chapterId, totalChapters }),
  });
}

// 🔥 MODULE TEST RESULT

export async function submitModuleTest(data: {
  moduleId: string;
  score: number;
  moduleTitle: string;
}) {
  return apiRequest("/progress/module-test", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔥 GET PROGRESS
export async function getProgress() {
  return apiRequest("/progress/me", {
    method: "GET",
  });
}