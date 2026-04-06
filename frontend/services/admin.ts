import { fetchWithAuth } from "@/lib/fetchWithAuth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//////////////////////////////////////////////////////////
// 📦 MODULES
//////////////////////////////////////////////////////////

export const fetchModules = async () => {
  const res = await fetchWithAuth(`${BASE_URL}/admin/modules`);
  return res.json();
};

export const createModule = async (data: {
  title: string;
  level: string;
}) => {
  const res = await fetchWithAuth(`${BASE_URL}/admin/modules`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateChapterPracticeUrl = async (
  moduleId: string,
  chapterKey: string,
  practiceUrl: string
) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/admin/modules/${moduleId}/chapter`,
    {
      method: "PUT",
      body: JSON.stringify({ chapterKey, practiceUrl }),
    }
  );

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
      body: JSON.stringify({
        chapterKey,
        topicId,
        ...data,
      }),
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
      body: JSON.stringify({ moduleTestUrl }),
    }
  );

  return res.json();
};

//////////////////////////////////////////////////////////
// 👤 USERS
//////////////////////////////////////////////////////////

export const fetchUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  paymentStatus?: string;
}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc: any, [k, v]) => {
      if (v !== undefined && v !== "") acc[k] = String(v);
      return acc;
    }, {})
  ).toString();

  const res = await fetchWithAuth(
    `${BASE_URL}/admin/users${query ? `?${query}` : ""}`
  );

  return res.json();
};

export const fetchUserAnalytics = async () => {
  const res = await fetchWithAuth(`${BASE_URL}/admin/users/analytics`);
  return res.json();
};

export const fetchUserById = async (id: string) => {
  const res = await fetchWithAuth(`${BASE_URL}/admin/users/${id}`);
  return res.json();
};

export const updateUser = async (
  id: string,
  data: {
    level?: string;
    paymentStatus?: string;
  }
) => {
  const res = await fetchWithAuth(`${BASE_URL}/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return res.json();
};