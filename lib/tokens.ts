import type { Tiktoken } from "js-tiktoken";
import {
  TRAINING_KB,
  PRIVATE_KB,
  FILLER_TEXT,
  DEMO_CONTEXT_BUDGET,
} from "./knowledgeBase";

// Real tokenizer, not an estimate. cl100k_base is the encoding used by
// GPT-3.5/4-class models, and its rank tables ship inside js-tiktoken   so this
// runs fully offline, no network or API. The library is heavy, so we pull it in
// via a dynamic import: the tokenizer becomes its own chunk that loads only when
// the context-overflow demo needs to count, keeping the initial page light.

let cachedPromise: Promise<Tiktoken> | null = null;
function encoder(): Promise<Tiktoken> {
  if (cachedPromise === null) {
    cachedPromise = import("js-tiktoken").then((m) =>
      m.getEncoding("cl100k_base"),
    );
  }
  return cachedPromise;
}

export async function countTokens(text: string): Promise<number> {
  const enc = await encoder();
  return enc.encode(text).length;
}

/** Flatten a KB section into the text you'd actually paste into a prompt. */
function trainingText(): string {
  return TRAINING_KB.map((e) => {
    const base = `${e.topic}: ${e.fact}`;
    return e.updatedFact ? `${base} (update: ${e.updatedFact})` : base;
  }).join("\n");
}

function privateText(): string {
  return PRIVATE_KB.map((e) => `${e.topic}: ${e.fact}`).join("\n");
}

export interface TokenSegment {
  label: string;
  tokens: number;
}

export interface TokenBreakdown {
  segments: TokenSegment[];
  total: number;
  budget: number;
  /** Positive when the full KB overflows the budget. */
  overBy: number;
  fits: boolean;
}

/**
 * Count the real token cost of stuffing the ENTIRE knowledge base into one
 * prompt, and compare it to the demo context budget. This is what makes the
 * "just include everything" strategy visibly fail.
 */
export async function fullKbBreakdown(): Promise<TokenBreakdown> {
  const [training, priv, filler] = await Promise.all([
    countTokens(trainingText()),
    countTokens(privateText()),
    countTokens(FILLER_TEXT),
  ]);
  const total = training + priv + filler;

  return {
    segments: [
      { label: "Training KB", tokens: training },
      { label: "Private KB", tokens: priv },
      { label: "Everything else", tokens: filler },
    ],
    total,
    budget: DEMO_CONTEXT_BUDGET,
    overBy: total - DEMO_CONTEXT_BUDGET,
    fits: total <= DEMO_CONTEXT_BUDGET,
  };
}
