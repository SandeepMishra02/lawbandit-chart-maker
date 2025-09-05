"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MermaidView from "@/components/MermaidView";
import { Mode, Dir } from "@/lib/types";

// --------- Law-student friendly presets ----------
type Preset = { label: string; mode: Mode; text: string };

const PRESETS: Preset[] = [
  {
    label: "Rules map: deadline + exceptions",
    mode: Mode.Rules,
    text: `Rule: An assignment is accepted if submitted before 11:59pm on the due date.
Exceptions:
- Extension granted by instructor.
- System outage confirmed by IT.
Outputs:
- Accepted (on time or approved extension).
- Rejected (late without exception).`,
  },
  {
    label: "Timeline: case events",
    mode: Mode.Timeline,
    text: `Jan 5: File complaint.
Jan 20: Defendant answers.
Feb 2: Motion to dismiss filed.
Feb 28: Hearing.
Mar 10: Order issued.`,
  },
  {
    label: "Flowchart: IRAC outline",
    mode: Mode.Flow,
    text: `Issue: Was there consideration?
Rules: Promise must be bargained for.
Analysis: Past consideration is insufficient.
Conclusion: Agreement unenforceable.`,
  },
];

// Fallback sample if no ?q=
const SAMPLE = PRESETS[0].text;

export default function Home() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>(Mode.Rules);
  const [direction, setDirection] = useState<Dir>(Dir.TB);
  const [code, setCode] = useState<string>(""); // Mermaid code (string)
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Prefill from ?q= or use a friendly sample
  useEffect(() => {
    const q = new URL(window.location.href).searchParams.get("q");
    setText(q ?? SAMPLE);
  }, []);

  async function onGenerate() {
    if (!text.trim()) return;
    setIsLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, direction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      // Accept any of these keys from the API
      const mermaidCode: string = data.mermaid ?? data.code ?? data.svg ?? "";
      if (!mermaidCode) throw new Error("Empty response from model");
      setCode(mermaidCode);
      toast.success("Diagram generated");
    } catch (e: any) {
      const msg = e?.message || "Something went wrong. Please try again.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function downloadSvg() {
    const svgEl = document.querySelector("svg");
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "chart.svg",
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  function copySvg() {
    const svgEl = document.querySelector("svg");
    if (!svgEl) return;
    navigator.clipboard
      .writeText(svgEl.outerHTML)
      .then(() => toast.success("SVG copied to clipboard"))
      .catch(() => toast.error("Failed to copy SVG"));
  }

  const disabled = isLoading || !text.trim();

  return (
    <main className="container">
      <h1 className="h1">LLM-Powered Chart Maker</h1>
      <p className="hint">
        Highlight or paste text → choose a mode → generate a flowchart. Export as SVG.
      </p>

      {err && <div className="alert">{err}</div>}

      <section className="grid">
        {/* LEFT: input + controls */}
        <div>
          <label className="label">Input text</label>
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the instructions, rules, or outline here…"
          />

          <div className="controls" style={{ marginTop: 12 }}>
            {/* Presets */}
            <select
              onChange={(e) => {
                const p = PRESETS.find((x) => x.label === e.target.value);
                if (!p) return;
                setText(p.text);
                setMode(p.mode);
              }}
              defaultValue=""
              className="select"
              title="Quick law-student presets"
            >
              <option value="" disabled>
                Choose a preset…
              </option>
              {PRESETS.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* Mode */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="select"
              title="Chart mode"
            >
              <option value={Mode.Flow}>Flowchart</option>
              <option value={Mode.Timeline}>Timeline (chronological)</option>
              <option value={Mode.Rules}>Rules (main rule → exceptions)</option>
            </select>

            {/* Direction */}
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Dir)}
              className="select"
              title="Layout direction"
            >
              <option value={Dir.TB}>Top → Bottom</option>
              <option value={Dir.LR}>Left → Right</option>
              <option value={Dir.BT}>Bottom → Top</option>
              <option value={Dir.RL}>Right → Left</option>
            </select>

            {/* Generate */}
            <button onClick={onGenerate} disabled={disabled} className="button primary">
              {isLoading ? "Generating…" : "Generate"}
            </button>
          </div>

          <div className="controls" style={{ marginTop: 12 }}>
            <button onClick={downloadSvg} disabled={!code} className="button ghost">
              Download SVG
            </button>
            <button onClick={copySvg} disabled={!code} className="button ghost">
              Copy SVG
            </button>
          </div>
        </div>

        {/* RIGHT: preview */}
        <div>
          <label className="label">Preview</label>
          <div
            className="card preview overflow-auto"
            style={{ maxHeight: "150vh" }} 
          >
            {!code ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted)",
                  fontSize: 14,
                }}
              >
                {isLoading ? "Asking the model…" : "Paste text (or pick a preset) and click Generate"}
              </div>
            ) : (
              <MermaidView code={code} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
