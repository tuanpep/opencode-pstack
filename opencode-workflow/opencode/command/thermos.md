---
description: Parallel thermo-nuclear review of the current branch or supplied scope.
agent: review
---

Load the `thermos` skill. Gather the diff and changed-file contents first, then spawn both thermo-nuclear review subagents in parallel and synthesize findings. Do not modify files.

Branch and status:

!`git status -sb`

Unstaged and staged diff:

!`git diff HEAD`

Scope:
$ARGUMENTS
