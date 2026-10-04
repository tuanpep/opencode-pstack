---
name: cli-for-agents
description: "Use when building or reviewing a command-line interface for agents or automation: non-interactive flags, useful help, actionable errors, safe retries, and dry-run support."
---

# Build CLIs that agents can use

When you build or review a CLI, check that a script can finish the same task without answering a prompt. Keep interactive prompts for humans, but provide flags for every required input.

## Make commands discoverable

- Let `tool --help` list commands and `tool <command> --help` explain one command.
- Put working examples in each command's help, including required flags. Keep output short enough to scan.
- Use consistent command names and flag meanings across related commands.

## Make commands work without a terminal

- Accept inputs through flags or stdin where appropriate. If required input is missing in a non-interactive session, fail instead of waiting for a prompt.
- Emit an actionable error with the missing flag and a valid example invocation. Exit with a nonzero status.
- Return useful success output such as an ID, a path, or a URL. Do not make callers parse decorative text to get a result.

## Make retries safe

- Define what happens when a command runs twice or stops halfway through. Prefer the same end state over duplicate work.
- For destructive operations, offer a preview such as `--dry-run`. Keep confirmation as the default; allow an explicit flag such as `--yes` for unattended runs.
- Verify both the normal path and a missing-input or failed path with real commands. For state-changing commands, also verify the dry run and a second invocation when safe to do so.

When reviewing an existing CLI, report the first step that blocks an unattended run and show the command and output. Do not claim that a flag works from help text alone.
