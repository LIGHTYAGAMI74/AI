// "use client";

// import React, { useState } from "react";
// import { Layers } from "lucide-react";

// export default function AdminModuleLinker() {
//   const [title, setTitle] = useState("");
//   const [notionUrl, setNotionUrl] = useState("");
//   const [level, setLevel] = useState("6-8");
//   const [loading, setLoading] = useState(false);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");

//     try {
//       setLoading(true);

//       const res = await fetch(`${API_URL}/api/module/add`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ title, notionUrl, level }),
//       });

//       if (res.ok) {
//         alert("✅ Module Saved!");
//         setTitle("");
//         setNotionUrl("");
//       } else {
//         alert("❌ Failed to save module");
//       }
//     } catch (error) {
//       alert("⚠️ Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="w-full max-w-3xl mx-auto px-4">

//       {/* PAGE HEADER */}
//       <header className="mb-10 md:mb-12">
//         <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">
//           Link{" "}
//           <span className="bg-pink-400 px-3 md:px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
//             Modules
//           </span>
//         </h2>

//         <p className="mt-3 text-sm font-bold text-gray-600">
//           Connect your learning modules from Notion to the platform.
//         </p>
//       </header>

//       {/* FORM */}
//       <form
//         onSubmit={handleSave}
//         className="border-[6px] border-black bg-white p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg]"
//       >
//         {/* MODULE TITLE */}
//         <div className="mb-8">
//           <label className="block text-xs md:text-sm font-black uppercase mb-2 italic">
//             Module Designation
//           </label>

//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border-4 border-black p-4 md:p-5 font-black outline-none focus:bg-yellow-50 text-lg md:text-xl"
//             placeholder="E.G. NEURAL NETS 101"
//             required
//           />
//         </div>

//         {/* LEVEL SELECT */}
//         <div className="mb-8">
//           <label className="block text-xs md:text-sm font-black uppercase mb-2 italic">
//             Clearance Level
//           </label>

//           <select
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//             className="w-full border-4 border-black p-4 md:p-5 font-black uppercase bg-white outline-none cursor-pointer hover:bg-gray-50 text-lg"
//           >
//             <option value="6-8">Class 6-8 (Junior Agent)</option>
//             <option value="9-12">Class 9-12 (Senior Agent)</option>
//             <option value="College">College (Elite Operative)</option>
//           </select>
//         </div>

//         {/* NOTION URL */}
//         <div className="mb-10">
//           <label className="block text-xs md:text-sm font-black uppercase mb-2 italic">
//             Notion Data Hub URL
//           </label>

//           <input
//             type="url"
//             value={notionUrl}
//             onChange={(e) => setNotionUrl(e.target.value)}
//             className="w-full border-4 border-black p-4 md:p-5 font-black outline-none focus:bg-yellow-50 text-sm md:text-base"
//             placeholder="https://notion.site/..."
//             required
//           />
//         </div>

//         {/* SUBMIT BUTTON */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-5 md:py-6 font-black uppercase tracking-widest text-lg md:text-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
//         >
//           {loading ? "Transmitting..." : "Transmit Data"}
//         </button>
//       </form>
//     </section>
//   );
// }