"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Activity, Cpu, ArrowRight, 
  Github, Linkedin, Lock, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has already seen the intro video in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    
    if (!hasSeenIntro) {
      setShowVideo(true);
      // Mark as seen immediately so it doesn't repeat on refresh
      sessionStorage.setItem("hasSeenIntro", "true");
    }
  }, []);

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <>
      {/* 1. ONE-TIME INTRO VIDEO OVERLAY */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover"
            >
              {/* Ensure this file exists in your /public folder */}
              <source src="/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <button 
              onClick={handleVideoEnd}
              className="absolute bottom-10 right-10 text-white font-black uppercase text-[10px] tracking-[0.2em] border-2 border-white px-6 py-3 hover:bg-white hover:text-black transition-all z-[110]"
            >
              Skip Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN WEBSITE CONTENT */}
      <main className="bg-white min-h-screen text-black font-sans selection:bg-yellow-200">
        
        {/* NAVIGATION BAR */}
        <nav className="flex items-center justify-between px-8 py-6 border-b-4 border-black bg-white sticky top-0 z-50">
          <div className="text-2xl font-black tracking-tighter italic">
            BEN<span className="text-blue-500">.</span>
          </div>
          <div className="flex gap-8 items-center font-black uppercase text-xs tracking-widest">
            <Link href="/about" className="hover:underline underline-offset-4">About</Link>
            <Link href="/login">
              <button className="px-6 py-2 border-4 border-black rounded-xl hover:bg-black hover:text-white transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                LOGIN
              </button>
            </Link>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative py-24 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block bg-yellow-300 border-2 border-black px-4 py-1 rounded-full text-[10px] font-black uppercase mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ✨ Neural Network Olympiad 2026
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
              INTELLIGENCE <br /> 
              <span className="bg-blue-500 text-white px-6 italic border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] inline-block mt-2">
                REDEFINED
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-600 font-bold mb-12 leading-tight">
              The world's first autonomous learning platform designed for the next generation of AI developers. Simple. Bold. Powerful.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <button className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 transition-all active:translate-y-0">
                  GET STARTED NOW
                </button>
              </Link>
              <button className="px-10 py-5 bg-white border-4 border-black rounded-2xl font-black uppercase tracking-widest text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                READ DOCS
              </button>
            </div>
          </motion.div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 bg-gray-50 border-y-4 border-black">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Latency", val: "12ms", icon: <Zap />, color: "bg-green-300" },
              { label: "Intelligence", val: "Lvl 4", icon: <Activity />, color: "bg-purple-300" },
              { label: "Security", val: "SHA-512", icon: <Lock />, color: "bg-orange-300" },
              { label: "Hardware", val: "H100", icon: <Cpu />, color: "bg-cyan-300" },
            ].map((item, i) => (
              <div key={i} className={`p-8 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${item.color}`}>
                <div className="p-3 border-2 border-black bg-white inline-block rounded-xl mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {item.icon}
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black/60 mb-1">{item.label}</h4>
                <p className="text-3xl font-black italic">{item.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ARCHITECTS SECTION */}
        <section className="py-32 container mx-auto px-6">
          <h2 className="text-5xl font-black uppercase mb-16 tracking-tighter italic">
            Built by <span className="underline decoration-blue-500 decoration-8 underline-offset-8">Engineers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Mayank Yadav", role: "Lead Architect", seed: "Mayank" },
              { name: "Sudhanshu Jha", role: "Founder", seed: "Sudhanshu" },
              { name: "Neeladry", role: "Data Engineer", seed: "Neeladry" }
            ].map((dev, idx) => (
              <div key={idx} className="group p-10 border-4 border-black rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-50 transition-all hover:-translate-y-2">
                <div className="w-24 h-24 bg-yellow-200 border-4 border-black rounded-3xl mb-8 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.seed}`} alt="avatar" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{dev.name}</h3>
                <p className="font-black text-blue-600 mb-8 uppercase text-xs tracking-widest">{dev.role}</p>
                <div className="flex gap-4">
                  <div className="p-2 border-2 border-black rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
                    <Github size={20} />
                  </div>
                  <div className="p-2 border-2 border-black rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer transition-colors">
                    <Linkedin size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-white py-24 px-6 mt-20">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div>
              <h2 className="text-6xl font-black italic tracking-tighter leading-none">BEN<span className="text-blue-500">.</span></h2>
              <p className="text-gray-500 font-black mt-4 uppercase tracking-[0.3em] text-[10px]">
                Autonomous Learning Systems &copy; 2026
              </p>
            </div>
            
            <a
              href="mailto:dragonxp2005@gmail.com"
              className="bg-white text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Contact Architect
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}


