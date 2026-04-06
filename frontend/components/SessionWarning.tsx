"use client";

import { useEffect, useState } from "react";

export default function SessionWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showWarning = () => {
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    window.addEventListener("session-expired", showWarning);

    return () => {
      window.removeEventListener("session-expired", showWarning);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-yellow-300 border-4 border-black px-6 py-4 shadow-[6px_6px_0px_black] font-bold uppercase">
      ⚠️ Session expired. Logging out...
    </div>
  );
}