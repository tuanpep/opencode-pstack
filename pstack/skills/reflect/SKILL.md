---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
disable-model-invocation: true
---

# Reflect

Mine the current conversation for durable learnings, then route them into skill edits.

## When to invoke

- The user said "reflect" or "/reflect".
- A complex task (5+ tool calls) just landed cleanly and the recipe is worth keeping.
- The agent hit dead ends, found the working path, and the path generalizes.
- The user corrected the agent's approach mid-task.
- A non-trivial workflow emerged that isn't captured anywhere.

Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## Process

### 1. Locate the active transcript

OpenCode stores transcripts in its session database rather than plain files. Enumerate sessions for the current project with `opencode session list --format json`, match the candidate whose first message is this conversation's opening prompt, then read it with `opencode export <sessionID>`. Do not read sessions from unrelated projects.

If either command is unavailable, write a tight digest of the session and pass that instead. Ask the user for what happened rather than inventing a transcript location.

### 2. Spawn three reviewers in parallel

One message, three Task calls. On OpenCode, use `research` for the tooling pass and `worker` for judgment and divergent passes. On hosts that support per-Task model selection, use the configured role models. Use agent mode when MCP access is required. The prompt forbids file writes; the parent applies edits.

| Lens | `model` | Prompt template |
|---|---|---|
| Judgment | configured judgment model, or the parent model | `references/judgment-reviewer.md` |
| Tooling | configured tooling model, or the parent model | `references/tooling-reviewer.md` |
| Divergent | configured judgment model, or the parent model | `references/divergent-reviewer.md` |

Pass each template verbatim, substituting the transcript path or digest where marked. Reviewers return findings in the `Task` response body.

### 3. Synthesize

One Task call using `worker` on OpenCode, or the configured judgment model on a host that supports per-Task model selection. Use agent mode when citation spot checks need MCP access. Use `references/synthesizer.md` verbatim, with each reviewer's full output inlined where marked. The synthesizer returns a structured Accepted / Rejected / Backlog list.

### 4. Structural enforcement check

Sanity-check the synthesizer's Accepted list. For any item that would be enforced more reliably by a lint rule, script, metadata flag, or runtime check, move it from Accepted to Backlog. The synthesizer already applies this criterion; this is a final pass before edits land. See the **encode-lessons-in-structure** principle skill.

### 5. Apply

Before applying any Accepted edit, present the synthesizer's full Accepted/Rejected/Backlog output to the user and wait for explicit approval. The user picks which subset to apply and may redirect routings. Skill changes affect every future agent in the org; do not auto-apply.

Backlog items file to whatever devex / backlog tracker your team uses automatically. Those are tracker submissions, not skill edits. Only the Accepted list waits for approval.

For each approved Accepted item, follow the Routing field exactly:

- Trivial existing-skill edit (a one-line bullet, a tightened sentence, a stale fact corrected): parent does directly.
- Substantive existing-skill edit (a new section, a new pattern table, more than ~10 lines): parent drafts the edit directly, applies the SKILL.md structure and writing rules below, then reads the result back once to check it against them before declaring done.
- `tune description: <skill path>` (the skill exists but didn't trigger when it should have): rewrite only the `description` field so it states, specifically, the situations and phrasings that should trigger the skill — vague descriptions ("helps with X") under-trigger; overly narrow ones miss valid invocations. Keep it a single YAML scalar (see formatting rule below).
- `new skill via create-skill: <kebab-name>`: create the skill directly at the appropriate path (see "Where to save it" below), following the same structure and writing rules. Do not invent an ad hoc shape — use the structure below every time.

**SKILL.md structure and writing rules** (apply for any create or substantive edit):

- Frontmatter: YAML between `---` markers with two required fields — `name` (lowercase, hyphenated, must match the skill's directory name) and `description` (the single most important field, since it drives auto-invocation: make it specific enough that an agent can tell exactly when to invoke the skill versus when not to, naming concrete triggers rather than a vague summary of what the skill does).
- Frontmatter formatting: keep `description` as one YAML scalar. If it contains a colon, quotes, or other punctuation that breaks plain YAML, or needs to wrap across lines, quote it or use `description: >-` with indented continuation lines — never let it spill into invalid multi-line YAML.
- Body: clear step-by-step instructions written as agent-facing prose — imperative, precise, no filler. Agent-facing prose has a higher bar than human prose, because an unhelpful sentence becomes an instruction some future agent follows. Cut hedging, cut restatement, cut anything that doesn't change what the reader does next.
- Where to save it: use `.opencode/skills/<name>/SKILL.md` for project-specific learning and `~/.config/opencode/skills/<name>/SKILL.md` for general workflow learning.

If your environment ships a SKILL.md validator, run it on every touched skill before declaring done. Skip this step if it doesn't.

### 6. Summarize for the user

Short list, no preamble:

- Edits applied: `<skill path>`. What changed, one line each.
- New skills created: `<skill path>`. One line each (rare).
- Backlog filed to the devex tracker: `<issue title>` (`<tags>`). One line each.
- Dropped: one line per rejected finding + reason from the synthesizer.
