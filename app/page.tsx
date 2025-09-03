"use client";

import { useState } from "react";
import MermaidView from "@/components/MermaidView";

type Mode = "flowchart" | "timeline" | "rules";
type Dir = "TB" | "LR" | "BT" | "RL";

export default function Home() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("flowchart");
  const [direction, setDirection] = useState<Dir>("TB");
  const [mermaid, setMermaid] = useState<string>("flowchart TB\nn0[\"Paste text and click Generate\"]");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onGenerate() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, direction }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
      setMermaid(json.mermaid);
    } catch (e: any) {
      setErr(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function onDownload() {
    // Grab the current SVG and download
    const svg = document.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "chart.svg" });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">LLM-Powered Chart Maker</h1>
        <p className="text-sm text-neutral-600">
          Highlight or paste text → choose a mode → generate a flowchart. Export as SVG.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Input text</label>
          <textarea
            className="w-full h-56 border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the instructions, rules, or outline here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="border rounded-md px-3 py-2 text-sm"
              title="Chart mode"
            >
              <option value="flowchart">Flowchart</option>
              <option value="timeline">Timeline (chronological)</option>
              <option value="rules">Rules (main rule → exceptions)</option>
            </select>

            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Dir)}
              className="border rounded-md px-3 py-2 text-sm"
              title="Layout direction"
            >
              <option value="TB">Top → Bottom</option>
              <option value="LR">Left → Right</option>
              <option value="BT">Bottom → Top</option>
              <option value="RL">Right → Left</option>
            </select>

            <button
              onClick={onGenerate}
              disabled={loading || !text.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate"}
            </button>

            <button
              onClick={onDownload}
              className="border px-4 py-2 rounded-md"
            >
              Download SVG
            </button>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Preview</label>
          <MermaidView code={mermaid} />
        </div>
      </section>
    </main>
  );
}