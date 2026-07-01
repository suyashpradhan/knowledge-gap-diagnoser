"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "./Icon";

interface HallucinationExplainerProps {
  open: boolean;
  onToggle: () => void;
}

export function HallucinationExplainer({
  open,
  onToggle,
}: HallucinationExplainerProps): JSX.Element {
  const reduce = useReducedMotion();

  return (
    <div className="rounded-xl2 border border-hairline bg-surface shadow-panel">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-ink">
            So why does it answer confidently instead of saying &ldquo;I
            don&rsquo;t know&rdquo;?
          </span>
          <span className="mt-0.5 block text-[13px] text-subtle">
            The short, non-hand-wavy version
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
            <div className="space-y-3 border-t border-hairline p-5 text-[14px] leading-relaxed text-ink">
              <p>
                A model&rsquo;s weights are a fixed, finite amount of space far
                smaller than the text it was trained on. So knowledge is stored{" "}
                <em>lossily</em>: common facts survive clearly, rare ones get
                compressed into a blur.
              </p>
              <p>
                When the answer is blurry, the model can either guess or
                abstain. Which one looks better depends on how it&rsquo;s
                scored. On most training and eval setups, a correct guess earns
                credit and &ldquo;I don&rsquo;t know&rdquo; earns nothing so a
                confident guess has higher expected value, even when it&rsquo;s
                sometimes wrong. The behavior is learned from that incentive,
                not chosen in the moment.
              </p>
              <div className="rounded-lg border border-hairline bg-canvas p-3.5">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
                  <Icon name="stack" size={13} />
                  The Bloom-filter parallel
                </div>
                <p className="text-[13px] text-subtle">
                  A Bloom filter saves space by allowing{" "}
                  <em>false positives</em>: it sometimes says &ldquo;yes,
                  present&rdquo; for something absent, but never misses
                  what&rsquo;s there. It trades a bit of certainty for a lot of
                  memory. A model under a parameter budget makes a similar trade
                  confident false positives are the price of compressing so much
                  into so little.
                </p>
              </div>
              <p className="text-[13px] text-subtle">
                This is exactly why the fix for a knowledge gap is almost never
                &ldquo;prompt it harder.&rdquo; If the fact is stale, private,
                or too big to fit, no amount of confidence conjures it you have
                to <span className="font-medium text-ink">supply the fact</span>
                , which is what every recommendation above points to.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
