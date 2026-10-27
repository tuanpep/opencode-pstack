---
name: check-agent-compatibility
description: >-
  Run the full repository compatibility pass: scanner score, startup path,
  validation loop, and docs reliability. Use when the user runs /compat,
  asks how agent-friendly a repo is, or wants the highest-leverage AGENTS.md
  and bootstrap fixes.
---

# Check agent compatibility

Score whether an agent can work this repo: cold start, small-change verify, docs vs reality.

## Trigger

`/compat`, "is this repo agent-friendly", "why does the agent guess the start command", or after editing `AGENTS.md`.

## Workflow

1. Resolve the target directory (worktree root, or `$ARGUMENTS` path).
2. Spawn `@compat-scan` alone first. Capture its score text / JSON.
3. Spawn these three in parallel, each with the target path and the scan result. Tell them not to edit files and not to re-run the scanner.
   - `@compat-startup` — cold start
   - `@compat-verify` — small-change verify loop
   - `@compat-docs` — docs vs the path you actually used
4. Workflow score = rounded average of Startup, Validation, and Docs.
5. `Agent Compatibility Score = round((deterministic * 0.7) + (workflow * 0.3))`.
6. If the scanner could not run because of the tool environment, say that separately—do not treat it as a repo defect or penalize the score.

Prefer specific non-round workflow scores. Good-with-friction stays high; do not default to mid-60s for noisy logs.

## Output

Markdown, minimal, no fenced code blocks.

One score as `## Agent Compatibility Score: N/100`. No computation breakdown unless asked.

Then `Top fixes` with one `- ` issue per line. Highest-leverage OpenCode session fixes only (`AGENTS.md`, start command, focused test/lint, env/VPN). No separate summary unless asked.
