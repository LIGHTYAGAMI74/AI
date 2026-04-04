// "use client";

// import React, { useEffect, useState, useRef } from "react";

// export default function LockedExam({
//   test,
//   onFinish,
// }: {
//   test: any;
//   onFinish: () => void;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
//     new Array(test.questions.length).fill(-1)
//   );

//   const [timeLeft, setTimeLeft] = useState(test.duration * 60);

//   /* ---------------- FULLSCREEN ---------------- */
//   useEffect(() => {
//     const enterFS = async () => {
//       try {
//         if (containerRef.current?.requestFullscreen) {
//           await containerRef.current.requestFullscreen();
//         }
//       } catch (err) {
//         console.warn("Fullscreen blocked by browser policy.");
//       }
//     };
//     enterFS();
//   }, []);

//   /* ---------------- TIMER ---------------- */
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           submitExam();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   /* ---------------- BLOCK REFRESH ---------------- */
//   useEffect(() => {
//     const preventClose = (e: BeforeUnloadEvent) => {
//       e.preventDefault();
//       e.returnValue = "";
//     };
//     window.addEventListener("beforeunload", preventClose);
//     return () => window.removeEventListener("beforeunload", preventClose);
//   }, []);

//   /* ---------------- TAB SWITCH DETECT ---------------- */
//   useEffect(() => {
//     const handleVisibility = () => {
//       if (document.hidden) {
//         alert("Tab switch detected. Exam will auto submit.");
//         submitExam();
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => document.removeEventListener("visibilitychange", handleVisibility);
//   }, []);

//   /* ---------------- SELECT ANSWER ---------------- */
//   const handleSelect = (optionIndex: number) => {
//     const newAnswers = [...selectedAnswers];
//     newAnswers[currentIndex] = optionIndex;
//     setSelectedAnswers(newAnswers);
//   };

//   /* ---------------- SUBMIT ---------------- */
//   const submitExam = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/submit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           testId: test._id,
//           answers: selectedAnswers,
//         }),
//       });
//     } catch (err) {
//       console.error("Submit failed");
//     }
//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//     }
//     onFinish();
//   };

//   const emergencyExit = async () => {
//     if (confirm("Emergency exit will submit the exam. Continue?")) {
//       await submitExam();
//     }
//   };

//   const currentQ = test.questions[currentIndex];

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 bg-white text-black z-[9999] flex flex-col font-mono overflow-y-auto"
//     >
//       {/* HEADER: Sticky at top */}
//       <header className="sticky top-0 bg-white border-b-4 border-black p-4 md:p-6 flex justify-between items-center z-10">
//         <h2 className="text-lg md:text-2xl font-black uppercase truncate mr-4">
//           {test.title}
//         </h2>
//         <div className="bg-yellow-300 border-4 border-black px-3 py-1 md:px-4 md:py-2 text-lg md:text-2xl font-black whitespace-nowrap">
//           {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
//         </div>
//       </header>

//       {/* MAIN CONTENT: Scrollable area */}
//       <main className="flex-1 p-4 md:p-10 w-full max-w-4xl mx-auto">
//         <div className="mb-4 text-sm font-bold opacity-60">
//           QUESTION {currentIndex + 1} OF {test.questions.length}
//         </div>
        
//         <h3 className="text-xl md:text-3xl font-black mb-8 leading-tight">
//           {currentQ.questionText}
//         </h3>

//         <div className="grid grid-cols-1 gap-4 mb-10">
//           {currentQ.options.map((opt: string, i: number) => (
//             <button
//               key={i}
//               onClick={() => handleSelect(i)}
//               className={`border-4 border-black p-4 md:p-6 text-left font-black transition-all active:translate-y-1
//               ${
//                 selectedAnswers[currentIndex] === i
//                   ? "bg-blue-400 text-white translate-x-1"
//                   : "bg-white hover:bg-gray-50"
//               }`}
//             >
//               <span className="mr-4 opacity-50">{String.fromCharCode(65 + i)}.</span>
//               {opt}
//             </button>
//           ))}
//         </div>
//       </main>

//       {/* FOOTER: Fixed at bottom, responsive grid */}
//       <footer className="bg-gray-100 border-t-4 border-black p-4 md:p-6">
//         <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
          
//           {/* Back Button */}
//           <button
//             disabled={currentIndex === 0}
//             onClick={() => setCurrentIndex((prev) => prev - 1)}
//             className={`border-4 border-black px-4 py-3 font-black uppercase ${
//               currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "bg-white hover:bg-gray-200"
//             }`}
//           >
//             Prev
//           </button>

//           {/* Next/Finish Button */}
//           {currentIndex === test.questions.length - 1 ? (
//             <button
//               onClick={submitExam}
//               className="bg-green-400 border-4 border-black px-4 py-3 font-black uppercase hover:bg-green-500"
//             >
//               Finish
//             </button>
//           ) : (
//             <button
//               onClick={() => setCurrentIndex((prev) => prev + 1)}
//               className="bg-black text-white border-4 border-black px-4 py-3 font-black uppercase hover:bg-gray-800"
//             >
//               Next
//             </button>
//           )}

//           {/* Emergency Exit: Spans full width on mobile, 1 col on desktop */}
//           <button
//             onClick={emergencyExit}
//             className="col-span-2 md:col-span-1 bg-red-600 text-white border-4 border-black px-4 py-3 font-black uppercase hover:bg-red-700"
//           >
//             Emergency Exit
//           </button>
//         </div>
//       </footer>
//     </div>
//   );
// }
