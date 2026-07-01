"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "./Icon";
import type { Classification } from "@/lib/classify";
import { VERDICT_META } from "@/lib/verdictMeta";
import { CUTOFF_DATE } from "@/lib/knowledgeBase";

interface VerdictCardProps {
  classification: Classification | null;
}

/** Plain-language explanation of the mechanism behind each verdict. */
function whyText(c: Classification): string {
  switch (c.verdict) {
    case "known":
      return "This fact sits inside the training data and hasn't changed since, so the model can answer it from its own parametric memory   no outside help needed.";
    case "stale":
      return `The model learned an earlier version of this fact, but the world moved on after the training cutoff (${CUTOFF_DATE}). Its memory is frozen at the old value, so it will answer confidently   and wrong.`;
    case "never-trained":
      return "This lives only in private data that no public model was ever trained on. There's no clever prompt that recovers a fact the model never saw   it has to be handed in.";
    case "doesnt-fit-context":
      return "The answer would require handing over the whole knowledge base at once. The facts exist, but they don't fit in the context window   so you can't fix this by pasting more, you fix it by retrieving less.";
    case "unknown-topic":
      return "Nothing in this small demo knowledge base matches the question, so there's no gap to classify here. Try one of the presets to see a real diagnosis.";
  }
}

export function VerdictCard({ classification }: VerdictCardProps): JSX.Element {
  const reduce = useReducedMotion();

  if (classification === null) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl2 border border-dashed border-hairline bg-surface/60 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-faint">
          <Icon name="spark" size={22} />
        </div>
        <p className="mt-3 max-w-xs text-sm text-subtle">
          Ask a question or pick a preset. The diagnosis and the reason behind
          it shows up here.
        </p>
      </div>
    );
  }

  const meta = VERDICT_META[classification.verdict];
  const isStale = classification.verdict === "stale";
  const entry = classification.matchedTraining;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={classification.verdict + classification.question}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.985 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={`overflow-hidden rounded-xl2 border ${meta.softBorder} ${meta.softBg} shadow-panel`}
        aria-live="polite"
      >
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <motion.span
              initial={reduce ? false : { scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-surface ${meta.accentBg}`}
            >
              <Icon name={meta.icon} size={22} />
            </motion.span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
                  Verdict
                </span>
              </div>
              <h2
                className={`text-2xl font-bold leading-tight ${meta.accentText}`}
              >
                {meta.label}
              </h2>
            </div>
          </div>

          {classification.question.length > 0 && (
            <p className="text-sm text-subtle">
              <span className="text-faint">Question:</span>{" "}
              <span className="font-medium text-ink">
                &ldquo;{classification.question}&rdquo;
              </span>
            </p>
          )}

          <p className="text-[15px] leading-relaxed text-ink">
            {whyText(classification)}
          </p>

          {isStale && entry?.updatedFact && (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-hairline bg-surface p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                  What the model &ldquo;knows&rdquo;
                </div>
                <p className="mt-1 text-sm text-ink">{entry.fact}</p>
                <p className="mt-1 font-mono text-[11px] text-faint">
                  learned {entry.knownSince}
                </p>
              </div>
              <div
                className={`rounded-lg border ${meta.softBorder} ${meta.softBg} p-3`}
              >
                <div
                  className={`text-[11px] font-semibold uppercase tracking-wide ${meta.accentText}`}
                >
                  What's actually true now
                </div>
                <p className="mt-1 text-sm text-ink">{entry.updatedFact}</p>
                <p className={`mt-1 font-mono text-[11px] ${meta.accentText}`}>
                  changed {entry.updatedSince} · after cutoff
                </p>
              </div>
            </div>
          )}

          {classification.trace.length > 0 && (
            <ReasoningTrace classification={classification} />
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

/** The signature element: a readable log of exactly how the verdict was reached. */
function ReasoningTrace({
  classification,
}: {
  classification: Classification;
}): JSX.Element {
  const reduce = useReducedMotion();
  const tone: Record<Classification["trace"][number]["kind"], string> = {
    ok: "text-known",
    miss: "text-never",
    info: "text-faint",
  };
  return (
    <div className="rounded-lg border border-ink/10 bg-ink/[0.03] p-3">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        diagnostic trace
      </div>
      <ul className="space-y-1 font-mono text-[12px] leading-relaxed">
        {classification.trace.map((step, i) => (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduce ? 0 : i * 0.05 }}
            className="flex gap-2"
          >
            <span className={`w-3 shrink-0 ${tone[step.kind]}`}>
              {step.kind === "ok" ? "✔" : step.kind === "miss" ? "✕" : "·"}
            </span>
            <span className="text-subtle">{step.text}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
