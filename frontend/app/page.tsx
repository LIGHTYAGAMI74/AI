"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Activity, Cpu, Github, Linkedin, Lock, MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// --- COMIC STYLE NEURAL ANIMATION ---
const NeuralAnimation = () => {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Comic Action Star Burst */}
      <motion.div 
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [1, 1.1, 1], rotate: 0 }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute inset-0 bg-yellow-400 border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
      />
      
      <div className="z-10 text-center">
        <motion.h2 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="text-4xl font-black italic tracking-tighter text-black uppercase"
        >
          Loading...
        </motion.h2>
        <p className="font-black text-xs mt-2 bg-white px-2 border-2 border-black inline-block">POW! BIFF! ZAP!</p>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setShowIntro(true);
      const timer = setTimeout(() => setShowIntro(false), 3000);
      sessionStorage.setItem("hasSeenIntro", "true");
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-yellow-50" />;

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ y: "-100%", transition: { type: "spring", damping: 20 } }}
            className="fixed inset-0 z-[100] bg-blue-500 flex flex-col items-center justify-center overflow-hidden border-b-[10px] border-black"
          >
            <NeuralAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="bg-[#fff9e6] min-h-screen text-black font-mono selection:bg-pink-400 selection:text-white">
        
        {/* COMIC NAV */}
        <nav className="flex items-center justify-between px-8 py-6 border-b-[6px] border-black bg-white sticky top-0 z-50">
          <div className="text-4xl font-black tracking-tighter italic bg-yellow-400 border-4 border-black px-4 py-1 -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            BEN<span className="text-blue-600">!</span>
          </div>
          <div className="flex gap-8 items-center font-black uppercase text-sm tracking-tighter">
            <Link href="/about" className="hover:text-blue-600 transition-colors">The Story</Link>
            <Link href="/login">
              <button className="px-6 py-2 bg-pink-400 border-[4px] border-black rounded-none hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                JOIN THE SQUAD
              </button>
            </Link>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          {/* Background Decorative "Dot" Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 0)', backgroundSize: '24px 24px' }} />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="inline-block bg-white border-[3px] border-black px-6 py-2 rotate-1 mb-8 shadow-[6px_6px_0px_0px_rgba(59,130,246,1)]">
              <span className="font-black italic text-lg uppercase tracking-widest">Episode #01: The Singularity</span>
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 uppercase">
              SMARTER <br /> 
              <span className="bg-yellow-400 text-black px-8 -rotate-1 border-[6px] border-black shadow-[15px_15px_0px_0px_rgba(236,72,153,1)] inline-block mt-4">
                THAN YOU.
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-2xl font-black mb-12 leading-none border-l-[10px] border-black pl-6 py-2 text-left bg-white/50">
              NO OVER-ENGINEERING. <br />
              JUST PURE, RAW INTELLIGENCE. <br />
              CRUNCHING DATA SINCE '26.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button className="group relative px-12 py-6 bg-black text-white font-black uppercase tracking-tighter text-2xl hover:bg-blue-600 transition-colors">
                <span className="relative z-10">LAUNCH SYSTEM</span>
                <div className="absolute inset-0 translate-x-3 translate-y-3 border-[4px] border-black -z-10 bg-yellow-400 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* COMIC PANELS (STATS) */}
        <section className="py-20 px-6 border-y-[6px] border-black bg-blue-600">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "SPEED", val: "12ms", color: "bg-white", rotate: "-rotate-2" },
              { label: "IQ", val: "Lvl 99", color: "bg-green-400", rotate: "rotate-1" },
              { label: "ENCRYPTION", val: "SHA-512", color: "bg-pink-400", rotate: "-rotate-1" },
              { label: "CORES", val: "H100 x 8", color: "bg-yellow-400", rotate: "rotate-2" },
            ].map((item, i) => (
              <div key={i} className={`p-8 border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${item.color} ${item.rotate}`}>
                <h4 className="text-xs font-black uppercase mb-1 underline decoration-4 decoration-black/20">{item.label}</h4>
                <p className="text-4xl font-black italic uppercase tracking-tighter">{item.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* THE TEAM / ARCHITECTS */}
        <section className="py-32 container mx-auto px-6">
          <h2 className="text-6xl font-black uppercase mb-20 tracking-tighter italic inline-block bg-white border-[6px] border-black px-10 py-4 -rotate-2 shadow-[10px_10px_0px_0px_rgba(59,130,246,1)]">
            THE MASTERMINDS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { name: "Mayank Yadav", role: "THE ARCHITECT", seed: "Mayank", color: "bg-orange-400" },
              { name: "Sudhanshu Jha", role: "THE CATALYST", seed: "Sudhanshu", color: "bg-cyan-400" },
              { name: "Neeladry", role: "THE DATA WIZARD", seed: "Neeladry", color: "bg-purple-400" }
            ].map((dev, idx) => (
              <div key={idx} className="group relative border-[6px] border-black bg-white p-2 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                <div className={`${dev.color} border-[4px] border-black aspect-square overflow-hidden mb-6`}>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.seed}&backgroundColor=transparent`} 
                    alt="avatar" 
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500 scale-110"
                  />
                </div>
                <div className="p-6 pt-0">
                  <h3 className="text-3xl font-black uppercase italic leading-none mb-2">{dev.name}</h3>
                  <p className="font-black text-sm bg-black text-white px-3 py-1 inline-block mb-6 uppercase tracking-tighter">{dev.role}</p>
                  <div className="flex gap-4">
                    <Github className="cursor-pointer hover:text-blue-600" />
                    <Linkedin className="cursor-pointer hover:text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-white py-32 px-6">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-8xl font-black italic tracking-tighter mb-4">BEN<span className="text-yellow-400">!</span></h2>
              <p className="text-white/40 font-black uppercase tracking-[0.5em] text-xs">
                ESTABLISHED 2026 // NEURAL OVERLOAD
              </p>
            </div>
            
            <a
              href="mailto:dragonxp2005@gmail.com"
              className="group relative bg-pink-500 text-white px-16 py-8 border-[6px] border-white text-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              SEND SIGNAL
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}