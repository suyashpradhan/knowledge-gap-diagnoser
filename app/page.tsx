import { GapDiagnoser } from "@/components/GapDiagnoser";
import { Icon } from "@/components/Icon";
import { VERDICT_META } from "@/lib/verdictMeta";
import type { Verdict } from "@/lib/classify";

const LEGEND: Verdict[] = [
  "known",
  "stale",
  "never-trained",
  "doesnt-fit-context",
];

export default function Page(): JSX.Element {
  return (
    <main className="relative min-h-screen">
      <div
        className="bench-grid pointer-events-none absolute inset-0 h-64"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <header className="mb-8">
          <h1 className="mt-4 text-[2rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
            Knowledge Gap Diagnoser
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-subtle sm:text-base">
            When a model doesn&rsquo;t know something, it&rsquo;s not one
            failure it&rsquo;s one of four. Ask a question and this tool
            classifies the gap against a fixed toy knowledge base, then names
            the fix. No model is called; the tokens are counted for real.
          </p>

          {/* The four-verdict taxonomy   the thing this whole tool exists to teach. */}
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LEGEND.map((v) => {
              const m = VERDICT_META[v];
              return (
                <li
                  key={v}
                  className={`rounded-xl border ${m.softBorder} ${m.softBg} p-3`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-surface ${m.accentBg}`}
                  >
                    <Icon name={m.icon} size={16} />
                  </span>
                  <div
                    className={`mt-2 text-[13px] font-semibold ${m.accentText}`}
                  >
                    {m.label}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-subtle">
                    {m.tagline}
                  </div>
                </li>
              );
            })}
          </ul>
        </header>

        <GapDiagnoser />
      </div>
    </main>
  );
}
