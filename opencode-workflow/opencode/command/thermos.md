---
description: Parallel thermo-nuclear review of the current branch or supplied scope.
agent: review
---

Load the `thermos` skill. Gather `git status --short`, `git diff`, and `git diff --cached` using the read-only agent's allowed commands. Read relevant untracked files directly; they do not appear in git diff. Gather changed-file contents before spawning both thermo-nuclear review subagents in parallel. Synthesize findings. Do not modify files.

Scope:
$ARGUMENTS
