# OpenCode development workflow

This file is global session instructions. It does not replace project `AGENTS.md`.

## Agents (Tab)

Three primaries. Cycle them with Tab.

| Agent | Work |
|---|---|
| `code` | Light. Small implement/debug. Default. |
| `review` | Read-only review. No file edits. |
| `rigor` | Non-trivial work. Focused investigation, minimal changes, and direct verification. |

`build` and `plan` are disabled. `poteto-mode` and `poteto-agent` remain compatibility Task targets. Pstack routes new work through tiered targets.

## Daily loop

1. **Understand.** Read the relevant files. `/how` for runtime behavior. `/why` for design rationale. `@explore` for local search. `@scout` for upstream docs. `/compat` on a first visit to a repo, or after `AGENTS.md` edits.
2. **Implement.** Small and routine: stay on `code`. Non-trivial: Tab to `rigor` or run `/rigor`.
3. **Verify.** Start with the narrowest meaningful check; broaden when repository guidance or change scope requires it. Separate setup or environment failures from product failures, and report blocked or partial verification honestly.
4. **Review.** `/review` before merge. `/thermos` for a harsh audit.
5. **Ship.** `/ship` only when the user asked to commit or open a PR.
6. **Learn.** `/learn` after a session that taught a durable repo fact or preference. Writes `AGENTS.md` learned sections. Does not commit.

## Commands

- `/review` — read-only review of the current diff
- `/rigor` — non-trivial engineering with focused investigation and direct verification
- `/poteto-mode` — full playbooks for high-risk, cross-cutting, or explicitly process-heavy work
- `/ship` — review-and-ship (commit/PR only if asked)
- `/thermos` — parallel thermo-nuclear review
- `/verify` — prove a claim with baseline/treatment evidence
- `/fix-ci` — inspect and fix failing checks
- `/how` — subsystem walkthrough
- `/why` — design rationale from evidence
- `/compat` — agent-compatibility score (startup, verify loop, docs)
- `/learn` — mine recent OpenCode sessions into `AGENTS.md` learned facts

## Delegation

- `@explore` / `@scout` — cheap lookups (luna)
- `@ci-watcher` — PR checks
- `@comment-sicko` — comment deletion review
- `@poteto-agent` / `@poteto-mode` — hidden pstack Task targets
- `@poteto-research` — bounded read-only research, inventories, and CI-log triage
- `@poteto-worker` — normal implementation, refactoring, tests, and focused review
- `@poteto-expert` — trace-backed performance and high-risk, unusually difficult reasoning
- `@thermo-nuclear-review-subagent` and `@thermo-nuclear-code-quality-review-subagent` — after you have gathered the diff
- `@compatibility-scan-review` / `@startup-review` / `@validation-review` / `@docs-reliability-review` — `/compat` only
- `@agents-memory-updater` — hidden. `/learn` only

Do not spawn a subagent for a one-file lookup.

## Model routing

- The installer does not select a provider or model. Configure your available models with `/setup-pstack` after installation.
- Assign a low-cost model to bounded research and swarm roles.
- Assign the best price-performance coding model to normal implementation, tests, and focused review.
- Reserve the highest-reasoning model for trace-backed performance, difficult diagnosis, one-way-door design, and security, concurrency, or data-loss risk.

Rigor uses the parent model as its lead. It must select the least expensive sufficient delegate: `@poteto-research` for read-only evidence, `@poteto-worker` for normal edits, and `@poteto-expert` only when a high-value risk or trace warrants the strongest configured model. Do not use the compatibility wrappers when a tiered target fits.

## Guardrails

- Do not commit, push, or open a PR unless the user asked.
- Do not deploy, run a production migration, delete persistent or external data, send customer-facing messages, or perform another irreversible external write unless the user explicitly asked for that action.
- Do not force-push to a shared branch.
- Keep the diff scoped. No drive-by refactors.
- Prefer deleting and simplifying over adding layers.
