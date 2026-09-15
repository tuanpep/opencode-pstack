---
name: continual-learning
description: >-
  Mine OpenCode session transcripts and update AGENTS.md with high-signal
  Learned User Preferences and Learned Workspace Facts only. Use when the
  user runs /learn, asks to mine chats into AGENTS.md, or wants durable
  repo facts captured from recent sessions.
disable-model-invocation: true
---

# Continual learning

Keep project `AGENTS.md` current from OpenCode transcripts. Orchestration only. Delegate mining and edits to `@learn`.

## Trigger

`/learn`, "update AGENTS.md from chats", "what did we learn about this repo".

## Workflow

1. Resolve the target `AGENTS.md`. Default is `AGENTS.md` in the current worktree root. If none exists, the updater creates one with only the two learned sections. Do not overwrite an existing repo guide.
2. Spawn `@learn` with:
   - worktree root
   - `AGENTS.md` path
   - this conversation's opening user prompt, so it can match the current session
   - any extra scope from `$ARGUMENTS` (a path, "global", or a topic)
3. Return the updater result unchanged aside from dropping transcript paths and secrets.

## Guardrails

- Do not mine transcripts or edit files in the parent flow.
- Do not bypass the subagent.
- Do not commit unless the user asked.
- Never copy Cursor hook state or `~/.cursor/.../agent-transcripts/`.
