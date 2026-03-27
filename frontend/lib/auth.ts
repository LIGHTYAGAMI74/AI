import { apiRequest } from "./api";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}