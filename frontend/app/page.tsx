"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Cpu, Github, Linkedin, Lock, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// --- COMIC STYLE NEURAL ANIMATION ---
const NeuralAnimation = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [1, 1.1, 1], rotate: 0 }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute inset-0 bg-yellow-400 border-[4px] md:border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
      />
      
      <div className="z-10 text-center">
        <motion.h2 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="text-2xl md:text-4xl font-black italic tracking-tighter text-black uppercase"
        >
          Loading...
        </motion.h2>
        <p className="font-black text-[10px] md:text-xs mt-2 bg-white px-2 border-2 border-black inline-block uppercase">POW! BIFF! ZAP!</p>
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

  if (!mounted) return <div className="min-h-screen bg-[#fff9e6]" />;

  return (
    <>
      <Head>
        <title>BEN! | Pure Raw Intelligence 2026</title>
        <meta name="description" content="BEN AI Academy: The singularity is here. Neural intelligence, mission-based learning, and elite operative training." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            role="alert"
            aria-busy="true"
            exit={{ y: "-100%", transition: { type: "spring", damping: 20 } }}
            className="fixed inset-0 z-[100] bg-blue-500 flex flex-col items-center justify-center overflow-hidden border-b-[10px] border-black"
          >
            <NeuralAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="bg-[#fff9e6] min-h-screen text-black font-mono selection:bg-pink-400 selection:text-white">
        
        {/* HEADER / NAV */}
        <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b-[4px] md:border-b-[6px] border-black bg-white sticky top-0 z-50">
          <Link href="/" aria-label="BEN! Home">
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic bg-yellow-400 border-[3px] md:border-4 border-black px-3 py-1 -rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              BEN<span className="text-blue-600">!</span>
            </div>
          </Link>
          <nav className="flex gap-4 md:gap-8 items-center font-black uppercase text-[10px] md:text-sm tracking-tighter">
            <Link href="/about" className="hover:text-blue-600 transition-colors hidden sm:block">The Story</Link>
            <Link href="/login">
              <button className="px-4 py-2 md:px-6 md:py-2 bg-pink-400 border-[3px] md:border-[4px] border-black rounded-none hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                JOIN SQUAD
              </button>
            </Link>
          </nav>
        </header>

        {/* HERO SECTION */}
        <section className="relative py-16 md:py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden min-h-[80vh]">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 0)', backgroundSize: '24px 24px' }} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="z-10 w-full max-w-6xl"
          >
            <div className="inline-block bg-white border-[3px] border-black px-4 py-2 rotate-1 mb-6 md:mb-8 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
              <span className="font-black italic text-sm md:text-lg uppercase tracking-widest">Episode #01: The Singularity</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-10 md:mb-12 uppercase break-words">
              SMARTER <br /> 
              <span className="bg-yellow-400 text-black px-4 md:px-8 -rotate-1 border-[4px] md:border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(236,72,153,1)] inline-block mt-4">
                THAN YOU.
              </span>
            </h1>

            <div className="max-w-xl mx-auto text-lg md:text-2xl font-black mb-10 md:mb-12 leading-tight border-l-[6px] md:border-l-[10px] border-black pl-4 md:pl-6 py-2 text-left bg-white/50">
              NO OVER-ENGINEERING. <br />
              JUST PURE, RAW INTELLIGENCE. <br />
              CRUNCHING DATA SINCE '26.
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/login" className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-black text-white font-black uppercase tracking-tighter text-xl md:text-2xl hover:bg-blue-600 transition-colors">
                  <span className="relative z-10">LAUNCH SYSTEM</span>
                  <div className="absolute inset-0 translate-x-2 translate-y-2 border-[3px] md:border-[4px] border-black -z-10 bg-yellow-400 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* STATS PANELS */}
        <section className="py-12 md:py-20 px-4 md:px-6 border-y-[4px] md:border-y-[6px] border-black bg-blue-600">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "SPEED", val: "12ms", color: "bg-white", rotate: "md:-rotate-2" },
              { label: "IQ", val: "Lvl 99", color: "bg-green-400", rotate: "md:rotate-1" },
              { label: "ENCRYPTION", val: "SHA-512", color: "bg-pink-400", rotate: "md:-rotate-1" },
              { label: "CORES", val: "H100 x 8", color: "bg-yellow-400", rotate: "md:rotate-2" },
            ].map((item, i) => (
              <article key={i} className={`p-4 md:p-8 border-[4px] md:border-[6px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${item.color} ${item.rotate}`}>
                <h4 className="text-[10px] md:text-xs font-black uppercase mb-1 underline decoration-2 md:decoration-4 decoration-black/20">{item.label}</h4>
                <p className="text-xl md:text-4xl font-black italic uppercase tracking-tighter">{item.val}</p>
              </article>
            ))}
          </div>
        </section>

        {/* THE TEAM */}
        <section className="py-20 md:py-32 container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 md:mb-20 tracking-tighter italic inline-block bg-white border-[4px] md:border-[6px] border-black px-6 md:px-10 py-3 md:py-4 -rotate-2 shadow-[6px_6px_0px_0px_rgba(59,130,246,1)]">
            THE MASTERMINDS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            {[
              { name: "Mayank Yadav", role: "THE ARCHITECT", seed: "Mayank", color: "bg-orange-400" },
              { name: "Sudhanshu Jha", role: "THE CATALYST", seed: "Sudhanshu", color: "bg-cyan-400" },
              { name: "Neeladry", role: "THE DATA WIZARD", seed: "Neeladry", color: "bg-purple-400" }
            ].map((dev, idx) => (
              <article key={idx} className="group relative border-[4px] md:border-[6px] border-black bg-white p-2 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                <div className={`${dev.color} border-[3px] md:border-[4px] border-black aspect-square overflow-hidden mb-4 md:mb-6`}>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.seed}&backgroundColor=transparent`} 
                    alt={`${dev.name} - ${dev.role}`} 
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500 scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 md:p-6 pt-0">
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic leading-none mb-2">{dev.name}</h3>
                  <p className="font-black text-[10px] md:text-sm bg-black text-white px-3 py-1 inline-block mb-4 md:mb-6 uppercase tracking-tighter">{dev.role}</p>
                  <div className="flex gap-4">
                    <Github className="cursor-pointer hover:text-blue-600 w-5 h-5 md:w-6 md:h-6" aria-label="GitHub" />
                    <Linkedin className="cursor-pointer hover:text-blue-600 w-5 h-5 md:w-6 md:h-6" aria-label="LinkedIn" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-white py-20 md:py-32 px-6">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4">BEN<span className="text-yellow-400">!</span></h2>
              <p className="text-white/40 font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-[10px] md:text-xs">
                ESTABLISHED 2026 // NEURAL OVERLOAD
              </p>
            </div>
            
            <a
              href="mailto:dragonxp2005@gmail.com"
              className="group relative w-full md:w-auto text-center bg-pink-500 text-white px-10 md:px-16 py-6 md:py-8 border-[4px] md:border-[6px] border-white text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              SEND SIGNAL
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}