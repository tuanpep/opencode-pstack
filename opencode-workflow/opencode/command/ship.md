---
description: Review-and-ship the current branch. Commit, push, or open a PR only if the user asked.
agent: code
---

Load the `review-and-ship` skill and follow it for the current branch.

Branch and status:

!`git status -sb`

Recent commits:

!`git log --oneline -12`

Unstaged and staged diff:

!`git diff HEAD`

Keep unrelated changes untouched. Run targeted verification. Only commit, push, or open/update a pull request when the user explicitly requested those actions below.

Task:
$ARGUMENTS
