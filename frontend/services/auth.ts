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

  studentPhone: string;
  parentPhone: string;
  parentEmail: string;

  level: string;
  school: string;
  city: string;
  state: string;
  board: string;

  paymentStatus: "pending" | "completed"; // ✅ NEW
  role?: string;
}

// 🔐 LOGIN
export async function loginUser(data: LoginPayload & { recaptchaToken?: string }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 👤 GET PROFILE
export async function getProfile() {
  return apiRequest("/auth/profile", {
    method: "GET",
  });
}

// ✏️ UPDATE PROFILE
export async function updateProfile(data: any) {
  return apiRequest("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// 📝 REGISTER
export async function registerUser(data: RegisterPayload & { recaptchaToken?: string }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔐 REGISTER FLOW

export async function sendRegisterOtp(email: string, recaptchaToken: string) {
  return apiRequest("/auth/send-register-otp", {
    method: "POST",
    body: JSON.stringify({ email, recaptchaToken }),
  });
}

export async function verifyRegisterOtp(email: string, otp: string, recaptchaToken: string) {
  return apiRequest("/auth/verify-register-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp, recaptchaToken }),
  });
}

export async function createOrder(amount: number, email: string) {
  return apiRequest("/payment/create-order", {
    method: "POST",
    body: JSON.stringify({ amount, email }),
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