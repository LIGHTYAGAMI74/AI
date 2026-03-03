"use client";
import React, { useState, useEffect } from 'react';
import Script from 'next/script'; 
import StudentModules from './StudentModule';
import StudentAnalytics from './StudentAnalytics'; 
import StudentTests from './StudentTest';
import { Book, BarChart2, PenTool, LogOut, Lock, Zap } from 'lucide-react';

export default function StudentDashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [activeTab, setActiveTab] = useState<'modules' | 'analytics' | 'tests'>('modules');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== 'student') { window.location.href = '/login'; return; }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) { console.error("Profile sync error"); } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const order = await res.json();
      const options = {
        key: "rzp_live_S5BtnHluGPnRR3", 
        amount: order.amount,
        currency: order.currency,
        name: "BEN AI ACADEMY",
        description: "NEURAL ACCESS TOKEN",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API_URL}/api/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(response)
          });
          const result = await verifyRes.json();
          if (result.success) { window.location.reload(); }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#000000" }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) { alert(error.message); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic bg-white text-4xl uppercase animate-pulse">Initializing Hub...</div>;

  return (
    <div className="flex min-h-screen bg-[#fff9e6] font-mono text-black">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <aside className="w-72 border-r-[6px] border-black p-6 flex flex-col bg-white sticky top-0 h-screen">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12 bg-yellow-400 border-4 border-black px-4 py-2 -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Agent<span className="text-blue-600">!</span>
        </h1>
        
        <nav className="flex-1 space-y-6">
          {[
            { id: 'modules', icon: <Book size={24} />, label: 'Data Hub', color: 'bg-blue-400' },
            { id: 'analytics', icon: <BarChart2 size={24} />, label: 'Stats', color: 'bg-green-400' },
            { id: 'tests', icon: <PenTool size={24} />, label: 'Missions', color: 'bg-pink-400' },
          ].map((tab) => (
            <button 
              key={tab.id}
              disabled={!user?.isPaid}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center gap-3 p-5 border-[4px] border-black font-black uppercase text-sm transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${!user?.isPaid ? 'opacity-30' : activeTab === tab.id ? tab.color : 'bg-white'}`}
            >
              {tab.icon} {tab.label} {!user?.isPaid && <Lock size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setShowLogoutModal(true)}
          className="mt-auto flex items-center gap-3 p-4 border-[4px] border-black font-black uppercase text-xs bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,0,0,1)]"
        >
          <LogOut size={20} /> Terminate
        </button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        {!user?.isPaid ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="p-10 bg-pink-500 border-[6px] border-black rounded-none -rotate-3 mb-12 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
              <Lock size={80} color="white" strokeWidth={3} />
            </div>
            <h2 className="text-7xl font-black uppercase italic leading-none mb-6">Access <span className="bg-black text-white px-4">Denied!</span></h2>
            <p className="text-2xl font-black mb-10 leading-none">The Neural Network is locked. Pay <span className="underline decoration-pink-500">₹149</span> to unlock all modules and testing protocols.</p>
            <button 
              onClick={handlePayment}
              className="bg-yellow-400 text-black border-[6px] border-black px-16 py-8 font-black uppercase text-3xl shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] hover:bg-white transition-all rotate-1"
            >
              UNLOCK NOW ↗
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {activeTab === 'modules' && <StudentModules />}
            {activeTab === 'analytics' && <StudentAnalytics />}
            {activeTab === 'tests' && <StudentTests />}
          </div>
        )}
      </main>
    </div>
  );
}