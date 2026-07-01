import {
  TRAINING_KB,
  PRIVATE_KB,
  CUTOFF_DATE,
  type TrainingEntry,
  type PrivateEntry,
} from "./knowledgeBase";

export type Verdict =
  | "known"
  | "stale"
  | "never-trained"
  | "doesnt-fit-context"
  | "unknown-topic";

/** One line of the visible diagnostic log   this is how we "show our work." */
export interface ReasoningStep {
  text: string;
  kind: "ok" | "miss" | "info";
}

export interface Classification {
  verdict: Verdict;
  question: string;
  matchedTraining: TrainingEntry | null;
  matchedPrivate: PrivateEntry | null;
  matchedKeywords: string[];
  trace: ReasoningStep[];
}

// --- Matching -------------------------------------------------------------
// This is deliberately SIMPLE: case-insensitive keyword matching, not real
// semantic search. Single-word keywords must match a whole word; multi-word
// keywords match as a phrase substring. Real systems compare *meaning* with
// embeddings   that is the next lesson. Keeping it dumb-but-honest here means
// nothing about the verdict is hidden or magic.

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function wordSet(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  );
}

function keywordMatches(keyword: string, question: string): boolean {
  const q = normalize(question);
  const k = normalize(keyword);
  if (k.includes(" ")) return q.includes(k); // phrase → substring
  return wordSet(question).has(k); // single word → whole-word match
}

interface Hit<T> {
  entry: T;
  matched: string[];
}

function bestHit<T extends { keywords: string[]; topic: string }>(
  entries: readonly T[],
  question: string,
): Hit<T> | null {
  let best: Hit<T> | null = null;
  for (const entry of entries) {
    const candidates = Array.from(new Set([entry.topic, ...entry.keywords]));
    const matched = candidates.filter((c) => keywordMatches(c, question));
    if (
      matched.length > 0 &&
      (best === null || matched.length > best.matched.length)
    ) {
      best = { entry, matched };
    }
  }
  return best;
}

// --- Classification -------------------------------------------------------

function isStale(entry: TrainingEntry): boolean {
  return Boolean(entry.updatedFact && entry.updatedSince);
}

/**
 * Classify a plain question against the toy KBs. Fully deterministic.
 * `includeEverything` short-circuits to the context-overflow demo, where the
 * question isn't the point   the attempt to stuff the whole KB into context is.
 */
export function classify(
  question: string,
  includeEverything: boolean,
): Classification {
  const trace: ReasoningStep[] = [];
  const trimmed = question.trim();

  if (includeEverything) {
    return {
      verdict: "doesnt-fit-context",
      question: trimmed,
      matchedTraining: null,
      matchedPrivate: null,
      matchedKeywords: [],
      trace: [
        { text: '"include everything" mode is on', kind: "info" },
        {
          text: "strategy: concatenate the entire KB into one prompt",
          kind: "info",
        },
        {
          text: "measuring full-KB size against the context budget…",
          kind: "info",
        },
      ],
    };
  }

  if (trimmed.length === 0) {
    return {
      verdict: "unknown-topic",
      question: trimmed,
      matchedTraining: null,
      matchedPrivate: null,
      matchedKeywords: [],
      trace: [{ text: "no question entered", kind: "miss" }],
    };
  }

  const trainingHit = bestHit(TRAINING_KB, question);
  const privateHit = bestHit(PRIVATE_KB, question);

  if (trainingHit) {
    const entry = trainingHit.entry;
    trace.push({
      text: `matched training topic "${entry.topic}"`,
      kind: "ok",
    });
    trace.push({
      text: `on keyword(s): ${trainingHit.matched.join(", ")}`,
      kind: "info",
    });

    if (isStale(entry)) {
      trace.push({
        text: `fact carries an update dated after cutoff ${CUTOFF_DATE}`,
        kind: "info",
      });
      trace.push({
        text: "parametric memory holds the OLD value → stale",
        kind: "miss",
      });
      return {
        verdict: "stale",
        question: trimmed,
        matchedTraining: entry,
        matchedPrivate: null,
        matchedKeywords: trainingHit.matched,
        trace,
      };
    }

    trace.push({
      text: `known since ${entry.knownSince}, no post-cutoff change`,
      kind: "ok",
    });
    return {
      verdict: "known",
      question: trimmed,
      matchedTraining: entry,
      matchedPrivate: null,
      matchedKeywords: trainingHit.matched,
      trace,
    };
  }

  trace.push({ text: "no training-KB topic matched", kind: "miss" });

  if (privateHit) {
    trace.push({
      text: `matched PRIVATE topic "${privateHit.entry.topic}"`,
      kind: "ok",
    });
    trace.push({
      text: "this topic never appeared in training data → never-trained",
      kind: "miss",
    });
    return {
      verdict: "never-trained",
      question: trimmed,
      matchedTraining: null,
      matchedPrivate: privateHit.entry,
      matchedKeywords: privateHit.matched,
      trace,
    };
  }

  trace.push({ text: "no private-KB topic matched either", kind: "miss" });
  trace.push({
    text: "this toy KB simply doesn't cover the topic",
    kind: "info",
  });
  return {
    verdict: "unknown-topic",
    question: trimmed,
    matchedTraining: null,
    matchedPrivate: null,
    matchedKeywords: [],
    trace,
  };
}
