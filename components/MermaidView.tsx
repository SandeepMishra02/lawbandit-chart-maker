"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type Props = {
  code: string;
};

export default function MermaidView({ code }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        // (Re)init for hot reload friendliness
        mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
        const id = "mmd-" + Math.random().toString(36).slice(2);
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (ref.current) ref.current.innerHTML =
          `<pre class="text-red-600 text-sm whitespace-pre-wrap">${(e as Error)?.message ?? e}</pre>`;
      }
    }

    render();
    return () => { cancelled = true; };
  }, [code]);

  return (
    <div className="w-full overflow-auto border rounded-lg p-3 bg-white" ref={ref} />
  );
}