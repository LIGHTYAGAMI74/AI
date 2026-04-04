"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  createOrder,
  registerUser
} from "@/services/auth";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {

  const router = useRouter();
  
  const STATES = [
    "Delhi","Uttar Pradesh","Haryana","Punjab","Rajasthan","Bihar",
    "Madhya Pradesh","Maharashtra","Gujarat","West Bengal","Karnataka",
    "Tamil Nadu","Kerala","Telangana","Andhra Pradesh","Odisha","Assam"
  ];

  const BOARDS = [
    "CBSE","ICSE","NIOS","Delhi Board","UP Board","HBSE","RBSE","Punjab Board","Other"
  ];

  const [errors, setErrors] = useState<any>({});
  const [userExists, setUserExists] = useState(false);

  // OTP timer
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    studentPhone: "",
    email: "",
    parentPhone: "",
    parentEmail: "",
    password: "",
    level: "",
    school: "",
    city: "",
    state: "",
    board: "",
    paymentStatus: "pending" // 🔥 KEY ADDITION
  });

  React.useEffect(() => {
    if (step === 3 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timer === 0) setCanResend(true);
  }, [step, timer]);

  // STEP 1 → ONLY MOVE FORWARD
  const handlePersonalNext = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = await validateStep1();
    if (!valid) return;

    setStep(2);
  };

  // STEP 2 → SEND OTP HERE
  const handleSchoolNext = async (e: React.FormEvent) => {
    e.preventDefault();

    await sendRegisterOtp(formData.email); // ✅ HERE
    setStep(3);
  };

  // 🔢 STEP 3 → VERIFY OTP
  const handleVerifyOtp = async () => {
    await verifyRegisterOtp(formData.email, otp);

    // ✅ CREATE USER HERE (IMPORTANT)
    await registerUser({
      ...formData,
      paymentStatus: "pending" // 🔥 KEY ADDITION
    });

    setStep(4);
  };

  // 💳 STEP 4 → PAYMENT
  const handlePayment = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) return alert("Razorpay failed");

    const order = await createOrder(14900, formData.email);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "AI Olympiad",
      description: "Registration Fee",
      order_id: order.id,
      handler: async function (response: any) {
        await apiRequest("/payment/verify", {
          method: "POST",
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            email: formData.email
          })
        });

        alert("Payment Successful!");
        router.push("/dashboard");
    },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.studentPhone,
      },
      theme: { color: "#000000" }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const validateStep1 = async () => {
    let newErrors: any = {};

    if (!/^\d{10}$/.test(formData.studentPhone))
      newErrors.studentPhone = "Invalid phone";

    if (!/^\d{10}$/.test(formData.parentPhone))
      newErrors.parentPhone = "Invalid phone";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail))
      newErrors.parentEmail = "Invalid email";

    if (formData.password.length < 6)
      newErrors.password = "Weak password";

    setErrors(newErrors);

    // 🔥 CHECK USER EXISTS
    if (!newErrors.email) {
      try {
        await apiRequest(`/auth/check-user?email=${formData.email}`);
        setUserExists(false);
      } catch {
        setUserExists(true);
        newErrors.email = "User already exists";
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] flex items-center justify-center p-6 font-sans text-black">
      <div className="w-full max-w-lg md:max-w-xl bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2 underline decoration-yellow-400">
          Join Olympiad<span className="text-blue-500"> !</span>
        </h1>

        <p className="text-gray-500 font-bold mb-6 uppercase text-[10px] tracking-widest">
          Step {step} of 4
        </p>

        {/* STEP 1 - PERSONAL */}
        {step === 1 && (
          <form onSubmit={handlePersonalNext} className="space-y-5">

            <input placeholder="Student Full Name"
              className="w-full border-4 border-black p-3 rounded-xl font-bold"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Student Phone"
                className={`w-full border-4 p-3 rounded-xl font-bold transition ${errors.studentPhone ? "border-red-500 bg-red-50" : "border-black"}`}
                title={errors.studentPhone || ""}
                aria-invalid={!!errors.studentPhone}
                aria-describedby={errors.studentPhone ? "studentPhoneError" : undefined}
                onChange={(e) => setFormData({...formData, studentPhone: e.target.value})}
              />

              <input type="email" placeholder="Student Email"
                className={`w-full border-4 p-3 rounded-xl font-bold transition ${errors.email ? "border-red-500 bg-red-50" : "border-black"}`}
                title={errors.email || ""}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "emailError" : undefined}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            {errors.studentPhone && <p id="studentPhoneError" className="text-red-500 text-xs">{errors.studentPhone}</p>}
            {errors.email && <p id="emailError" className="text-red-500 text-xs">{errors.email}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Parent Phone"
                className={`w-full border-4 p-3 rounded-xl font-bold transition ${errors.parentPhone ? "border-red-500 bg-red-50" : "border-black"}`}
                title={errors.parentPhone || ""}
                aria-invalid={!!errors.parentPhone}
                aria-describedby={errors.parentPhone ? "parentPhoneError" : undefined}
                onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
              />

              <input type="email" placeholder="Parent Email"
                className={`w-full border-4 p-3 rounded-xl font-bold transition ${errors.parentEmail ? "border-red-500 bg-red-50" : "border-black"}`}
                title={errors.parentEmail || ""}
                aria-invalid={!!errors.parentEmail}
                aria-describedby={errors.parentEmail ? "parentEmailError" : undefined}
                onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
              />
            </div>
            {errors.parentPhone && <p id="parentPhoneError" className="text-red-500 text-xs">{errors.parentPhone}</p>}
            {errors.parentEmail && <p id="parentEmailError" className="text-red-500 text-xs">{errors.parentEmail}</p>}

            <input type="password" placeholder="Password"
              className="w-full border-4 border-black p-3 rounded-xl font-bold"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {formData.password && formData.password.length < 6 && (
              <p className="text-yellow-600 text-xs font-bold">
                Weak password (min 6 chars recommended)
              </p>
            )}

            <button className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition duration-200">
              Continue
            </button>
          </form>
        )}

        {/* STEP 2 - SCHOOL */}
        {step === 2 && (
          <form onSubmit={handleSchoolNext} className="space-y-5">

            <select className="w-full border-4 border-black p-3 font-bold"
              onChange={(e) => setFormData({...formData, level: e.target.value})}>
              <option>Class Range</option>
              <option value="6-8">6-8</option>
              <option value="9-10">9-10</option>
              <option value="11-12">11-12</option>
            </select>

            <input placeholder="School Name"
              className="w-full border-4 border-black p-3 font-bold"
              onChange={(e) => setFormData({...formData, school: e.target.value})}
            />

            <input placeholder="City"
              className="w-full border-4 border-black p-3 font-bold"
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />

            <select
              className="w-full border-4 border-black p-3 font-bold bg-white"
              onChange={(e) => setFormData({...formData, state: e.target.value})}
            >
              <option>Select State</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="w-full border-4 border-black p-3 font-bold bg-white"
              onChange={(e) => setFormData({...formData, board: e.target.value})}
            >
              <option>Select Board</option>
              {BOARDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <button className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition duration-200">
              Continue
            </button>
          </form>
        )}

        {/* STEP 3 - OTP */}
        {step === 3 && (
          <div className="space-y-5">
            <input placeholder="Enter OTP"
              className="w-full border-4 border-black p-3 font-bold"
              onChange={(e) => setOtp(e.target.value)}
            />

            {canResend ? (
              <button
                onClick={async () => {
                  await sendRegisterOtp(formData.email);
                  setTimer(60);
                  setCanResend(false);
                }}
                className="text-blue-600 underline font-bold text-sm"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-xs">
                Resend in {timer}s
              </p>
            )}

            <button onClick={handleVerifyOtp}
              className="w-full bg-black text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition duration-200">
              Verify OTP
            </button>
          </div>
        )}

        {/* STEP 4 - PAYMENT */}
        {step === 4 && (
          <div className="space-y-5 text-center">
            <p className="font-black text-lg">Registration Fee: ₹149</p>

            <button onClick={handlePayment}
              className="w-full bg-black text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition duration-200">
              Pay & Register
            </button>
          </div>
        )}

        <p className="mt-8 text-center font-bold text-sm">
          Already registered?
        </p>
        <p className="text-center font-bold text-sm">
          <Link href="/login" className="text-blue-600 underline hover:text-yellow-500 transition duration-200">Login here</Link>
        </p>

      </div>
    </div>
  );
}

// 🔥 Razorpay loader
function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
}