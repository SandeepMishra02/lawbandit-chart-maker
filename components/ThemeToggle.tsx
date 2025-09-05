"use client";

import { useEffect, useState } from "react";

const KEY = "lb-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(
    (typeof document !== "undefined" &&
      (document.documentElement.getAttribute("data-theme") as "light" | "dark")) ||
      "light"
  );

  useEffect(() => {
    const handler = () => {
      const t = document.documentElement.getAttribute("data-theme") as "light" | "dark";
      setTheme(t || "light");
    };
    window.addEventListener("themechange", handler as any);
    return () => window.removeEventListener("themechange", handler as any);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch {}
    // Let MermaidView know to re-render with the new theme
    window.dispatchEvent(new CustomEvent("themechange"));
    setTheme(next);
  }

  return (
    <button onClick={toggle} className="button ghost">
      Toggle theme
    </button>
  );
}






