// services/activity.ts

import { apiRequest } from "@/lib/api";

// 🔥 LOG USER ACTIVITY (streak)
export async function logActivity() {
  return apiRequest("/auth/log-activity", {
    method: "POST",
  });
}