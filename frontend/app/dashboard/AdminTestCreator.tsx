"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminTestCreator() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(20);
  const [level, setLevel] = useState("6-8");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5050/api/tests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title, duration, questions, level }),
    });
    if (res.ok) alert(`🚀 Published for level ${level}!`);
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto font-sans text-black">
      {/* HEADER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input 
          placeholder="TEST TITLE..." 
          value={title} onChange={(e) => setTitle(e.target.value)}
          className="md:col-span-1 border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
        />
        <div className="border-4 border-black p-4 bg-cyan-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <span className="font-black text-xs">TIME (MIN):</span>
          <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="bg-transparent font-black text-xl w-full outline-none"/>
        </div>
        <div className="border-4 border-black p-4 bg-purple-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <span className="font-black text-xs">LEVEL:</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-transparent font-black text-xl w-full outline-none cursor-pointer">
            <option value="6-8">6-8</option>
            <option value="9-12">9-12</option>
            <option value="College">College</option>
          </select>
        </div>
      </div>

      {/* QUESTION NAVIGATION */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-4 border-4 border-black rounded-xl">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} className={`w-10 h-10 border-2 border-black font-black ${currentIndex === i ? 'bg-black text-white' : 'bg-white'}`}>{i + 1}</button>
        ))}
        <button onClick={() => setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }])} className="w-10 h-10 border-2 border-dashed border-black bg-white hover:bg-black hover:text-white transition-all"><Plus size={20} className="mx-auto" /></button>
      </div>

      {/* ACTIVE QUESTION CARD */}
      <div className="border-4 border-black p-10 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
        <textarea
          placeholder="ENTER QUESTION..."
          value={currentQ.questionText}
          onChange={(e) => {
            const newQs = [...questions];
            newQs[currentIndex].questionText = e.target.value;
            setQuestions(newQs);
          }}
          className="w-full border-4 border-black p-6 font-bold text-lg min-h-[100px] outline-none mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt, i) => (
            <div key={i} onClick={() => { const n = [...questions]; n[currentIndex].correctAnswer = i; setQuestions(n); }} className={`cursor-pointer border-4 border-black p-4 rounded-xl ${currentQ.correctAnswer === i ? 'bg-green-400' : 'bg-white'}`}>
              <input 
                value={opt} 
                onChange={(e) => { const n = [...questions]; n[currentIndex].options[i] = e.target.value; setQuestions(n); }} 
                className="w-full bg-transparent font-bold border-b-2 border-black/20 outline-none"
                placeholder={`Option ${i+1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="flex justify-between mt-10">
        <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="border-4 border-black px-8 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Back</button>
        <button onClick={handlePublish} className="bg-black text-white px-10 py-3 font-black uppercase shadow-[6px_6px_0px_0px_rgba(34,211,238,1)]">Publish Test</button>
        <button onClick={() => setCurrentIndex(Math.min(questions.length-1, currentIndex + 1))} className="border-4 border-black px-8 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Next</button>
      </div>
    </div>
  );
}