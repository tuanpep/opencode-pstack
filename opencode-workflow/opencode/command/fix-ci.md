---
description: Inspect failing CI or local checks and apply a focused fix.
agent: code
---

Load the `fix-ci` skill. If the user is waiting on a PR, also use `@ci-watcher` or `loop-on-ci` as needed. Fix the root cause and re-run the failing check. Do not commit, push, or open a PR unless explicitly asked.

Task:
$ARGUMENTS
