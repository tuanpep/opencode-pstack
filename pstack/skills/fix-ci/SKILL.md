---
name: fix-ci
description: Diagnose currently failing PR checks and apply focused fixes. Use loop-on-ci instead when the user explicitly asks to monitor and iterate until checks are green.
---

# Fix CI

## Trigger

Branch or PR CI is failing and needs a fast, iterative path to green checks.

## Workflow

1. Resolve the active PR and inspect `gh pr checks --json name,bucket,state,workflow,link`.
2. Inspect failed jobs and extract the first actionable error. Use GitHub Actions logs when available; otherwise use the check link to identify the failing command or service.
3. Apply the smallest safe fix.
4. Re-run the available local check and report the fix. If the user explicitly authorized pushing, push and re-check the PR check set. Use loop-on-ci if the user also requested ongoing monitoring and iteration.

## Guardrails

- Fix one actionable failure at a time.
- Prefer minimal, low-risk changes before broader refactors.
- Keep `gh pr checks` as the source of truth for overall PR CI state.

## Output

- Primary failing job and root error
- Fixes applied in iteration order
- Current CI status and next action
