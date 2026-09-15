---
description: Read-only review of the current worktree or supplied scope. Findings only.
agent: review
---

Review the current repository changes. If a scope is supplied, focus on it. Do not modify files.

Branch and status:

!`git status -sb`

Recent commits:

!`git log --oneline -12`

Unstaged and staged diff:

!`git diff HEAD`

Inspect the diff, relevant callers, and targeted verification evidence. Return findings only, ordered by severity, then testing gaps.

Scope:
$ARGUMENTS
