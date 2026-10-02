---
description: Read-only review of the current worktree or supplied scope. Findings only.
agent: review
---

Review the current repository changes. If a scope is supplied, focus on it. Do not modify files.

Gather `git status --short`, `git diff`, and `git diff --cached` using the read-only agent's allowed commands. Read any relevant untracked files directly; they do not appear in git diff. Inspect callers and targeted verification evidence. Return findings only, ordered by severity, then testing gaps.

Scope:
$ARGUMENTS
