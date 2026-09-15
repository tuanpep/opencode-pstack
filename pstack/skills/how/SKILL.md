---
name: how
description: "Use for /how, \"how does X work\", and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Can critique architecture. Do not use as a default pre-edit walkthrough for a local or already-traced change. Use why for motivation."
---

# How

Explore the codebase to answer "how does X work?" questions. Produce clear architectural explanations at the level of a senior engineer onboarding onto a subsystem. Enough to build a working mental model, not annotated source code.

Two modes:

1. **Explain** (default). Explore the codebase and produce a clear explanation
2. **Critique.** Explain first, then spawn multiple models to independently identify architectural issues

## Explain Mode

### Step 1. Understand the Question and Assess Complexity

Parse what the user is asking about:

- "How does the rate limiter work?", a subsystem
- "How do we handle billing for on-demand usage?", a feature flow
- "How is the auth service structured?", an architectural overview
- "Walk me through what happens when a user submits a form", a runtime trace

Identify the scope. If ambiguous, state your best-guess interpretation before exploring. Don't ask. Let the user redirect if you're off.

**Assess complexity to decide the approach:**

- **Already grounded.** If this session already has a traced model of the subsystem, do not spawn. Write or reuse the explanation from what you have. Go to Step 4.
- **Simple** (a single module, a small utility, a narrow question like "how does function X work", or grounding for a change whose files you can read directly): explore and explain in this session. Do not spawn. Go to Step 2b.
- **Complex** (a subsystem spanning multiple files/services, a cross-cutting feature, a full architectural overview, and the parent has not already traced it): spawn at most two parallel explorer agents, then synthesize here. Go to Step 2a.

When in doubt, lean simple. You can always spawn explorers if this session hits a wall. Do not spawn how from inside another design skill when the parent can read the files.

### Step 2a. Explore (complex questions only)

Decompose the question into at most two parallel exploration angles, each a distinct slice of the subsystem so explorers don't duplicate work. Example split for "how does the rate limiter work?":

- Explorer 1: data model and request path
- Explorer 2: configuration, enforcement, and metrics

The right decomposition depends on the question. Two explorers is the cap. If the question is one slice, use one explorer or stay in this session. Do not add a third or fourth explorer for completeness. Do not spawn an explainer after them.

Spawn all explorers in a single message:

- `subagent_type`: `research` on OpenCode, or the host's configured research agent elsewhere
- `readonly`: `true`

Each explorer gets the same base prompt from `references/explorer-prompt.md` plus a specific exploration angle naming its slice. Each explorer should:
- Start broad: Glob for relevant directories, Grep for key types/interfaces/class names
- Follow the thread: from an entry point, trace the call chain (callers, callees, data flow, type definitions)
- Read the actual code, don't guess from file names
- Stop when it can describe the full path from input to output (or trigger to effect) without hand-waving any step
- Note things that are surprising, non-obvious, or that a newcomer would get wrong

Each explorer returns structured findings: components found, flow traced, files read, anything non-obvious. Overlap between explorers is fine; this session reconciles.

Then proceed to Step 3.

### Step 2b. Direct Explain (simple questions)

Explore and explain in this session. Do not spawn a subagent to restate files you can read. Use Glob, Grep, and Read here. Follow `references/explainer-prompt.md` for communication style and output format.

Proceed to Step 4.

### Step 3. Synthesize (complex questions only)

Once explorers return, synthesize their findings in this session into one coherent explanation. Do not spawn a second-layer explainer; that loop only paraphrases. Read `references/explainer-prompt.md` for the output format. Reconcile overlapping findings, resolve contradictions, and weave the slices into a unified picture. If an explorer report is too large to keep, keep the traced path and file list, not the raw dumps.

### Step 4. Present

Present the explanation. You may lightly edit for clarity or add context from the conversation, but don't substantially rewrite.

### Output Format

Follow this structure, adapted to the question. Not every section is needed for every question.

**Overview.** 1-2 paragraphs. What it is, what it does, why it exists. Enough to decide whether to keep reading.

**Key Concepts.** The important types, services, or abstractions. Brief definition of each. Not exhaustive, just the ones needed to understand the rest.

**How It Works.** The core of the explanation. Walk through the flow: what triggers it, what happens step by step, where data goes, the decision points. Prose, not pseudocode. Reference specific files and functions so the reader can go look, but don't dump code blocks unless a snippet is genuinely necessary.

**Where Things Live.** A brief map of the relevant files/directories. Not every file, just the ones needed to start working in this area.

**Gotchas.** Non-obvious or surprising things that would trip someone up. Historical context that explains why something looks weird. Known sharp edges.

## Critique Mode

Triggered when the user asks for architectural issues, problems, or improvements, not just understanding.

### Step 1. Explain First

Run the full explain flow above (Steps 1-4). You must understand the architecture before critiquing it.

### Step 2. Spawn Critics

After the explanation is complete, spawn the configured architectural critics in one message. On OpenCode, use `worker` for a normal critique and `expert` only where the risk warrants it.

For each critic:
- `subagent_type`: `worker` or `expert` on OpenCode, chosen by risk. Use the configured critic model on hosts that support per-Task model selection.
- `readonly`: `true`

Read `references/critic-prompt.md` for the prompt template. Each critic gets:
1. The explanation from Step 1 (so they don't re-explore)
2. The relevant file paths (so they can read the actual code)
3. The architectural critique rubric from `references/critique-rubric.md`

### Step 3. Lead Judgment

Same framework as the interrogate skill. You're a pragmatic lead, not an aggregator.

Categorize findings:
- **Act on.** Architectural problems worth fixing now
- **Consider.** Real concerns, but the cost/benefit is unclear
- **Noted.** Valid observations, low priority
- **Dismissed.** Wrong, missing context, or style preference

Present the explanation first (from Step 1), then the critique verdict below it. The explanation should stand on its own; someone who just wants to understand the system shouldn't wade through critique.
