// API: POST /api/chart
// Body: { text: string, mode?: "flowchart" | "timeline" | "rules", direction?: "TB"|"LR"|"BT"|"RL" }
// Returns: { mermaid: string }

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GraphSchema, toMermaid } from "@/lib/parsers/schema";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text, mode = "flowchart", direction = "TB" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid 'text'." }, { status: 400 });
    }

    const system = `You convert legal/academic text into a directed graph of nodes and edges for diagramming.
Return ONLY valid JSON that matches this TypeScript type:

type Graph = {
  direction: "TB" | "BT" | "LR" | "RL",
  nodes: { id: string, label: string }[],
  edges?: { from: string, to: string, label?: string }[]
};

Rules:
- Never wrap JSON in markdown.
- 'id' must be unique short tokens (e.g., n1, n2, n3).
- Keep labels concise (<= 80 chars).
- Prefer ${direction} for 'direction'.
- For "${mode}" mode:
  - "flowchart": general logic flow, parent → child.
  - "timeline": chronological sequence (earliest → latest).
  - "rules": main rule node → exceptions/conditions/outputs.`;

    const user = `TEXT TO MAP:\n${text}`;

    // Use Chat Completions (compatible with all recent SDK versions)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw =
      completion.choices?.[0]?.message?.content?.trim() ?? "";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Model did not return valid JSON.", raw },
        { status: 502 }
      );
    }

    const graph = GraphSchema.parse(parsed);
    const mermaid = toMermaid(graph);
    return NextResponse.json({ mermaid });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
