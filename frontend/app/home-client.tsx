"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy, BookOpen, Target } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

// --- LOADING ANIMATION ---
const NeuralAnimation = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute inset-0 bg-yellow-400 border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      />
      <div className="z-10 text-center">
        <h2 className="text-3xl font-black uppercase">Initializing...</h2>
        <p className="text-xs mt-2 font-black bg-white px-2 border-2 border-black">
          AI OLYMPIAD SYSTEM
        </p>
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
      const timer = setTimeout(() => setShowIntro(false), 2500);
      sessionStorage.setItem("hasSeenIntro", "true");
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fff9e6]" />;

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ y: "-100%" }}
            className="fixed inset-0 z-[100] bg-blue-500 flex items-center justify-center border-b-[10px] border-black"
          >
            <NeuralAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="bg-[#fff9e6] min-h-screen text-black font-mono">

        {/* HEADER */}
        <Header />

        {/* HERO */}
        <section className="relative py-16 sm:py-20 md:py-24 flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden min-h-[80vh] border-b-[6px] border-black">

          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 0)', backgroundSize: '24px 24px' }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="z-10 w-full max-w-5xl"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase leading-[0.9] break-words">
              INDIA’S FIRST <br />
              <span className="bg-yellow-400 text-black px-4 sm:px-6 md:px-8 border-[4px] md:border-[6px] border-black inline-block mt-4 shadow-[6px_6px_0px_black]">
                AI OLYMPIAD
              </span>
            </h1>

            <div className="max-w-xl mx-auto text-base sm:text-lg md:text-xl font-black mt-8 sm:mt-10 leading-tight border-l-[6px] md:border-l-[10px] border-black pl-4 md:pl-6 py-2 text-left bg-white/60">
              Learn Artificial Intelligence from basics to advanced. <br />
              Practice with real tests. <br />
              Compete at Olympiad level.
            </div>

            {/* 🔥 NEW BUTTON (YOUR STYLE) */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10 sm:mt-12">
              <Link href="/login" className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-black text-white font-black uppercase tracking-tighter text-lg sm:text-xl md:text-2xl hover:bg-blue-600 transition-colors">

                  <span className="relative z-10">
                    Start for ₹149
                  </span>

                  <div className="absolute inset-0 translate-x-2 translate-y-2 border-[3px] md:border-[4px] border-black -z-10 bg-yellow-400 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-200" />
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="py-20 px-6 bg-blue-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "AI Learning", desc: "Structured syllabus from basics to advanced AI" },
              { icon: BookOpen, title: "Notes + Videos", desc: "Concept clarity with topic-wise learning" },
              { icon: Target, title: "Practice Tests", desc: "Topic, chapter, and module-level tests" },
              { icon: Trophy, title: "Olympiad Level", desc: "Compete at national-level standards" },
            ].map((item, i) => (
              <div key={i} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                <item.icon className="w-8 h-8 mb-3" />
                <h3 className="font-black text-xl mb-2">{item.title}</h3>
                <p className="text-sm font-bold">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="py-20 px-6 bg-white border-y-[6px] border-black">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-10">
            Why AI Olympiad?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 font-bold text-lg">
            <ul className="space-y-3">
              <li>❌ Most schools lack structured AI education</li>
              <li>❌ No standard benchmarking for AI skills</li>
              <li>❌ Expensive & inaccessible learning programs</li>
            </ul>

            <div className="bg-yellow-400 border-4 border-black p-6 shadow-[6px_6px_0px_black]">
              <p>
                The AI Olympiad bridges this gap by providing structured learning,
                national-level competition, and real-world AI exposure for students.
              </p>
            </div>
          </div>
        </section>

        <section id="structure" className="py-24 px-6 bg-[#fff9e6]">
          <h2 className="text-5xl text-center font-black mb-16 uppercase">
            Program Structure
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                title: "Phase 1",
                subtitle: "Learning",
                desc: "AI basics, ML concepts, ethics, and real-world applications"
              },
              {
                title: "Phase 2",
                subtitle: "Practice",
                desc: "Mock tests, topic quizzes, performance analytics"
              },
              {
                title: "Phase 3",
                subtitle: "Olympiad Exam",
                desc: "National level exam with leaderboard rankings"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                <h3 className="text-xl font-black uppercase">{item.title}</h3>
                <h4 className="text-2xl font-black text-blue-600 mb-3">{item.subtitle}</h4>
                <p className="font-bold">{item.desc}</p>
              </div>
            ))}

          </div>
        </section>

        {/* SYLLABUS */}
        <section id="syllabus" className="pb-20 px-6 bg-[#fff9e6] text-center">
          <h2 className="text-5xl text-center font-black mb-12 uppercase border-4 border-black inline-block px-6 py-2 bg-white">
            Syllabus Structure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Class 6–8",
                desc: "Introduction to AI, basic concepts, logic building"
              },
              {
                title: "Class 9–10",
                desc: "Machine Learning basics, real-world applications"
              },
              {
                title: "Class 11–12",
                desc: "Advanced AI, neural networks, projects"
              },
            ].map((item, i) => (
              <div key={i} className="border-4 border-black p-6 bg-yellow-400 shadow-[6px_6px_0px_black]">
                <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                <p className="font-bold">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="rewards" className="py-24 px-6 bg-blue-600 border-y-[6px] border-black text-black">
          <h2 className="text-5xl text-center font-black mb-12 uppercase text-white">
            Rewards & Recognition
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {[
              { rank: "🥇 1st Rank", prize: "₹7,500" },
              { rank: "🥈 2nd Rank", prize: "₹5,000" },
              { rank: "🥉 3rd Rank", prize: "₹2,500" },
            ].map((item, i) => (
              <div key={i} className="bg-yellow-400 border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                <h3 className="text-xl font-black">{item.rank}</h3>
                <p className="text-3xl font-black">{item.prize}</p>
              </div>
            ))}

          </div>

          <div className="mt-10 text-white font-bold text-lg">
            ✔ Certificates for all participants <br />
            ✔ National leaderboard ranking <br />
            ✔ School-level recognition
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <h2 className="text-5xl text-center font-black mb-12 uppercase">
            National Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {[
              { label: "Students", value: "10,000+" },
              { label: "Schools", value: "200+" },
              { label: "Reach", value: "Pan India" },
            ].map((item, i) => (
              <div key={i} className="border-4 border-black p-6 bg-green-400 shadow-[6px_6px_0px_black]">
                <h4 className="font-black uppercase">{item.label}</h4>
                <p className="text-3xl font-black">{item.value}</p>
              </div>
            ))}

          </div>
        </section>

        <section className="py-24 px-6 bg-[#fff9e6] border-y-[6px] border-black">
          <h2 className="text-5xl text-center font-black mb-10 uppercase">
            Applied AI Skills
          </h2>

          <p className="font-bold text-center text-lg mb-10">
            Beyond theory, students gain hands-on exposure to real-world AI tools,
            problem solving, and practical applications.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "AI Tools & Use Cases",
              "Real-world Problem Solving",
              "Mini Projects & Experiments",
            ].map((item, i) => (
              <div key={i} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_black] font-black">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center px-6 border-y-[6px] border-black">
          <h2 className="text-5xl font-black mb-6 uppercase">
            Ready to Compete?
          </h2>

          <p className="mb-8 font-bold text-lg">
            Register now and start your AI journey.
          </p>

          <Link href="/login">
            <button className="group relative px-10 md:px-12 py-4 md:py-6 bg-pink-400 text-black font-black uppercase text-xl md:text-2xl border-[4px] border-black hover:bg-white transition-colors">
              <span className="relative z-10">
                Register for ₹149
              </span>
              <div className="absolute inset-0 translate-x-2 translate-y-2 border-[4px] border-black -z-10 bg-white hover:bg-white group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-200" />
            </button>
          </Link>
        </section>

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}