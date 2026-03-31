// services/auth.ts

import { apiRequest } from "@/lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  level?: string;
}

// 🔐 LOGIN
export async function loginUser(data: LoginPayload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 📝 REGISTER
export async function registerUser(data: RegisterPayload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

 // 🔐 FORGOT PASSWORD FLOW

// 1. Send OTP
export async function sendResetOtp(email: string) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// 2. Verify OTP
export async function verifyResetOtp(email: string, otp: string) {
  return apiRequest("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

// 3. Reset Password
export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, newPassword }),
  });
}