// "use client";
// import React, { useState, useEffect } from 'react';
// import StudentModules from './StudentModule';
// import StudentAnalytics from './StudentAnalytics'; 
// import StudentTests from './StudentTest';
// import { Book, BarChart2, PenTool, LogOut, X, AlertTriangle } from 'lucide-react';

// export default function StudentDashboard() {
//   const [activeTab, setActiveTab] = useState<'modules' | 'analytics' | 'tests'>('modules');
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   // 1. SESSION PROTECTION: Redirect if not logged in as student
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("userRole");

//     if (!token || role !== 'student') {
//       window.location.href = '/login';
//     }
//   }, []);

//   // 2. LOGOUT LOGIC
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userRole");
//     window.location.href = '/login';
//   };

//   return (
//     <div className="flex min-h-screen bg-white font-sans text-black">
      
//       {/* --- SIDEBAR --- */}
//       <aside className="w-64 border-r-4 border-black p-6 flex flex-col sticky top-0 h-screen">
//         <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-10">
//           STUDENT<span className="text-yellow-500">.</span>
//         </h1>
        
//         <nav className="flex-1 space-y-4">
//           <button 
//             onClick={() => setActiveTab('modules')} 
//             className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${activeTab === 'modules' ? 'bg-blue-400' : 'bg-white hover:bg-gray-50'}`}
//           >
//             <Book size={20} /> Modules
//           </button>
          
//           <button 
//             onClick={() => setActiveTab('analytics')} 
//             className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${activeTab === 'analytics' ? 'bg-green-400' : 'bg-white hover:bg-gray-50'}`}
//           >
//             <BarChart2 size={20} /> Analytics
//           </button>
          
//           <button 
//             onClick={() => setActiveTab('tests')} 
//             className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${activeTab === 'tests' ? 'bg-yellow-400' : 'bg-white hover:bg-gray-50'}`}
//           >
//             <PenTool size={20} /> Attempt Test
//           </button>
//         </nav>

//         {/* LOGOUT TRIGGER */}
//         <button 
//           onClick={() => setShowLogoutModal(true)}
//           className="mt-auto flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm bg-red-100 hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
//         >
//           <LogOut size={20} /> Logout
//         </button>
//       </aside>

//       {/* --- MAIN CONTENT AREA --- */}
//       <main className="flex-1 p-10 overflow-y-auto">
//         {activeTab === 'modules' && <StudentModules />}
//         {activeTab === 'analytics' && <StudentAnalytics />}
//         {activeTab === 'tests' && <StudentTests />}
//       </main>

//       {/* --- LOGOUT CONFIRMATION MODAL --- */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
//           <div className="w-full max-w-sm border-4 border-black bg-white p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-start mb-4">
//               <div className="p-3 bg-red-100 border-2 border-black rounded-xl">
//                 <AlertTriangle className="text-red-600" size={24} />
//               </div>
//               <button onClick={() => setShowLogoutModal(false)} className="hover:rotate-90 transition-transform">
//                 <X size={24} />
//               </button>
//             </div>
            
//             <h2 className="text-2xl font-black uppercase mb-2">Terminate Session?</h2>
//             <p className="font-bold text-gray-500 text-sm mb-8 leading-relaxed">
//               Are you sure you want to logout? Your progress on this screen will be unsaved.
//             </p>

//             <div className="flex flex-col gap-3">
//               <button 
//                 onClick={handleLogout}
//                 className="w-full bg-red-600 text-white border-4 border-black py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 active:translate-y-1 active:shadow-none transition-all"
//               >
//                 YES, LOGOUT
//               </button>
//               <button 
//                 onClick={() => setShowLogoutModal(false)}
//                 className="w-full bg-white border-4 border-black py-4 font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
//               >
//                 CANCEL
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from 'react';
import Script from 'next/script'; // Import for Razorpay
import StudentModules from './StudentModule';
import StudentAnalytics from './StudentAnalytics'; 
import StudentTests from './StudentTest';
import { Book, BarChart2, PenTool, LogOut, X, AlertTriangle, Lock } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'modules' | 'analytics' | 'tests'>('modules');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. SESSION PROTECTION & DATA FETCH
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== 'student') {
      window.location.href = '/login';
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/auth/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Profile sync error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. RAZORPAY PAYMENT LOGIC
  const handlePayment = async () => {
  const token = localStorage.getItem("token");
  
  try {
    const res = await fetch("http://localhost:5050/api/payment/create-order", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });

    const order = await res.json();

    if (!res.ok) {
        throw new Error(order.error || "Failed to create order");
    }

    const options = {
      // 1. HARDCODE YOUR KEY HERE FOR TESTING
      key: "rzp_live_S5BtnHluGPnRR3", 
      amount: order.amount,
      currency: order.currency,
      name: "BEN AI Academy",
      description: "Neural Network Access Fee",
      order_id: order.id,
      handler: async function (response: any) {
        const verifyRes = await fetch("http://localhost:5050/api/payment/verify-payment", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(response)
        });
        const result = await verifyRes.json();
        if (result.success) {
          alert("AUTHENTICATION SUCCESSFUL. ACCESS GRANTED.");
          window.location.reload(); 
        }
      },
      prefill: { name: user?.name, email: user?.email },
      theme: { color: "#000000" }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error: any) {
    alert(error.message);
    console.error("Payment Start Error:", error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = '/login';
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic animate-pulse text-2xl">SYNCING_INTELLIGENCE...</div>;

  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r-4 border-black p-6 flex flex-col sticky top-0 h-screen">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-10">
          STUDENT<span className="text-yellow-500">.</span>
        </h1>
        
        <nav className="flex-1 space-y-4">
          <button 
            disabled={!user?.isPaid}
            onClick={() => setActiveTab('modules')} 
            className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${!user?.isPaid ? 'opacity-30 cursor-not-allowed' : activeTab === 'modules' ? 'bg-blue-400' : 'bg-white hover:bg-gray-50'}`}
          >
            <Book size={20} /> Modules {!user?.isPaid && <Lock size={14} className="ml-auto" />}
          </button>
          
          <button 
            disabled={!user?.isPaid}
            onClick={() => setActiveTab('analytics')} 
            className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${!user?.isPaid ? 'opacity-30 cursor-not-allowed' : activeTab === 'analytics' ? 'bg-green-400' : 'bg-white hover:bg-gray-50'}`}
          >
            <BarChart2 size={20} /> Analytics {!user?.isPaid && <Lock size={14} className="ml-auto" />}
          </button>
          
          <button 
            disabled={!user?.isPaid}
            onClick={() => setActiveTab('tests')} 
            className={`w-full flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${!user?.isPaid ? 'opacity-30 cursor-not-allowed' : activeTab === 'tests' ? 'bg-yellow-400' : 'bg-white hover:bg-gray-50'}`}
          >
            <PenTool size={20} /> Attempt Test {!user?.isPaid && <Lock size={14} className="ml-auto" />}
          </button>
        </nav>

        <button 
          onClick={() => setShowLogoutModal(true)}
          className="mt-auto flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-sm bg-red-100 hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-10 overflow-y-auto">
        {!user?.isPaid ? (
          /* PAYMENT WALL */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="p-6 bg-yellow-100 border-4 border-black rounded-full mb-8 animate-bounce">
              <Lock size={48} />
            </div>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Access Denied</h2>
            <p className="text-xl font-bold text-gray-600 mb-10 leading-tight">
              To unlock your academic modules and the AI Olympiad test engine, a one-time activation fee of <span className="text-black underline">₹149</span> is required.
            </p>
            <button 
              onClick={handlePayment}
              className="group relative bg-black text-white px-12 py-6 rounded-3xl font-black uppercase text-2xl tracking-widest shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Unlock Intelligence ↗
            </button>
            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Payment via Razorpay</p>
          </div>
        ) : (
          /* ACTUAL DASHBOARD */
          <>
            {activeTab === 'modules' && <StudentModules />}
            {activeTab === 'analytics' && <StudentAnalytics />}
            {activeTab === 'tests' && <StudentTests />}
          </>
        )}
      </main>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="w-full max-sm border-4 border-black bg-white p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase mb-2">Terminate Session?</h2>
            <div className="flex flex-col gap-3 mt-6">
              <button onClick={handleLogout} className="w-full bg-red-600 text-white border-4 border-black py-4 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">YES, LOGOUT</button>
              <button onClick={() => setShowLogoutModal(false)} className="w-full bg-white border-4 border-black py-4 font-black uppercase">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}