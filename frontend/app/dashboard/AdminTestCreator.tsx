// "use client";

// import React, { useState } from "react";
// import { Plus, Trash2 } from "lucide-react";

// export default function AdminTestCreator() {
//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const [title, setTitle] = useState("");
//   const [duration, setDuration] = useState(20);
//   const [level, setLevel] = useState("6-8");
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [questions, setQuestions] = useState([
//     { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }
//   ]);

//   const currentQ = questions[currentIndex];

//   const handlePublish = async () => {
//     if (!title) return alert("Test title required");

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_URL}/api/tests/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ title, duration, questions, level })
//       });

//       if (res.ok) {
//         alert(`🚀 Test published for level ${level}`);
//       } else {
//         alert("Failed to publish test");
//       }
//     } catch {
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }
//     ]);
//     setCurrentIndex(questions.length);
//   };

//   const deleteQuestion = (index: number) => {
//     if (questions.length === 1) return alert("At least one question required");

//     const newQs = questions.filter((_, i) => i !== index);
//     setQuestions(newQs);
//     setCurrentIndex(Math.max(0, index - 1));
//   };

//   return (
//     <main className="max-w-5xl mx-auto px-4 font-mono text-black">

//       {/* HEADER CONTROLS */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

//         <div className="bg-white border-[4px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
//           <label className="text-[10px] font-black uppercase">
//             Mission Title
//           </label>

//           <input
//             placeholder="ENTER TITLE..."
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full bg-transparent font-black italic text-lg md:text-xl outline-none"
//           />
//         </div>

//         <div className="border-[4px] border-black p-4 bg-cyan-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
//           <span className="font-black text-[10px] uppercase block">
//             Time Limit (Min)
//           </span>

//           <input
//             type="number"
//             value={duration}
//             onChange={(e) => setDuration(parseInt(e.target.value))}
//             className="bg-transparent font-black text-2xl md:text-3xl w-full outline-none"
//           />
//         </div>

//         <div className="border-[4px] border-black p-4 bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
//           <span className="font-black text-[10px] uppercase block">
//             Security Clearance
//           </span>

//           <select
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//             className="bg-transparent font-black text-lg md:text-xl w-full outline-none cursor-pointer"
//           >
//             <option value="6-8">LVL 6-8</option>
//             <option value="9-12">LVL 9-12</option>
//             <option value="College">ELITE</option>
//           </select>
//         </div>

//       </section>

//       {/* QUESTION NAV */}
//       <section className="flex flex-wrap gap-3 mb-10 bg-white p-4 md:p-6 border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">

//         {questions.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrentIndex(i)}
//             className={`w-12 h-12 border-[4px] border-black font-black text-lg transition-all
//             ${
//               currentIndex === i
//                 ? "bg-pink-500 text-white scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
//                 : "bg-white hover:bg-gray-100"
//             }`}
//           >
//             {i + 1}
//           </button>
//         ))}

//         <button
//           onClick={addQuestion}
//           className="w-12 h-12 border-[4px] border-black border-dashed bg-white hover:bg-black hover:text-white flex items-center justify-center"
//         >
//           <Plus size={22} />
//         </button>
//       </section>

//       {/* QUESTION CARD */}
//       <section className="border-[6px] border-black p-6 md:p-12 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] mb-10">

//         <textarea
//           placeholder="TYPE YOUR QUESTION HERE..."
//           value={currentQ.questionText}
//           onChange={(e) => {
//             const newQs = [...questions];
//             newQs[currentIndex].questionText = e.target.value;
//             setQuestions(newQs);
//           }}
//           className="w-full border-[4px] border-black p-5 md:p-6 font-black text-lg md:text-2xl min-h-[120px] outline-none mb-8 bg-gray-50"
//         />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//           {currentQ.options.map((opt, i) => (
//             <div
//               key={i}
//               onClick={() => {
//                 const newQs = [...questions];
//                 newQs[currentIndex].correctAnswer = i;
//                 setQuestions(newQs);
//               }}
//               className={`cursor-pointer border-[4px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
//               ${
//                 currentQ.correctAnswer === i
//                   ? "bg-green-400"
//                   : "bg-white hover:bg-gray-100"
//               }`}
//             >
//               <input
//                 value={opt}
//                 onChange={(e) => {
//                   const newQs = [...questions];
//                   newQs[currentIndex].options[i] = e.target.value;
//                   setQuestions(newQs);
//                 }}
//                 className="w-full bg-transparent font-black uppercase outline-none text-sm"
//                 placeholder={`OPTION ${i + 1}`}
//               />
//             </div>
//           ))}

//         </div>

//         {/* DELETE QUESTION */}
//         <button
//           onClick={() => deleteQuestion(currentIndex)}
//           className="mt-8 flex items-center gap-2 text-red-600 font-black"
//         >
//           <Trash2 size={18} /> Delete Question
//         </button>

//       </section>

//       {/* FOOTER NAV */}
//       <section className="flex flex-wrap justify-between gap-4 pb-20">

//         <button
//           onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
//           className="border-[4px] border-black px-8 py-4 font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
//         >
//           PREV
//         </button>

//         <button
//           onClick={handlePublish}
//           disabled={loading}
//           className="bg-black text-white px-10 md:px-16 py-5 font-black uppercase text-lg md:text-2xl shadow-[10px_10px_0px_0px_rgba(236,72,153,1)] hover:bg-pink-500 transition"
//         >
//           {loading ? "Publishing..." : "Activate Test"}
//         </button>

//         <button
//           onClick={() =>
//             setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
//           }
//           className="border-[4px] border-black px-8 py-4 font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
//         >
//           NEXT
//         </button>

//       </section>
//     </main>
//   );
// }