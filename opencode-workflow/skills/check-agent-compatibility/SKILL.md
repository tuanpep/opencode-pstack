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

1. Resolve the target directory. Default is the current worktree root. If `$ARGUMENTS` names a path, use that.
2. Spawn these four subagents in parallel. One subagent per task. Do not collapse them into one prompt.
   - `@compat-scan` — published CLI score
   - `@compat-startup` — cold start
   - `@compat-verify` — small-change verify loop
   - `@compat-docs` — docs vs the path you actually used
3. Pass each the target path and, if you already have it, the scan JSON. Tell them not to edit files.
4. Compute an internal workflow score as the rounded average of Startup, Validation, and Docs scores.
5. Compute `Agent Compatibility Score = round((deterministic * 0.7) + (workflow * 0.3))`.
6. If the deterministic scanner could not run because of the tool environment, say that separately. Do not treat it as a repo defect or penalize the repo.

When scoring internally, use specific non-round workflow scores. If startup, validation, or docs mostly work, treat them as good-with-friction rather than defaulting to the mid-60s. Do not create a low workflow score just because logs are noisy.

## Output

Respond in markdown, but keep it minimal. Do not use fenced code blocks.

Show only one score, as a level-two heading: `## Agent Compatibility Score: N/100`. Do not show how it was computed unless the user asks for a breakdown.

Then a flat, prioritized list labeled `Top fixes` with one issue per line, each line starting with `- `.

Focus on the fixes that would most improve real OpenCode sessions in this repo (`AGENTS.md`, start command, focused test/lint, env/VPN gotchas). Do not include a separate summary unless the user asks.

Example shape:

## Agent Compatibility Score: 72/100

Top fixes
- First issue
- Second issue
- Third issue
