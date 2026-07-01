"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "./Icon";
import {
  TRAINING_KB,
  PRIVATE_KB,
  CUTOFF_DATE,
} from "@/lib/knowledgeBase";

interface KnowledgeBasePeekProps {
  matchedTrainingId: string | null;
  matchedPrivateId: string | null;
}

export function KnowledgeBasePeek({
  matchedTrainingId,
  matchedPrivateId,
}: KnowledgeBasePeekProps): JSX.Element {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Auto-open on a fresh match so the highlight is actually visible.
  useEffect(() => {
    if (matchedTrainingId || matchedPrivateId) setOpen(true);
  }, [matchedTrainingId, matchedPrivateId]);

  return (
    <div className="rounded-xl2 border border-hairline bg-surface shadow-panel">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-ink">Peek at the knowledge base</span>
          <span className="mt-0.5 block text-[13px] text-subtle">
            The exact toy data every verdict is computed against
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="text-faint"
        >
          <Icon name="chevron" size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-hairline p-5">
              <section>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
                    Training KB
                  </h3>
                  <span className="font-mono text-[11px] text-faint">
                    cutoff {CUTOFF_DATE}
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {TRAINING_KB.map((e) => {
                    const matched = e.id === matchedTrainingId;
                    const stale = Boolean(e.updatedFact);
                    return (
                      <KbRow key={e.id} matched={matched}>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium text-ink">{e.topic}</span>
                          {stale && (
                            <span className="rounded-full bg-stale-tint px-2 py-0.5 font-mono text-[10px] font-medium text-stale">
                              changed after cutoff
                            </span>
                          )}
                          {matched && <MatchTag />}
                        </div>
                        <p className="mt-0.5 text-[13px] text-subtle">{e.fact}</p>
                      </KbRow>
                    );
                  })}
                </ul>
              </section>

              <section>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
                    Private KB
                  </h3>
                  <span className="font-mono text-[11px] text-faint">
                    never in training
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {PRIVATE_KB.map((e) => {
                    const matched = e.id === matchedPrivateId;
                    return (
                      <KbRow key={e.id} matched={matched} tone="never">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium text-ink">{e.topic}</span>
                          <span className="rounded-full bg-never-tint px-2 py-0.5 font-mono text-[10px] font-medium text-never">
                            private
                          </span>
                          {matched && <MatchTag />}
                        </div>
                        <p className="mt-0.5 text-[13px] text-subtle">{e.fact}</p>
                      </KbRow>
                    );
                  })}
                </ul>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KbRow({
  matched,
  tone = "known",
  children,
}: {
  matched: boolean;
  tone?: "known" | "never";
  children: React.ReactNode;
}): JSX.Element {
  const reduce = useReducedMotion();
  const ring = tone === "never" ? "ring-never" : "ring-known";
  const bg = tone === "never" ? "bg-never-tint" : "bg-known-tint";
  return (
    <motion.li
      animate={
        matched && !reduce
          ? { scale: [1, 1.012, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.5 }}
      className={`rounded-lg border px-3 py-2 transition-colors ${
        matched
          ? `${bg} border-transparent ring-2 ${ring}`
          : "border-hairline bg-canvas"
      }`}
    >
      {children}
    </motion.li>
  );
}

function MatchTag(): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-surface">
      matched
    </span>
  );
}
