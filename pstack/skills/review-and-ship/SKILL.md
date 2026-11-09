---
name: review-and-ship
description: "Use for /ship or an explicit request to review and ship changes. Review, fix, and verify the branch; commit, push, or open or update a PR only when the user authorizes that action. Use the review agent for read-only review."
---

# Review and ship

## Trigger

Use when the user requests shipping preparation or invokes `/ship`. Close key issues and verify behavior. A request to review alone does not authorize edits or shipping. Perform commit, push, and PR actions only when explicitly requested.

## Workflow

1. Gather context: diff against base branch, uncommitted changes, recent commits, changed files, and user intent from recent relevant chats if useful.
2. Run targeted tests for changed behavior. If no focused tests exist, decide whether to add them or document the gap.
3. Review for correctness, regressions, security, and intent fit in this session. Delegate only when a slice would flood this context.
4. Fix critical issues before finalizing and re-run affected tests.
5. If the user explicitly asked for a commit, commit only the intended files with a concise message.
6. If the user explicitly asked to push or open or update a PR, perform only those requested actions.

## Suggested Checks

```bash
git fetch origin main
git diff origin/main...HEAD
git status
gh pr checks --json name,bucket,state,workflow,link
```

## Guardrails

- Prioritize correctness, security, and regressions over style-only comments.
- Keep commits focused and avoid unrelated file changes.
- If pre-commit checks fail, fix the issues rather than bypassing hooks.
- Use `gh pr checks` instead of GitHub Actions-only commands when judging PR readiness.

## Output

- Findings summary (critical, warning, note)
- Tests run and outcomes
- Commit or PR result, including the PR URL when a PR was opened or updated
