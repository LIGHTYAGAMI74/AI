"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { loginUser, sendResetOtp, verifyResetOtp, resetPassword } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Forgot password states
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Access Denied: Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Forgot password flow
  const handleSendOtp = async () => {
    await sendResetOtp(email);
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    await verifyResetOtp(email, otp);
    setStep("reset");
  };

  const handleResetPassword = async () => {
    await resetPassword(email, otp, newPassword);
    alert("Password updated!");
    setShowModal(false);
    setStep("email");
    setOtp("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] flex items-center justify-center p-4 md:p-6 font-mono text-black">
      
      <Link href="/">
        <button className="fixed top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all z-50">
          <ArrowLeft size={16} strokeWidth={3} />
          <span>Exit Protocol</span>
        </button>
      </Link>

      <div className="w-full max-w-md bg-white border-4 md:border-[6px] border-black p-6 md:p-10 rounded-none shadow-[12px_12px_0px_0px_rgba(234,179,8,1)]">
        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">
          Welcome Back<span className="text-yellow-500">.</span>
        </h1>
        <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] md:text-xs">
          Initiate Authentication Protocol
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase mb-2">
              Security ID (Email)
            </label>
            <input 
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border-4 border-black p-4 rounded-none font-bold focus:bg-yellow-50 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-2">
              Access Key (Password)
            </label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              className="w-full border-4 border-black p-4 rounded-none font-bold focus:bg-yellow-50 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 🔥 NEW (non-intrusive) */}
          <div className="text-right -mt-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-xs font-black underline text-blue-600"
            >
              Forgot Password?
            </button>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-gray-400 cursor-wait' : 'bg-black hover:bg-blue-600'
            } text-white py-5 rounded-none font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all`}
          >
            {isLoading ? "Waking System..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t-4 border-black border-dashed text-center">
          <p className="font-bold text-sm">
            New operative?{" "}
            <Link
              href="/register"
              className="text-blue-600 underline decoration-4 underline-offset-4 font-black"
            >
              GET CLEARANCE
            </Link>
          </p>
        </div>
      </div>

      {/* 🔥 MODAL (theme-consistent) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_black]">

            {step === "email" && (
              <>
                <h2 className="font-black text-xl mb-4 uppercase">Recover Access</h2>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full border-4 border-black p-4 font-bold mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSendOtp}
                  className="w-full bg-black text-white py-4 font-black">
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <h2 className="font-black text-xl mb-4 uppercase">Verify OTP</h2>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border-4 border-black p-4 font-bold mb-4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleVerifyOtp}
                  className="w-full bg-black text-white py-4 font-black">
                  Verify
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <h2 className="font-black text-xl mb-4 uppercase">New Password</h2>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full border-4 border-black p-4 font-bold mb-4"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleResetPassword}
                  className="w-full bg-black text-white py-4 font-black">
                  Reset Password
                </button>
              </>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-xs underline w-full font-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}