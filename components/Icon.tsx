import type { SVGProps } from "react";

export type IconName =
  | "check"
  | "clock"
  | "lock"
  | "stack"
  | "question"
  | "chevron"
  | "spark"
  | "search";

const PATHS: Record<IconName, JSX.Element> = {
  // known   a clean check
  check: <path d="M20 6 9 17l-5-5" />,
  // stale   a clock, time has moved on
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  // never-trained   a lock, sealed off from training
  lock: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  // doesnt-fit-context   a stack overflowing
  stack: (
    <>
      <path d="M3 8 12 4l9 4-9 4-9-4Z" />
      <path d="M3 12l9 4 9-4" />
      <path d="M3 16l9 4 9-4" />
    </>
  ),
  // unknown-topic   a question mark
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.5a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.5-2.8 2.5" />
      <path d="M12 17h.01" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
