# Knowledge Gap Diagnoser

An interactive web tool that classifies knowledge gaps in language models using a four-verdict taxonomy. When a model doesn't know something, this tool determines the underlying reason and suggests the appropriate fix.

## Overview

This educational tool demonstrates how language model knowledge gaps fall into exactly four categories. By submitting a question, the tool classifies it against a toy knowledge base and explains which type of gap it represents.

**Key Features:**
- No external model API calls (fully deterministic classification)
- Real token counting using OpenAI's tiktoken
- Transparent reasoning trace showing classification logic
- Interactive web interface with visual indicators
- Detailed recommendations for addressing each gap type

## The Four-Verdict Taxonomy

| Verdict | Meaning | Example | Fix |
|---------|---------|---------|-----|
| **Known** | Within training knowledge | "What's 2+2?" | No fix needed |
| **Stale** | Parametric knowledge is outdated | "Who won the 2024 election?" (trained before 2024) | RAG or refreshed context |
| **Never-trained** | Never appeared in training data | "What's a Suyash?" (private info) | RAG or fine-tuning |
| **Doesn't fit context** | Facts exist but won't fit in context window | Trying to fit entire knowledge base at once | RAG - retrieve relevant slice only |

## Project Structure

```
knowledge-gap-diagnoser/
├── app/
│   ├── layout.tsx          # Root layout and metadata
│   ├── page.tsx            # Main page with legend and GapDiagnoser
│   └── globals.css         # Global styles
├── components/
│   ├── GapDiagnoser.tsx    # Main interactive component
│   ├── Icon.tsx            # Icon component
│   └── ...other components
├── lib/
│   ├── knowledgeBase.ts    # Training and private knowledge bases
│   ├── classify.ts         # Classification logic and keyword matching
│   ├── recommend.ts        # Recommendations for each verdict
│   ├── verdictMeta.ts      # Metadata (colors, labels, icons) for verdicts
│   └── tokens.ts           # Token counting utilities
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
└── postcss.config.mjs
```

## Technology Stack

- **Framework**: Next.js 14.2
- **UI Library**: React 18.3
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4 + PostCSS
- **Animations**: Framer Motion 11.3
- **Token Counting**: js-tiktoken 1.0

## Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd knowledge-gap-diagnoser
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Opens on `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## How It Works

### Classification Process

1. **Keyword Matching**: The tool uses simple case-insensitive keyword matching against two knowledge bases:
   - `TRAINING_KB`: Knowledge available at training cutoff
   - `PRIVATE_KB`: Knowledge never in training data

2. **Match Scoring**: Single-word keywords must match whole words; multi-word keywords match as phrase substrings. Entries with more matched keywords score higher.

3. **Verdict Assignment**:
   - If training KB match found and is current: **"known"**
   - If training KB match found but updated after cutoff: **"stale"**
   - If only private KB match found: **"never-trained"**
   - If no matches and "include everything" is enabled: **"doesn't-fit-context"**
   - If no matches at all: **"unknown-topic"**

### Token Counting

Token counts are calculated using OpenAI's tiktoken library, showing real token consumption for the knowledge bases and recommendations.

## Core Files

### `lib/classify.ts`
Contains the classification logic. Key functions:
- `keywordMatches()`: Simple keyword matching logic
- `bestHit()`: Finds best-matching entry in a knowledge base
- `classify()`: Main classification function

### `lib/knowledgeBase.ts`
Defines the toy knowledge bases with training and private entries.

### `lib/recommend.ts`
Maps each verdict to a recommended fix strategy.

### `lib/verdictMeta.ts`
Stores visual metadata for verdicts (colors, icons, labels).

## Learning Resources

This tool teaches:
- How language models store and retrieve knowledge
- Why "just prompt harder" doesn't solve all failures
- The difference between parametric and context-based knowledge
- Why RAG (Retrieval-Augmented Generation) solves certain gaps
- How context window limits affect information retrieval
- Token counting basics

## Customization

### Adding Knowledge Base Entries

Edit `lib/knowledgeBase.ts` to add new training or private entries:

```typescript
{
  topic: "Your Topic",
  keywords: ["keyword1", "keyword2"],
  knownSince: "2020-01-01",
  updatedFact: null,
  updatedSince: null,
}
```

### Changing Visual Theme

Modify `lib/verdictMeta.ts` to change colors and icons for each verdict type.

### Adjusting Classification Logic

Edit `lib/classify.ts` to change keyword matching behavior or verdict assignment rules.

## Notes

- This is an educational tool with a deliberately simple matching algorithm
- Real systems use semantic search with embeddings for better matching
- The knowledge bases are intentionally small to make the tool's reasoning transparent
- No external API calls are made during classification
- All reasoning is shown to the user for educational clarity

## License

MIT

## Author

Suyash Pradhan
