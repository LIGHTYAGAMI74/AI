"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { loginUser, sendResetOtp, verifyResetOtp, resetPassword, createOrder } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Forgot password states
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 💳 Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // 🔐 LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });

      login(data.token, data.user);

      // 🔥 PAYMENT CHECK
      if (data.user.paymentStatus === "pending") {
        setShowPaymentModal(true);
      } else {
        router.push("/dashboard");
      }

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

  // 💳 PAYMENT HANDLER
  const handlePayment = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) return alert("Razorpay failed");

    const order = await createOrder(14900, email);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "AI Olympiad",
      description: "Complete Registration",
      order_id: order.id,
      handler: async function (response: any) {
        await apiRequest("/payment/verify", {
          method: "POST",
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            email
          })
        });

        alert("Payment Successful!");
        setShowPaymentModal(false);
        router.push("/dashboard");
      },
      prefill: {
        email,
      },
      theme: { color: "#000000" }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] flex items-center justify-center p-4 md:p-6 font-mono text-black">
      
      {/* BACK BUTTON */}
      <Link href="/">
        <button className="fixed top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all z-50">
          <ArrowLeft size={16} strokeWidth={3} />
          <span>Exit Protocol</span>
        </button>
      </Link>

      {/* LOGIN CARD */}
      <div className="w-full max-w-lg md:max-w-xl bg-white border-4 md:border-[6px] border-black p-6 md:p-10 rounded-none shadow-[12px_12px_0px_0px_rgba(234,179,8,1)]">
        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">
          Welcome Back<span className="text-yellow-500">.</span>
        </h1>

        <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] md:text-xs">
          Initiate Authentication Protocol
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          <input 
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border-4 border-black p-4 font-bold"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="password"
            required
            placeholder="••••••••"
            className="w-full border-4 border-black p-4 font-bold"
            onChange={(e) => setPassword(e.target.value)}
          />

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
            className="w-full bg-yellow-400 text-black py-5 font-black uppercase shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 hover:text-white"
          >
            {isLoading ? "Waking System..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t-4 border-black border-dashed text-center">
          <p className="font-bold text-sm">
            New Account?{" "}
            <Link
              href="/register"
              className="text-blue-600 underline decoration-4 underline-offset-4 font-black"
            >
              REGISTER HERE
            </Link>
          </p>
        </div>
      </div>

      {/* 🔥 PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_black] text-center">

            <h2 className="font-black text-xl mb-4 uppercase">
              Complete Registration
            </h2>

            <p className="font-bold mb-6">
              Your account is created but payment is pending.
            </p>

            <p className="font-black text-lg mb-6">
              Pay ₹149 to unlock dashboard
            </p>

            <button
              onClick={handlePayment}
              className="w-full bg-black text-white py-4 font-black"
            >
              Pay Now
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-4 text-xs underline w-full font-black"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL (UNCHANGED) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_black]">

            {step === "email" && (
              <>
                <h2 className="font-black text-xl mb-4 uppercase">Recover Access</h2>
                <input className="w-full border-4 border-black p-4 font-bold mb-4"
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
                <input className="w-full border-4 border-black p-4 mb-4"
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
                <input type="password"
                  className="w-full border-4 border-black p-4 mb-4"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleResetPassword}
                  className="w-full bg-black text-white py-4 font-black">
                  Reset Password
                </button>
              </>
            )}

            <button onClick={() => setShowModal(false)}
              className="mt-4 text-xs underline w-full font-black">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Razorpay loader
function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
}