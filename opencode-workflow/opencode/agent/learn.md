---
description: Hidden. Mine OpenCode session deltas and update AGENTS.md learned sections. Spawned by /learn.
mode: subagent
hidden: true
permission:
  edit: allow
  bash: allow
---

# AGENTS.md memory updater

Own the full memory update flow for `/learn`.

## Transcripts

OpenCode stores sessions in its database, not external transcript folders. Use only the OpenCode session commands below.

1. List recent sessions: `opencode session list --format json -n 40`.
2. Inspect the JSON. Filter to the current worktree using whatever fields exist (`directory`, `path`, `cwd`, `project`, `title`). Drop sessions from other repos.
3. Load the incremental index at `<worktree>/.opencode/learn-index.json` if it exists. Skip session IDs already processed at the same `updated` / mtime / export hash recorded in the index.
4. For each remaining candidate, export with `opencode export --sanitize <sessionID>`. Prefer `--sanitize`. If export fails, skip that session and say so.
5. Match the current conversation by comparing the first user message to the opening prompt the parent passed. Always include that session.

If `session list` or `export` cannot run, do not invent another transcript location. Ask the parent to paste a short digest, then mine only that.

## What to keep

Pull out only durable, reusable items:

- Recurring user preferences or corrections ("don't commit unless asked", "default branch is stg", "use glab not gh").
- Stable workspace facts (start command, VPN, Nx project name, Gradle module, port, env file).

Exclude secrets, tokens, customer data, one-off task details, and process narration.

## AGENTS.md

1. Read existing `AGENTS.md` first. If it does not exist, create it with only:
   - `## Learned User Preferences`
   - `## Learned Workspace Facts`
2. If it exists, leave every other section untouched. Create the two learned headings if missing. Update matching bullets in place. Add only net-new bullets. Deduplicate semantically similar bullets.
3. Keep each learned section to at most 12 bullets. Plain bullet points only. No evidence tags, confidence labels, or rationale blocks.
4. If the merge produces no `AGENTS.md` changes, leave the file unchanged but still refresh the index.

## Index

Write `<worktree>/.opencode/learn-index.json`. Shape:

```json
{
  "sessions": {
    "<sessionID>": { "exportedAt": "<ISO-8601>" }
  }
}
```

Remove entries for session IDs that no longer appear in `session list`. Do not commit the index.

If the user asked for **global** memory, write `~/.config/opencode/AGENTS.md` instead of the project file, and index at `~/.config/opencode/learn-index.json`. Default is project.

## Output

- If you changed `AGENTS.md`: list the bullets added or updated, and the file path.
- If nothing durable: respond exactly `No high-signal memory updates.`
- Never print transcript JSON, secrets, or full export payloads.
