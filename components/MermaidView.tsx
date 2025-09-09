"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type Props = { code: string };

//Renders Mermaid SVG and re-renders on theme change 
export default function MermaidView({ code }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  async function render(theme: "light" | "dark") {
    
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: theme === "dark" ? "dark" : "default",
    });

    const id = "mmd-" + Math.random().toString(36).slice(2);
    const { svg } = await mermaid.render(id, code);
    if (ref.current) ref.current.innerHTML = svg;
  }

  useEffect(() => {
    const getTheme = () =>
      (document.documentElement.getAttribute("data-theme") as "light" | "dark") ||
      "light";

    // initial render
    render(getTheme()).catch(() => {});

    // re-render on themechange
    const onTheme = () => render(getTheme()).catch(() => {});
    window.addEventListener("themechange", onTheme);
    return () => window.removeEventListener("themechange", onTheme);
  }, [code]);

  return <div className="preview card" ref={ref} />;
}

