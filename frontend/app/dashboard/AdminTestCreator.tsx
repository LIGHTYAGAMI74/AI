"use client";
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminTestCreator() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(20);
  const [level, setLevel] = useState("6-8");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/tests/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title, duration, questions, level }),
    });
    if (res.ok) alert(`🚀 TOP SECRET DATA PUBLISHED FOR LEVEL ${level}!`);
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto font-mono text-black">
      {/* HEADER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-[4px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <label className="text-[10px] font-black uppercase">Mission Title</label>
          <input 
            placeholder="ENTER TITLE..." 
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent font-black italic text-xl outline-none"
          />
        </div>
        <div className="border-[4px] border-black p-4 bg-cyan-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <span className="font-black text-[10px] uppercase block">Time Limit (Min)</span>
          <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="bg-transparent font-black text-3xl w-full outline-none"/>
        </div>
        <div className="border-[4px] border-black p-4 bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
          <span className="font-black text-[10px] uppercase block">Security Clearance</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-transparent font-black text-xl w-full outline-none cursor-pointer">
            <option value="6-8">LVL 6-8</option>
            <option value="9-12">LVL 9-12</option>
            <option value="College">ELITE</option>
          </select>
        </div>
      </div>

      {/* QUESTION NAVIGATION */}
      <div className="flex flex-wrap gap-3 mb-12 bg-white p-6 border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        {questions.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)} 
            className={`w-12 h-12 border-[4px] border-black font-black text-xl transition-all ${currentIndex === i ? 'bg-pink-500 text-white -rotate-6 scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}
          >
            {i + 1}
          </button>
        ))}
        <button 
          onClick={() => setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }])} 
          className="w-12 h-12 border-[4px] border-black border-dashed bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* ACTIVE QUESTION CARD */}
      <div className="border-[6px] border-black p-12 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] mb-12 rotate-1">
        <textarea
          placeholder="TYPE YOUR QUESTION HERE..."
          value={currentQ.questionText}
          onChange={(e) => {
            const newQs = [...questions];
            newQs[currentIndex].questionText = e.target.value;
            setQuestions(newQs);
          }}
          className="w-full border-[4px] border-black p-6 font-black text-2xl min-h-[120px] outline-none mb-10 bg-gray-50 placeholder:text-gray-300"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentQ.options.map((opt, i) => (
            <div 
              key={i} 
              onClick={() => { const n = [...questions]; n[currentIndex].correctAnswer = i; setQuestions(n); }} 
              className={`group cursor-pointer border-[4px] border-black p-5 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${currentQ.correctAnswer === i ? 'bg-green-400' : 'bg-white'}`}
            >
              <input 
                value={opt} 
                onChange={(e) => { const n = [...questions]; n[currentIndex].options[i] = e.target.value; setQuestions(n); }} 
                className="w-full bg-transparent font-black uppercase outline-none text-sm"
                placeholder={`OPTION 0${i+1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="flex justify-between items-center pb-20">
        <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="border-[4px] border-black px-10 py-4 font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">PREV</button>
        <button onClick={handlePublish} className="bg-black text-white px-16 py-6 font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(236,72,153,1)] hover:bg-pink-500 transition-colors -rotate-1">ACTIVATE TEST</button>
        <button onClick={() => setCurrentIndex(Math.min(questions.length-1, currentIndex + 1))} className="border-[4px] border-black px-10 py-4 font-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">NEXT</button>
      </div>
    </div>
  );
}