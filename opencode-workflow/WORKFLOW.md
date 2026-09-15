# OpenCode development workflow

This file is global session instructions. It does not replace project `AGENTS.md`.

## Agents (Tab)

Three primaries. Cycle them with Tab: `code` → `deep` → `review`.

| Agent | Work |
|---|---|
| `code` | Everyday edits. Small implement/debug. Default. |
| `deep` | Non-trivial work. Focused investigation, minimal changes, and direct verification. |
| `review` | Read-only review. No file edits. |

`build` and `plan` are disabled. `poteto-mode` and `playbook` remain compatibility Task targets. Pstack routes new work through tiered targets.

## Choose a primary

- Known shape, local change → stay on `code`.
- Unknown root cause, multi-file behavior, or "are we sure" → Tab to `deep` or run `/deep`.
- Findings only, no edits → Tab to `review` or run `/review`.
- High-risk, cross-cutting, or explicit playbook process → `/poteto-mode`.

Do not start with `/how` then `/architect` then `/arena` unless the shape is unknown or expensive to reverse.

## Daily loop

1. **Understand.** Read the relevant files in this session. `/how` for an unfamiliar multi-module subsystem. `/why` for design rationale. `@explore` for local search. `@scout` for upstream docs. `/compat` on a first visit to a repo, or after `AGENTS.md` edits.
2. **Implement.** Small and routine: stay on `code`. Non-trivial: Tab to `deep` or run `/deep`. Process-heavy: `/poteto-mode`.
3. **Verify.** Start with the narrowest meaningful check; broaden when repository guidance or change scope requires it. Separate setup or environment failures from product failures, and report blocked or partial verification honestly.
4. **Review.** `/review` before merge. `/thermos` for a harsh audit.
5. **Ship.** `/ship` only when the user asked to commit or open a PR.
6. **Learn.** `/learn` after a session that taught a durable repo fact or preference. Writes `AGENTS.md` learned sections. Does not commit.

## Commands

- `/setup-pstack` — detect available models and write `~/.pstack/models.conf`
- `/review` — read-only review of the current diff (runs `review`)
- `/deep` — non-trivial engineering with focused investigation and direct verification (runs `deep`; `/rigor` still works)
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

Primaries (`code`, `deep`, `review`) and the `poteto-mode` / `playbook` compatibility wrappers may spawn. `@research`, `@worker`, and `@expert` are leaves and must not spawn.

Keep the tree wide and shallow: one hop from this session. Sequence analyze, implement, and verify here. Do not bury a pipeline under nested children. A child earns its place only if it returns much less than it consumed (bulk reads, isolated parallel work, or a different model). A pass-through router, an explainer that only restates explorers, or a nested research → expert → worker chain is waste; delete it.

- `@explore` / `@scout` — cheap lookups (luna)
- `@ci-watcher` — PR checks
- `@comments` — comment deletion review
- `@playbook` / `@poteto-mode` — hidden pstack Task targets
- `@research` — bounded read-only research, inventories, and CI-log triage
- `@worker` — normal implementation, refactoring, tests, and focused review
- `@expert` — trace-backed performance and high-risk, unusually difficult reasoning
- `@thermos-review` and `@thermos-quality` — after you have gathered the diff
- `@compat-scan` / `@compat-startup` / `@compat-verify` / `@compat-docs` — `/compat` only
- `@learn` — hidden. `/learn` only

Do not spawn a subagent for a one-file lookup. Cap parallel research at two explorers and synthesize in this session.

## Design

Sketch in the lead session and implement. Most changes need no `how` / `architect` / `arena` fan-out. Run that ceremony only for a one-way-door whose shape is still unknown and has two or more structurally distinct designs. If surrounding code already shows the pattern, write a short type or signature sketch and start coding.

## Model routing

- This plugin does not select a provider or model. Configure your available models with `/setup-pstack` after installation.
- Assign a low-cost model to bounded research and swarm roles.
- Assign the best price-performance coding model to normal implementation, tests, and focused review.
- Reserve the highest-reasoning model for trace-backed performance, difficult diagnosis, one-way-door design, and security, concurrency, or data-loss risk.

Deep uses the parent model as its lead and works directly by default. When it delegates, it must pick one leaf: `@research` for read-only evidence, `@worker` for normal edits, and `@expert` only when a high-value risk or trace warrants the strongest configured model. Do not use the compatibility wrappers when a tiered target fits.

## Guardrails

- Do not commit, push, or open a PR unless the user asked.
- Do not deploy, run a production migration, delete persistent or external data, send customer-facing messages, or perform another irreversible external write unless the user explicitly asked for that action.
- Do not force-push to a shared branch.
- Keep the diff scoped. No drive-by refactors.
- Prefer deleting and simplifying over adding layers.
