// "use client";

// import React, { useState } from "react";
// import AdminTestCreator from "./AdminTestCreator";
// import AdminModuleLinker from "./AdminModuleLinker";
// import { BookOpen, PenTool, LogOut, Menu } from "lucide-react";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<"tests" | "modules">("tests");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-[#fffbeb] font-mono text-black">

//       {/* MOBILE MENU BUTTON */}
//       <button
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-3 rounded-lg"
//       >
//         <Menu size={22} />
//       </button>

//       {/* SIDEBAR */}
//       <aside
//         className={`fixed md:relative z-40 w-72 bg-white border-r-[6px] border-black p-6 flex flex-col transition-transform duration-300
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//       >
//         <header className="bg-blue-600 text-white p-4 border-4 border-black mb-10 shadow-lg">
//           <h1 className="text-3xl font-black uppercase italic">
//             Admin Panel
//           </h1>
//         </header>

//         {/* NAVIGATION */}
//         <nav className="flex-1 space-y-6">

//           <button
//             onClick={() => {
//               setActiveTab("tests");
//               setSidebarOpen(false);
//             }}
//             className={`w-full flex items-center gap-3 p-4 border-[4px] border-black font-black uppercase text-sm transition-all
//             ${activeTab === "tests" ? "bg-yellow-400" : "bg-white hover:bg-gray-100"}`}
//           >
//             <PenTool size={20} /> Create Test
//           </button>

//           <button
//             onClick={() => {
//               setActiveTab("modules");
//               setSidebarOpen(false);
//             }}
//             className={`w-full flex items-center gap-3 p-4 border-[4px] border-black font-black uppercase text-sm
//             ${activeTab === "modules" ? "bg-pink-400" : "bg-white hover:bg-gray-100"}`}
//           >
//             <BookOpen size={20} /> Modules
//           </button>
//         </nav>

//         {/* LOGOUT */}
//         <button
//           onClick={() => {
//             localStorage.clear();
//             window.location.href = "/";
//           }}
//           className="mt-auto flex items-center justify-center gap-3 p-4 border-[4px] border-black font-black uppercase text-xs bg-black text-white hover:bg-red-600 transition"
//         >
//           <LogOut size={18} /> Logout
//         </button>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">

//         <section className="max-w-6xl mx-auto">

//           {activeTab === "tests" && <AdminTestCreator />}

//           {activeTab === "modules" && <AdminModuleLinker />}

//         </section>

//       </main>
//     </div>
//   );
// }