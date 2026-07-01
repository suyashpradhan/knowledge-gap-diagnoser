import type { Verdict } from "./classify";
import type { IconName } from "@/components/Icon";

// One place that decides how every verdict looks and reads. Each verdict is
// distinguished by color AND icon AND label   never color alone   so the four
// outcomes stay legible to colorblind users and in grayscale.
export interface VerdictMeta {
  label: string;
  /** Plain-language, one clause: what this verdict actually means. */
  tagline: string;
  icon: IconName;
  /** Explicit Tailwind classes (kept as literals so JIT can see them). */
  accentText: string;
  accentBg: string;
  accentBorder: string;
  softBg: string;
  softBorder: string;
  dot: string;
}

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  known: {
    label: "Known",
    tagline: "In training data and still current",
    icon: "check",
    accentText: "text-known",
    accentBg: "bg-known",
    accentBorder: "border-known",
    softBg: "bg-known-tint",
    softBorder: "border-known-edge",
    dot: "bg-known",
  },
  stale: {
    label: "Stale",
    tagline: "Learned once, but the fact has since changed",
    icon: "clock",
    accentText: "text-stale",
    accentBg: "bg-stale",
    accentBorder: "border-stale",
    softBg: "bg-stale-tint",
    softBorder: "border-stale-edge",
    dot: "bg-stale",
  },
  "never-trained": {
    label: "Never-trained",
    tagline: "Private data the model never saw",
    icon: "lock",
    accentText: "text-never",
    accentBg: "bg-never",
    accentBorder: "border-never",
    softBg: "bg-never-tint",
    softBorder: "border-never-edge",
    dot: "bg-never",
  },
  "doesnt-fit-context": {
    label: "Doesn't fit context",
    tagline: "The facts exist but won't fit in the window",
    icon: "stack",
    accentText: "text-contextfit",
    accentBg: "bg-contextfit",
    accentBorder: "border-contextfit",
    softBg: "bg-contextfit-tint",
    softBorder: "border-contextfit-edge",
    dot: "bg-contextfit",
  },
  "unknown-topic": {
    label: "Not in this toy KB",
    tagline: "Outside the small demo knowledge base",
    icon: "question",
    accentText: "text-unknown",
    accentBg: "bg-unknown",
    accentBorder: "border-unknown",
    softBg: "bg-unknown-tint",
    softBorder: "border-unknown-edge",
    dot: "bg-unknown",
  },
};
