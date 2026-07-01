"use client";

import { motion } from "framer-motion";
import { Icon } from "./Icon";
import type { Verdict } from "@/lib/classify";

// Presets are curated to land on each verdict reliably against the fixed KB,
// so a first-time visitor can see all four outcomes without guessing keywords.
interface Preset {
  label: string;
  question: string;
  hits: Verdict;
}

const PRESETS: readonly Preset[] = [
  {
    label: "Capital of France",
    question: "What is the capital of France?",
    hits: "known",
  },
  {
    label: "Latest Python version",
    question: "What is the latest Python version?",
    hits: "stale",
  },
  {
    label: "Our vacation policy",
    question: "What is our vacation policy?",
    hits: "never-trained",
  },
  {
    label: "Who is the Acme CEO now?",
    question: "Who is the Acme Corp CEO now?",
    hits: "stale",
  },
  {
    label: "Project Atlas details",
    question: "Tell me about Project Atlas.",
    hits: "never-trained",
  },
  {
    label: "Best ice cream flavor",
    question: "What is the best ice cream flavor?",
    hits: "unknown-topic",
  },
];

interface QuestionInputProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onDiagnose: (question: string) => void;
  includeEverything: boolean;
  onToggleEverything: (on: boolean) => void;
}

export function QuestionInput({
  draft,
  onDraftChange,
  onDiagnose,
  includeEverything,
  onToggleEverything,
}: QuestionInputProps): JSX.Element {
  return (
    <div className="rounded-xl2 border border-hairline bg-surface p-5 shadow-panel sm:p-6">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-faint">
        <Icon name="search" size={15} />
        Ask a question
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={draft}
          disabled={includeEverything}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onDiagnose(draft);
          }}
          placeholder="e.g. What is the latest Python version?"
          aria-label="Question to diagnose"
          className="w-full rounded-lg border border-hairline bg-canvas px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-faint focus:border-ink focus:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          disabled={includeEverything || draft.trim().length === 0}
          onClick={() => onDiagnose(draft)}
          className="shrink-0 rounded-lg bg-ink px-5 py-3 text-[15px] font-semibold text-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Diagnose
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-faint">Or try a preset</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <motion.button
              key={p.label}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                onToggleEverything(false);
                onDraftChange(p.question);
                onDiagnose(p.question);
              }}
              className="rounded-full border border-hairline bg-canvas px-3.5 py-1.5 text-[13px] font-medium text-subtle transition hover:border-ink hover:text-ink"
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-contextfit-edge bg-contextfit-tint/60 p-3">
        <button
          type="button"
          role="switch"
          aria-checked={includeEverything}
          aria-label="Answer by pasting the entire knowledge base into one prompt"
          onClick={() => onToggleEverything(!includeEverything)}
          className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
            includeEverything ? "bg-contextfit" : "bg-hairline"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface shadow-sm ${
              includeEverything ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => onToggleEverything(!includeEverything)}
          className="cursor-pointer text-left text-[13px] leading-snug text-subtle"
        >
          <span className="font-semibold text-ink">
            Answer by pasting the entire KB into one prompt.
          </span>{" "}
          The naive &ldquo;just include everything&rdquo; strategy flip this to
          see whether it fits the context budget.
        </button>
      </div>
    </div>
  );
}
