"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Verdict } from "@/lib/classify";
import { recommend } from "@/lib/recommend";

interface FixRecommendationProps {
  verdict: Verdict;
}

export function FixRecommendation({ verdict }: FixRecommendationProps): JSX.Element {
  const reduce = useReducedMotion();
  const { fix, reason } = recommend(verdict);

  return (
    <motion.div
      key={verdict}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26, delay: reduce ? 0 : 0.08 }}
      className="rounded-xl2 bg-ink p-5 text-surface shadow-lift sm:p-6"
    >
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-surface/55">
        Recommended fix
      </div>
      <p className="mt-2 text-lg font-semibold leading-snug">{fix}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-surface/70">{reason}</p>
    </motion.div>
  );
}
