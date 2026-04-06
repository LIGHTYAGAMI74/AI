"use client";
import React from 'react';
import Script from 'next/script';
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function PayButton() {
  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    // 1. Create Order on Backend
    const res = await fetchWithAuth("http://localhost:5050/api/payment/create-order", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const order = await res.json();

    // 2. Open Razorpay Checkout
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", 
      amount: order.amount,
      currency: order.currency,
      name: "Gridixa AI Olympiad Academy",
      description: "Access to All Modules & Tests",
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify on Backend
        const verifyRes = await fetchWithAuth("http://localhost:5050/api/payment/verify-payment", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(response)
        });
        const result = await verifyRes.json();
        if (result.success) {
          alert("Payment Verified! Welcome aboard.");
          window.location.reload(); // Refresh to show dashboard
        }
      },
      theme: { color: "#000000" }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button 
        onClick={handlePayment}
        className="bg-yellow-400 border-4 border-black px-10 py-4 font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
      >
        Unlock Full Access - ₹149
      </button>
    </>
  );
}