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
export async function submitModuleTest(moduleId: string, score: number) {
  return apiRequest("/progress/module-test", {
    method: "POST",
    body: JSON.stringify({ moduleId, score }),
  });
}

// 🔥 GET PROGRESS
export async function getProgress() {
  return apiRequest("/progress/me", {
    method: "GET",
  });
}