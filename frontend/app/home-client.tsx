"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Trophy,
  BookOpen,
  Target,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 🔥 Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// --- LOADING ANIMATION ---
const NeuralAnimation = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-400 font-mono"
        >
          <div className="relative h-[300px] w-[300px] flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-black bg-yellow-400 shadow-[10px_10px_0px_black]" />

            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 opacity-40">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                  className="border border-black"
                />
              ))}
            </div>

            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-0 h-2 w-full bg-black opacity-20"
            />

            <div className="z-10 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-black uppercase text-black md:text-3xl"
              >
                AI OLYMPIAD
              </motion.h2>

              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="mt-2 text-sm font-bold tracking-widest text-black"
              >
                LOADING MODULE...
              </motion.p>

              <div className="mx-auto mt-4 h-3 w-40 overflow-hidden border-2 border-black bg-white">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-full w-1/2 bg-black"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const faqItems = [
  {
    q: "Who can join the AI Olympiad?",
    a: "Students from classes 6 to 12 can join. The syllabus is structured by level, so each student learns at the right pace.",
  },
  {
    q: "What do I get after registering?",
    a: "You get access to structured AI learning, practice tests, performance tracking, and eligibility for the Olympiad exam.",
  },
  {
    q: "Is the program suitable for beginners?",
    a: "Yes. It starts from the basics and gradually moves into practical AI concepts, so even first-time learners can follow comfortably.",
  },
  {
    q: "How are the tests structured?",
    a: "There are topic, chapter, and module-level tests designed to help students practice step by step and improve before the final Olympiad.",
  },
  {
    q: "Will I receive a certificate?",
    a: "Yes. Certificates are provided for participants, and top performers receive additional recognition and rewards.",
  },
  {
    q: "How do I reset my password later?",
    a: "Log out and use the Forgot Password option on the login page. You will get the OTP flow there to set a new password.",
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="scroll-mt-28 border-y-[6px] border-black bg-white py-20 px-4 sm:px-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-[4px] border-black bg-yellow-400 shadow-[4px_4px_0px_black]">
            <HelpCircle size={28} />
          </div>
          <h2 className="text-4xl font-black uppercase md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-relaxed text-black/70 md:text-base">
            Quick answers to the most common questions about registration,
            learning, tests, and support.
          </p>
        </div>

        <div className="grid gap-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.q}
                layout
                className={[
                  "border-[4px] border-black bg-[#fff9e6] shadow-[6px_6px_0px_black]",
                  isOpen ? "bg-yellow-100" : "bg-white",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 text-left"
                >
                  <span className="text-sm font-black uppercase tracking-tight sm:text-base">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 border-[3px] border-black bg-pink-400 p-1 shadow-[3px_3px_0px_black]"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 pt-0 sm:px-5">
                        <div className="border-l-[5px] border-black bg-white px-4 py-4 text-sm font-bold leading-relaxed sm:text-base">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (!mounted) return <div className="min-h-screen bg-[#fff9e6]" />;

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ y: "-100%" }}
            className="fixed inset-0 z-[100] flex items-center justify-center border-b-[10px] border-black bg-blue-500"
          >
            <NeuralAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-[#fff9e6] font-mono text-black">
        <Header />

        {/* HERO */}
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden border-b-[6px] border-black px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#000 2px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="z-10 w-full max-w-5xl"
          >
            <h1 className="text-4xl font-black uppercase leading-[0.9] break-words sm:text-6xl md:text-8xl">
              INDIA’S FIRST <br />
              <motion.span
                whileHover={{ scale: 1.03 }}
                className="mt-4 inline-block border-[4px] border-black bg-yellow-400 px-4 text-black shadow-[6px_6px_0px_black] sm:px-6 md:border-[6px] md:px-8"
              >
                AI OLYMPIAD
              </motion.span>
            </h1>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-8 max-w-xl border-l-[6px] border-black bg-white/60 px-4 py-2 text-left text-base font-black leading-tight sm:mt-10 sm:text-lg md:border-l-[10px] md:px-6 md:text-xl"
            >
              Learn Artificial Intelligence from basics to advanced.
              <br />
              Practice with real tests.
              <br />
              Compete at Olympiad level.
            </motion.div>

            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:mt-12 sm:flex-row">
              <Link href="/register" className="w-full sm:w-auto">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full bg-black px-8 py-4 text-lg font-black uppercase tracking-tighter text-white transition-colors hover:bg-blue-600 sm:w-auto md:px-12 md:py-6 md:text-2xl"
                >
                  <span className="relative z-10">Start for ₹149</span>
                  <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 border-[3px] border-black bg-yellow-400 transition-transform duration-200 group-hover:translate-x-0 group-hover:translate-y-0 md:border-[4px]" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="scroll-mt-28 bg-blue-600 px-4 py-20 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"
          >
            {[
              {
                icon: Brain,
                title: "AI Learning",
                desc: "Structured syllabus from basics to advanced AI",
              },
              {
                icon: BookOpen,
                title: "Notes + Videos",
                desc: "Concept clarity with topic-wise learning",
              },
              {
                icon: Target,
                title: "Practice Tests",
                desc: "Topic, chapter, and module-level tests",
              },
              {
                icon: Trophy,
                title: "Olympiad Level",
                desc: "Compete at national-level standards",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_black]"
              >
                <item.icon className="mb-3 h-8 w-8" />
                <h3 className="mb-2 text-xl font-black">{item.title}</h3>
                <p className="text-sm font-bold">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* WHY AI OLYMPIAD */}
        <section
          id="about"
          className="scroll-mt-28 border-y-[6px] border-black bg-white px-4 py-20 sm:px-6"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mb-10 text-4xl font-black uppercase md:text-5xl">
              Why AI Olympiad?
            </h2>

            <div className="grid gap-8 text-lg font-bold md:grid-cols-2">
              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {[
                  "❌ Most schools lack structured AI education",
                  "❌ No standard benchmarking for AI skills",
                  "❌ Expensive & inaccessible learning programs",
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp}>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                className="border-4 border-black bg-yellow-400 p-6 shadow-[6px_6px_0px_black]"
              >
                <p>
                  The AI Olympiad bridges this gap by providing structured
                  learning, national-level competition, and real-world AI
                  exposure for students.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* PROGRAM STRUCTURE */}
        <section id="structure" className="scroll-mt-28 bg-[#fff9e6] px-4 py-24 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mb-16 text-center text-4xl font-black uppercase md:text-5xl">
              Program Structure
            </h2>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-3"
            >
              {[
                {
                  title: "Phase 1",
                  subtitle: "Learning",
                  desc: "AI basics, ML concepts, ethics, and real-world applications",
                },
                {
                  title: "Phase 2",
                  subtitle: "Practice",
                  desc: "Mock tests, topic quizzes, performance analytics",
                },
                {
                  title: "Phase 3",
                  subtitle: "Olympiad Exam",
                  desc: "National level exam with leaderboard rankings",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_black]"
                >
                  <h3 className="text-xl font-black uppercase">{item.title}</h3>
                  <h4 className="mb-3 text-2xl font-black text-blue-600">
                    {item.subtitle}
                  </h4>
                  <p className="font-bold">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* SYLLABUS */}
        <section
          id="syllabus"
          className="scroll-mt-28 bg-[#fff9e6] px-4 pb-20 text-center sm:px-6"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mx-auto mb-12 inline-block border-4 border-black bg-white px-6 py-2 text-4xl font-black uppercase md:text-5xl">
              Syllabus Structure
            </h2>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
            >
              {[
                {
                  title: "Class 6–8",
                  desc: "Introduction to AI, basic concepts, logic building",
                },
                {
                  title: "Class 9–10",
                  desc: "Machine Learning basics, real-world applications",
                },
                {
                  title: "Class 11–12",
                  desc: "Advanced AI, neural networks, projects",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="border-4 border-black bg-yellow-400 p-6 shadow-[6px_6px_0px_black]"
                >
                  <h3 className="mb-2 text-2xl font-black">{item.title}</h3>
                  <p className="font-bold">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* REWARDS */}
        <section
          id="rewards"
          className="scroll-mt-28 border-y-[6px] border-black bg-blue-600 px-4 py-24 text-black sm:px-6"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mb-12 text-center text-4xl font-black uppercase text-white md:text-5xl">
              Rewards & Recognition
            </h2>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-3"
            >
              {[
                { rank: "🥇 1st Rank", prize: "₹7,500" },
                { rank: "🥈 2nd Rank", prize: "₹5,000" },
                { rank: "🥉 3rd Rank", prize: "₹2,500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  className="border-4 border-black bg-yellow-400 p-6 shadow-[6px_6px_0px_black]"
                >
                  <h3 className="text-xl font-black">{item.rank}</h3>
                  <p className="text-3xl font-black">{item.prize}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 text-lg font-bold text-white">
              ✔ Certificates for all participants <br />
              ✔ National leaderboard ranking <br />
              ✔ School-level recognition
            </motion.div>
          </motion.div>
        </section>

        {/* IMPACT */}
        <section className="bg-white px-4 py-24 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mb-12 text-center text-4xl font-black uppercase md:text-5xl">
              National Impact
            </h2>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-3"
            >
              {[
                { label: "Students", value: "10,000+" },
                { label: "Schools", value: "200+" },
                { label: "Reach", value: "Pan India" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="border-4 border-black bg-green-400 p-6 shadow-[6px_6px_0px_black]"
                >
                  <h4 className="font-black uppercase">{item.label}</h4>
                  <p className="text-3xl font-black">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* APPLIED SKILLS */}
        <section className="border-y-[6px] border-black bg-[#fff9e6] px-4 py-24 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mb-10 text-center text-4xl font-black uppercase md:text-5xl">
              Applied AI Skills
            </h2>

            <p className="mb-10 text-center text-lg font-bold">
              Beyond theory, students gain hands-on exposure to real-world AI
              tools, problem solving, and practical applications.
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-3"
            >
              {[
                "AI Tools & Use Cases",
                "Real-world Problem Solving",
                "Mini Projects & Experiments",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  className="border-4 border-black bg-white p-6 font-black shadow-[6px_6px_0px_black]"
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ */}
        <FAQAccordion />

        {/* CTA */}
        <section className="bg-[#fff9e6] px-4 py-24 text-center sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-black uppercase md:text-5xl">
              Ready to Compete?
            </h2>

            <p className="mb-8 text-lg font-bold">
              Register now and start your AI journey!
            </p>

            <Link href="/register">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="group relative border-[4px] border-black bg-pink-400 px-10 py-4 text-xl font-black uppercase text-black transition-colors hover:bg-white md:px-12 md:py-6 md:text-2xl"
              >
                <span className="relative z-10">Register for ₹149</span>
                <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 border-[4px] border-black bg-white transition-transform duration-200 group-hover:translate-x-0 group-hover:translate-y-0" />
              </motion.button>
            </Link>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}