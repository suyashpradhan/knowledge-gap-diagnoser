"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { classify } from "@/lib/classify";
import { fullKbBreakdown, type TokenBreakdown } from "@/lib/tokens";
import { QuestionInput } from "./QuestionInput";
import { VerdictCard } from "./VerdictCard";
import { FixRecommendation } from "./FixRecommendation";
import { KnowledgeBasePeek } from "./KnowledgeBasePeek";
import { TokenMathPanel } from "./TokenMathPanel";
import { HallucinationExplainer } from "./HallucinationExplainer";

export function GapDiagnoser(): JSX.Element {
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [includeEverything, setIncludeEverything] = useState(false);
  const [showHallucination, setShowHallucination] = useState(false);

  const classification = useMemo(() => {
    if (!includeEverything && submitted === null) return null;
    return classify(submitted ?? "", includeEverything);
  }, [submitted, includeEverything]);

  const needsTokens = classification?.verdict === "doesnt-fit-context";
  const [tokenBreakdown, setTokenBreakdown] = useState<TokenBreakdown | null>(null);

  useEffect(() => {
    if (!needsTokens) {
      setTokenBreakdown(null);
      return;
    }
    // Tokenizer loads lazily; compute once it's ready. Guard against races.
    let cancelled = false;
    void fullKbBreakdown().then((b) => {
      if (!cancelled) setTokenBreakdown(b);
    });
    return () => {
      cancelled = true;
    };
  }, [needsTokens]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <QuestionInput
        draft={draft}
        onDraftChange={setDraft}
        onDiagnose={(q) => setSubmitted(q)}
        includeEverything={includeEverything}
        onToggleEverything={setIncludeEverything}
      />

      <VerdictCard classification={classification} />

      <AnimatePresence>
        {classification && classification.verdict !== "unknown-topic" && (
          <motion.div
            key="fix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FixRecommendation verdict={classification.verdict} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {needsTokens && (
          <motion.div
            key="tokens"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {tokenBreakdown ? (
              <TokenMathPanel breakdown={tokenBreakdown} />
            ) : (
              <div className="rounded-xl2 border border-contextfit-edge bg-surface p-6 shadow-panel">
                <div className="h-4 w-40 animate-pulse rounded bg-canvas" />
                <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-canvas" />
                <p className="mt-4 font-mono text-[11px] text-faint">
                  loading tokenizer (cl100k_base)…
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <KnowledgeBasePeek
        matchedTrainingId={classification?.matchedTraining?.id ?? null}
        matchedPrivateId={classification?.matchedPrivate?.id ?? null}
      />

      <HallucinationExplainer
        open={showHallucination}
        onToggle={() => setShowHallucination((s) => !s)}
      />
    </div>
  );
}
