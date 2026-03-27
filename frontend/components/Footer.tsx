import { Instagram, Linkedin, Twitter, Facebook, Mail, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-16 border-t-[6px] border-black">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            AI OLYMPIAD 2026
          </h2>
          <p className="text-sm opacity-70">
            Empowering students with Artificial Intelligence education.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-black text-lg mb-3 uppercase">Contact</h3>
          <p className="text-sm opacity-80">Email:</p>
          <a
            href="mailto:youremail@gmail.com"
            className="underline hover:text-yellow-400 mb-4 block"
          >
            support@gridixa.in
          </a>
          <p className="text-sm opacity-80">Phone:</p>
          <a
            href="tel:+919625543638"
            className="underline hover:text-yellow-400"
          >
            +91 96255 43638
          </a>
        </div>

        {/* SOCIALS */}
        <div>
          <h3 className="font-black text-lg mb-3 uppercase">Connect</h3>

          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://instagram.com/gridixa" className="hover:text-yellow-400">
              <Instagram />
            </a>
            <a href="https://linkedin.com/company/gridixa" className="hover:text-yellow-400">
              <Linkedin />
            </a>
            <a href="https://twitter.com/gridixa" className="hover:text-yellow-400">
              <Twitter />
            </a>
            <a href="https://facebook.com/gridixa" className="hover:text-yellow-400">
              <Facebook />
            </a>
            <a href="https://youtube.com/@gridixa" className="hover:text-yellow-400">
              <Youtube />
            </a>
            <a href="mailto:support@gridixa.in" className="hover:text-yellow-400">
              <Mail />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center mt-10 text-xs opacity-60">
        © 2026 Gridixa Solutions LLP. All rights reserved.
      </div>
    </footer>
  );
}