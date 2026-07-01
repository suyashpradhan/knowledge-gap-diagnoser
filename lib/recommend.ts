import type { Verdict } from "./classify";

export interface Recommendation {
  /** The short name of the fix. */
  fix: string;
  /** One-line reason grounded in the mechanism, not vibes. */
  reason: string;
}

const RECOMMENDATIONS: Record<Verdict, Recommendation> = {
  known: {
    fix: "No fix needed",
    reason: "This is within training knowledge   the model already holds it.",
  },
  stale: {
    fix: "RAG or a refreshed context",
    reason:
      "The model's parametric knowledge is outdated; provide the current fact at request time.",
  },
  "never-trained": {
    fix: "RAG (or fine-tuning for behavior, not facts)",
    reason:
      "This was never in training data   no prompting trick recovers it, only providing it as context or retraining.",
  },
  "doesnt-fit-context": {
    fix: "RAG   retrieve only the relevant slice",
    reason:
      "The facts exist but can't all fit in the context window affordably or reliably (cost + lost-in-the-middle); fetch the slice you need, not everything.",
  },
  "unknown-topic": {
    fix: "Out of scope for this toy KB",
    reason:
      "This demo's small knowledge base doesn't cover the topic, so there's nothing to diagnose here.",
  },
};

export function recommend(verdict: Verdict): Recommendation {
  return RECOMMENDATIONS[verdict];
}
