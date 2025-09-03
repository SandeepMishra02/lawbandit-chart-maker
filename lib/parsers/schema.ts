//schema that describes the structure we expect back from the LLM.

import { z } from "zod";

export const NodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export const EdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().optional(),
});

export const GraphSchema = z.object({
  direction: z.enum(["TB", "BT", "LR", "RL"]).default("TB"),
  nodes: z.array(NodeSchema).min(1),
  edges: z.array(EdgeSchema).optional().default([]),
});

export type Graph = z.infer<typeof GraphSchema>;

// Helper to turn our validated graph into Mermaid string.
export function toMermaid(g: Graph): string {
  const header = `flowchart ${g.direction}`;
  const nodeLines = g.nodes.map(n => `${n.id}["${escapeMermaid(n.label)}"]`);
  const edgeLines = (g.edges ?? []).map(e => 
    e.label
      ? `${e.from} -->|${escapeMermaid(e.label)}| ${e.to}`
      : `${e.from} --> ${e.to}`
  );
  return [header, ...nodeLines, ...edgeLines].join("\n");
}

function escapeMermaid(s: string): string {
  // Mermaid is picky about quotes/brackets; quick sanitization helps prevent rendering errors.
  return s.replace(/"/g, '\\"').replace(/\n/g, "\\n");
}