// services/module.ts

import { apiRequest } from "@/lib/api";

// 📦 GET MODULES
export async function getModules() {
  return apiRequest("/module/all", {
    method: "GET",
  });
}