"use client";

import { useEffect, useState } from "react";
import MermaidView from "@/components/MermaidView";

const SAMPLE = `Rule: An assignment is accepted if submitted before 11:59pm on the due date.
Exceptions:
- Extension granted by instructor.
- System outage confirmed by IT.
Outputs:
- Accepted (on time or approved extension).
- Rejected (late without exception).`;

type Mode = "flowchart" | "timeline" | "rules";
type Dir = "TB" | "BT" | "LR" | "RL";

export default function Home() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("rules");
  const [direction, setDirection] = useState<Dir>("TB");


  const [mermaid, setMermaid] = useState<string>(
    'flowchart TB\nn0["Paste text and click Generate"]'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = new URL(window.location.href).searchParams.get("q");
    setText(q ? q : SAMPLE);
  }, []);

  const disabled = isLoading || !text.trim();

  async function onGenerate() {
    setIsLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, direction }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      // API returns 
      setMermaid(data.mermaid as string);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function downloadSvg() {
    // Grab the currently rendered SVG from the preview pane
    const svgEl = document.querySelector<HTMLDivElement>("#preview")?.querySelector("svg");
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "chart.svg" });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">LLM-Powered Chart Maker</h1>
      <p className="text-sm text-gray-600">
        Highlight or paste text → choose a mode → generate a flowchart. Export as SVG.
      </p>

      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <label className="block text-sm font-medium">Input text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[260px] border rounded-md p-3 focus:outline-none"
            placeholder="Paste the instructions, rules, or outline here…"
          />

          <div className="flex gap-3 items-center">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="border rounded-md p-2"
            >
              <option value="flowchart">Flowchart</option>
              <option value="timeline">Timeline (chronological)</option>
              <option value="rules">Rules (main rule → exceptions)</option>
            </select>

            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Dir)}
              className="border rounded-md p-2"
            >
              <option value="TB">Top → Bottom</option>
              <option value="BT">Bottom → Top</option>
              <option value="LR">Left → Right</option>
              <option value="RL">Right → Left</option>
            </select>

            <button
              onClick={onGenerate}
              disabled={disabled}
              className={`px-4 py-2 rounded-md text-white ${
                disabled ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Generating…" : "Generate"}
            </button>
          </div>

          <button
            onClick={downloadSvg}
            className="mt-2 px-4 py-2 rounded-md border hover:bg-gray-50"
          >
            Download SVG
          </button>
        </section>

        <section className="space-y-3">
          <label className="block text-sm font-medium">Preview</label>
          <div id="preview" className="border rounded-md p-3 h-[320px] overflow-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Asking the model…
              </div>
            ) : (
              <MermaidView code={mermaid} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
