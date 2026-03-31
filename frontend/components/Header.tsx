"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  // 🔥 Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-[4px] md:border-b-[6px] border-black">

      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 md:py-5">

        {/* LOGO */}
        <Link href="/">
          <div className="text-xl sm:text-2xl md:text-3xl font-black bg-yellow-400 border-[3px] md:border-4 border-black px-3 py-1 -rotate-2 shadow-[3px_3px_0px_black] cursor-pointer">
            AI OLYMPIAD
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 font-black uppercase text-sm">

          <button
            onClick={() => scrollToSection("about")}
            className="hover:text-blue-600"
          >
            About
          </button>

          <button
            onClick={() => scrollToSection("structure")}
            className="hover:text-blue-600"
          >
            Structure
          </button>

          <button
            onClick={() => scrollToSection("syllabus")}
            className="hover:text-blue-600"
          >
            Syllabus
          </button>

          <button
            onClick={() => scrollToSection("rewards")}
            className="hover:text-blue-600"
          >
            Rewards
          </button>

          <Link href="/login">
            <button className="px-6 py-2 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Register
            </button>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden border-3 border-black p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-6 py-6 text-center flex flex-col gap-4 font-black uppercase border-t-[4px] border-black bg-white">

          <button
            onClick={() => {
              scrollToSection("about");
              setOpen(false);
            }}
          >
            About
          </button>

          <button
            onClick={() => {
              scrollToSection("structure");
              setOpen(false);
            }}
          >
            Structure
          </button>

          <button
            onClick={() => {
              scrollToSection("syllabus");
              setOpen(false);
            }}
          >
            Syllabus
          </button>

          <button
            onClick={() => {
              scrollToSection("rewards");
              setOpen(false);
            }}
          >
            Rewards
          </button>

          <Link href="/login" onClick={() => setOpen(false)}>
            <button className="w-full mt-2 px-6 py-3 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_black]">
              Register
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}