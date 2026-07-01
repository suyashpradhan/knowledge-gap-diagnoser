// The toy "world" this diagnoser reasons about.
// Everything here is FIXED and honest: the classifier and token counter run
// against exactly this data. Nothing is fetched, guessed, or model-generated.

/**
 * The pretend training cutoff. Any fact whose *update* happened after this date
 * is, by definition, invisible to a model trained on data up to the cutoff
 * that is the entire mechanism behind a "Stale" verdict.
 */
export const CUTOFF_DATE = "2026-01-01";

/**
 * The pretend context-window budget for the "include everything" demo,
 * measured in tokens. Small on purpose so the full KB visibly overflows it.
 */
export const DEMO_CONTEXT_BUDGET = 2000;

export interface TrainingEntry {
  id: string;
  /** Keyword-matchable topic label. Matching here is deliberately simple. */
  topic: string;
  /** Extra keywords that should also match this entry. */
  keywords: string[];
  /** The fact as it was true at training time. */
  fact: string;
  /** When this fact entered the training knowledge (<= cutoff). */
  knownSince: string;
  /** If present, the fact changed AFTER the cutoff   the model can't know this. */
  updatedFact?: string;
  /** When the update happened (strictly after cutoff). */
  updatedSince?: string;
}

export interface PrivateEntry {
  id: string;
  topic: string;
  keywords: string[];
  /** A fact that lives only in "your" private data   never in any training set. */
  fact: string;
}

/**
 * Training knowledge base: things a model plausibly learned before the cutoff.
 * A handful carry a post-cutoff `updatedFact` to represent the world moving on.
 */
export const TRAINING_KB: readonly TrainingEntry[] = [
  {
    id: "t-photosynthesis",
    topic: "photosynthesis",
    keywords: ["photosynthesis", "chlorophyll", "plants make food"],
    fact: "Plants convert light, water, and CO2 into glucose and oxygen using chlorophyll.",
    knownSince: "1900-01-01",
  },
  {
    id: "t-http",
    topic: "http",
    keywords: ["http", "status code", "404", "200 ok"],
    fact: "HTTP status codes group into 2xx success, 3xx redirect, 4xx client error, 5xx server error.",
    knownSince: "1999-06-01",
  },
  {
    id: "t-pi",
    topic: "pi",
    keywords: ["pi", "circle constant", "3.14159"],
    fact: "Pi is the ratio of a circle's circumference to its diameter, roughly 3.14159.",
    knownSince: "0250-01-01",
  },
  {
    id: "t-french-capital",
    topic: "capital of france",
    keywords: ["capital of france", "paris", "france capital"],
    fact: "The capital of France is Paris.",
    knownSince: "1800-01-01",
  },
  {
    id: "t-git",
    topic: "git",
    keywords: ["git", "version control", "commit", "merge"],
    fact: "Git is a distributed version-control system that tracks changes via commits and branches.",
    knownSince: "2010-01-01",
  },
  {
    id: "t-transformer",
    topic: "transformer architecture",
    keywords: [
      "transformer",
      "attention",
      "self-attention",
      "attention is all you need",
    ],
    fact: "The Transformer uses self-attention to relate every token to every other token in a sequence.",
    knownSince: "2017-06-12",
  },
  {
    id: "t-speed-of-light",
    topic: "speed of light",
    keywords: ["speed of light", "light speed", "299792458"],
    fact: "Light travels at about 299,792,458 meters per second in a vacuum.",
    knownSince: "1975-01-01",
  },
  {
    id: "t-python-release",
    topic: "python latest version",
    keywords: ["python version", "latest python", "python release"],
    fact: "The latest stable Python is 3.12, released October 2023.",
    knownSince: "2023-10-02",
    updatedFact:
      "Python 3.13 became the latest stable release, adding an experimental free-threaded build.",
    updatedSince: "2026-03-15",
  },
  {
    id: "t-world-cup",
    topic: "world cup champion",
    keywords: ["world cup", "football champion", "soccer champion"],
    fact: "Argentina won the 2022 FIFA World Cup.",
    knownSince: "2022-12-18",
    updatedFact:
      "A new nation lifted the trophy at the following World Cup, held after the training cutoff.",
    updatedSince: "2026-07-20",
  },
  {
    id: "t-ceo",
    topic: "acme corp ceo",
    keywords: ["acme ceo", "acme corp leader", "who runs acme"],
    fact: "As of training, Dana Reyes was the CEO of the public company Acme Corp.",
    knownSince: "2021-01-01",
    updatedFact:
      "Acme Corp appointed a new CEO in a leadership change announced after the cutoff.",
    updatedSince: "2026-04-02",
  },
  {
    id: "t-tallest-building",
    topic: "tallest building",
    keywords: ["tallest building", "tallest tower", "burj khalifa"],
    fact: "The Burj Khalifa in Dubai is the world's tallest building at 828 meters.",
    knownSince: "2010-01-04",
  },
  {
    id: "t-json",
    topic: "json",
    keywords: ["json", "javascript object notation", "key value"],
    fact: "JSON is a lightweight, text-based data format built from objects, arrays, and primitives.",
    knownSince: "2006-01-01",
  },
  {
    id: "t-mount-everest",
    topic: "mount everest",
    keywords: ["everest", "tallest mountain", "highest peak"],
    fact: "Mount Everest is Earth's highest peak above sea level at about 8,849 meters.",
    knownSince: "1955-01-01",
  },
  {
    id: "t-us-president",
    topic: "us president 2021",
    keywords: ["us president", "president elected", "white house"],
    fact: "A U.S. president was inaugurated in January 2021 following the 2020 election.",
    knownSince: "2021-01-20",
    updatedFact:
      "A subsequent U.S. presidential term began after an election held past the training cutoff.",
    updatedSince: "2026-01-20",
  },
];

/**
 * Private knowledge base: "your company's" data. These topics deliberately
 * do NOT appear anywhere in TRAINING_KB   no amount of clever prompting can
 * recover a fact the model was never trained on.
 */
export const PRIVATE_KB: readonly PrivateEntry[] = [
  {
    id: "p-vacation",
    topic: "vacation policy",
    keywords: ["vacation policy", "pto", "time off", "annual leave"],
    fact: "Internal policy: employees accrue 22 days of paid leave per year, rolling over up to 5 days.",
  },
  {
    id: "p-deploy",
    topic: "deploy process",
    keywords: [
      "deploy process",
      "release process",
      "ship to prod",
      "internal deploy",
    ],
    fact: "Internal runbook: deploys go through the 'harbor' pipeline with a two-reviewer approval gate.",
  },
  {
    id: "p-project-atlas",
    topic: "project atlas",
    keywords: ["project atlas", "atlas roadmap", "atlas launch"],
    fact: "Project Atlas is the unreleased internal codename for next quarter's billing migration.",
  },
  {
    id: "p-oncall",
    topic: "oncall rotation",
    keywords: ["oncall", "on-call schedule", "pager rotation"],
    fact: "The on-call rotation is weekly, starting Wednesdays, tracked in the internal 'watchtower' sheet.",
  },
  {
    id: "p-wifi",
    topic: "office wifi",
    keywords: ["office wifi", "guest network", "wifi password"],
    fact: "The guest office Wi-Fi network is 'acme-guest' and rotates its passphrase every 30 days.",
  },
];

/**
 * Unrelated filler text. Its only job is to bulk up the "include everything"
 * token count so the full KB visibly exceeds DEMO_CONTEXT_BUDGET. It is never
 * classified or matched   it just represents "all the other stuff" a naive
 * "just stuff it all in the prompt" approach would drag along.
 */
const FILLER_CORE: string = [
  "Appendix A. The archive that follows is a grab-bag of miscellaneous notes retained for completeness.",
  "It contains meeting minutes, deprecated design memos, half-finished proposals, and long tables of",
  "example data that nobody references anymore but which still occupy space whenever someone insists on",
  "handing the model 'everything, just in case.' A running-club sign-up sheet lists forty names and",
  "preferred pace groups. A cafeteria menu enumerates fourteen weeks of rotating lunch specials, each",
  "with allergen annotations and a small paragraph about sourcing. A facilities log records every",
  "elevator inspection for the past six years in tabular form. There are three drafts of a mission",
  "statement that were ultimately discarded, a glossary of internal acronyms most of which are obsolete,",
  "and a lengthy retrospective on a product that never shipped. None of this is secret and none of it is",
  "wrong; it is simply noise relative to almost any specific question. Bundling it into a prompt costs",
  "tokens, dilutes attention, and buries the one relevant sentence somewhere in the middle where it is",
  "easiest to overlook. The point of showing it here is not the content but the volume: retrieval exists",
  "precisely so that this material can stay on the shelf until the rare moment a question actually needs",
  "a slice of it, rather than riding along with every single request and crowding out the budget.",
  "Appendix B repeats much of Appendix A in a slightly different order, because real archives are rarely",
  "deduplicated, and the redundancy itself is part of why naively concatenating everything scales badly.",
  "Consider the running-club sheet again: pace groups from nine-minute miles down to recovery walks, with",
  "notes on who prefers trails, who prefers the track, and who only shows up for the post-run pastries.",
  "Consider the menu again: the Tuesday grain bowl, the Thursday soup rotation, the Friday experiment that",
  "the kitchen keeps threatening to retire. Consider the elevator log again: car three has needed its door",
  "sensor recalibrated with suspicious regularity. All true, all harmless, all utterly irrelevant to the",
  "question you actually asked   and yet all of it competes for the same finite context window if you let",
  "it. That competition, not secrecy, is the reason 'just include everything' fails at scale.",
  "Appendix C collects six quarters of parking-lot capacity surveys, each noting how many spaces sat empty",
  "at nine in the morning versus one in the afternoon, along with a proposal for angled striping that was",
  "tabled indefinitely. It also preserves the full text of a debate about whether the third-floor kitchen",
  "should stock oat milk, almond milk, or both, complete with a straw poll, two dissenting memos, and a",
  "compromise nobody was happy with. A separate section logs every printer jam reported to facilities,",
  "sorted by floor and then by the apologetic tone of the person reporting it.",
  "Appendix D is an inventory of promotional swag accumulated over the years: tote bags in four shades of",
  "the old brand color, enamel pins commemorating launches that shipped late, stickers referencing an",
  "internal joke whose origin no current employee can explain, and a crate of umbrellas that leak. Each",
  "line item carries a quantity, a storage location, and a note about whether it can be given away at the",
  "next all-hands. None of it answers a single question anyone would ever ask a model, yet all of it would",
  "ride along in the prompt if the rule were simply 'attach the whole archive and let the model sort it out.'",
  "Appendix E reproduces the onboarding scavenger hunt from three years ago, twelve clues leading new hires",
  "around a floor plan that has since been renovated twice, so the clues now point at walls. It is charming",
  "and completely useless, which is precisely the profile of most material that accumulates in a shared",
  "drive: too sentimental to delete, too irrelevant to retrieve, and too bulky to carry on every request.",
  "The moral repeated across all five appendices is the same one retrieval was invented to enforce: keep the",
  "shelf large, keep the prompt small, and fetch the one paragraph that matters only when a question asks for it.",
].join(" ");

// Real shared drives are never deduplicated: they hoard superseded revisions of
// the same documents. That redundancy is itself part of why "just include
// everything" scales badly, so the filler models it literally   the core
// appendices plus two older, superseded copies that nobody ever cleaned up.
export const FILLER_TEXT: string = [
  FILLER_CORE,
  "--- Revision 2 (superseded, retained by mistake) ---",
  FILLER_CORE,
  "--- Revision 1 (superseded, retained by mistake) ---",
  FILLER_CORE,
].join("\n\n");
