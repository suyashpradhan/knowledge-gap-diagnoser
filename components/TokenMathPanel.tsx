"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { TokenBreakdown } from "@/lib/tokens";

interface TokenMathPanelProps {
  breakdown: TokenBreakdown;
}

const SEGMENT_COLOR = ["bg-contextfit", "bg-never", "bg-stale"] as const;

export function TokenMathPanel({
  breakdown,
}: TokenMathPanelProps): JSX.Element {
  const reduce = useReducedMotion();
  const { segments, total, budget, overBy } = breakdown;
  // Scale the whole bar to the total, and mark where the budget line falls.
  const budgetPct = Math.min(100, (budget / total) * 100);

  return (
    <div className="rounded-xl2 border border-contextfit-edge bg-surface p-5 shadow-panel sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">The token math</h3>
          <p className="mt-0.5 text-[13px] text-subtle">
            Real counts from js-tiktoken (cl100k_base) not an estimate.
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-bold text-contextfit">
            {total.toLocaleString()}
          </div>
          <div className="font-mono text-[11px] text-faint">tokens total</div>
        </div>
      </div>

      {/* Budget meter: full width = whole KB; the budget only reaches part way. */}
      <div className="relative mt-5">
        <div className="flex h-9 w-full overflow-hidden rounded-lg bg-canvas ring-1 ring-hairline">
          {segments.map((seg, i) => {
            const pct = (seg.tokens / total) * 100;
            return (
              <motion.div
                key={seg.label}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 22,
                  delay: reduce ? 0 : i * 0.08,
                }}
                className={`h-full ${SEGMENT_COLOR[i] ?? "bg-unknown"}`}
                title={`${seg.label}: ${seg.tokens} tokens`}
              />
            );
          })}
        </div>

        {/* Budget cutoff marker */}
        <div
          className="absolute -top-1 bottom-0 flex flex-col items-center"
          style={{ left: `${budgetPct}%` }}
        >
          <div className="h-[calc(100%+0.5rem)] w-0.5 bg-ink" />
        </div>
        <div
          className="absolute mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-medium text-ink"
          style={{ left: `${budgetPct}%`, top: "100%" }}
        >
          budget {budget.toLocaleString()}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-sm ${SEGMENT_COLOR[i] ?? "bg-unknown"}`}
            />
            <span className="text-[12px] text-subtle">
              {seg.label}{" "}
              <span className="font-mono text-faint">
                {seg.tokens.toLocaleString()}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-contextfit-tint px-3 py-2.5 text-[13px] leading-relaxed text-ink">
        The full knowledge base is{" "}
        <span className="font-semibold text-contextfit">
          {overBy.toLocaleString()} tokens over
        </span>{" "}
        the {budget.toLocaleString()}-token budget. Pasting everything
        doesn&rsquo;t just cost more past the line it simply won&rsquo;t fit.
        Retrieval fetches only the slice that answers the question.
      </p>
    </div>
  );
}
