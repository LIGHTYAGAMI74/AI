const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// 🔥 MODULES
export const fetchModules = async () => {
  const res = await fetchWithAuth(`${BASE_URL}/admin/modules`);
  return res.json();
};

export const updateChapterPracticeUrl = async (
  moduleId: string,
  chapterKey: string,
  practiceUrl: string
) => {
  const res = await fetchWithAuth(`${BASE_URL}/admin/modules/${moduleId}/chapter`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chapterKey, practiceUrl }),
  });
  return res.json();
};

export const updateTopicContent = async (
  moduleId: string,
  chapterKey: string,
  topicId: string,
  data: { contentUrl?: string; videoUrl?: string }
) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/admin/modules/${moduleId}/topic`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterKey, topicId, ...data }),
    }
  );
  return res.json();
};

export const updateModuleTestUrl = async (
  moduleId: string,
  moduleTestUrl: string
) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/admin/modules/${moduleId}/test`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleTestUrl }),
    }
  );
  return res.json();
};

// 🔥 CREATE MODULE
export const createModule = async (data: {
  title: string;
  level: string;
}) => {
  const token = localStorage.getItem("token");

  const res = await fetchWithAuth(`${BASE_URL}/admin/modules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 🔥 FETCH USERS (PAGINATED + FILTERED)
export const fetchUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  paymentStatus?: string;
}) => {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams(
    Object.entries(params).reduce((acc: any, [k, v]) => {
      if (v) acc[k] = String(v);
      return acc;
    }, {})
  ).toString();

  const res = await fetchWithAuth(`${BASE_URL}/admin/users?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// 🔥 ANALYTICS
export const fetchUserAnalytics = async () => {
  const token = localStorage.getItem("token");

  const res = await fetchWithAuth(`${BASE_URL}/admin/users/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// 🔥 SINGLE USER (DETAIL VIEW)
export const fetchUserById = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetchWithAuth(`${BASE_URL}/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// 🔥 UPDATE USER (BASIC ADMIN CONTROL)
export const updateUser = async (
  id: string,
  data: {
    level?: string;
    paymentStatus?: string;
  }
) => {
  const token = localStorage.getItem("token");

  const res = await fetchWithAuth(`${BASE_URL}/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};