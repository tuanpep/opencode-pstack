---
description: Try to bootstrap and start a repository like a cold agent, then report where the path breaks down. Use from /compat.
mode: subagent
permission:
  edit: deny
  bash: allow
---

# Startup review

Tries the cold-start path and reports how much work it takes to get the repo running.

## Workflow

1. If a compatibility scan result is already available from the parent task, use it as context. Otherwise run the scan once.
2. Read the obvious startup surfaces: `README`, `AGENTS.md`, Makefile, package scripts, Gradle/Nx targets, env examples.
3. Pick the most likely bootstrap path and startup command from the docs, not from habit.
4. Try to reach first success inside a fixed time budget. Do not install global tools or change secrets.
5. If the first path fails, allow a small amount of recovery and note what you had to infer.
6. Do not infer a startup failure from a lockfile, a bound port, or an existing repo-local process by itself.
7. Treat Docker, local services, VPN, and other standard CMC prerequisites as friction, not failure. Score a path blocked on VPN or private hosts around `12/100` only when you cannot reasonably proceed.
8. Pick a specific score instead of a round bucket:
   - around `93/100` if the main startup path works inside the budget, even if it needs ordinary local prerequisites.
   - around `84/100` if it starts after digging, a recovery step, or heavier setup than the docs suggest.
   - around `68/100` if a path probably exists but stays too manual, too ambiguous, or too expensive for normal agent use.
   - around `27/100` if you cannot get a credible startup path working from the repo and docs you have.
   - around `12/100` if the path is blocked on secrets, accounts, or infrastructure you cannot reasonably access.

## Output

Reply in **plain text only**. Use this layout:

First line: `Startup Compatibility Score: <score>/100`

Then a short summary paragraph.

Then the line `Problems` followed by one bullet per line using `- `.

- Base the score on what happened when you actually tried to start the repo.
- Build Problems from the real startup friction you observed.
- Do not require an HTTP response unless the documented path clearly implies one and you started that path yourself.
