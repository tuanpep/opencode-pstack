# OpenCode development workflow

When the package plugin is active, its V2 context hook adds this text to agent-loop model requests. Copying this file alone does not activate it. It does not replace global or project `AGENTS.md`.
This workflow applies only to `code`, `deep`, and `review`. The context hook skips `pure`, built-in agents, and subagents; their own prompts govern those modes.

## Agents (Tab)

Four primaries are available: `code`, `pure`, `deep`, and `review`. Select one in OpenCode.

| Agent | Work |
|---|---|
| `code` | Everyday edits. Small implement/debug. Set as default explicitly if desired. |
| `pure` | General-purpose work without custom skills or bundled workflow routing. |
| `deep` | Non-trivial work. Delegates when useful, then verifies. |
| `review` | Read-only review. No file edits. |

The plugin does not disable built-in `build` or `plan`, or replace your configured default agent. `poteto-mode` and `playbook` remain compatibility subagents. Pstack routes new work through tiered targets.

## Choose a primary

- Known shape, local change → stay on `code`.
- No custom skills or bundled workflow routing → select `pure`.
- Unknown root cause, multi-file behavior, or "are we sure" → Tab to `deep` or run `/deep`.
- Findings only, no edits → Tab to `review` or run `/review`.
- High-risk, cross-cutting, or explicit playbook process → `/poteto-mode`.

Do not start with `/how` then `/architect` then `/arena` unless the shape is unknown or expensive to reverse.

## Daily loop

1. **Understand.** Read relevant files and project `AGENTS.md`. If the project uses Beads, follow `/beads` for task context and handoff (read-only agents receive context from the lead); otherwise read `docs/agent-progress.md` when it exists. Do not initialize tracking automatically. Use `/how` for unfamiliar systems, `/why` for rationale, `/compat` for onboarding friction.
2. **Implement.** When the owning module is not already obvious, follow **principle-extend-the-existing-home**. A familiar one-file change skips that search. Use the smallest viable agent and diff inside that home. Plan first when the approach is uncertain or the run is long and unattended; skip ceremony for familiar changes. A multi-file change does not automatically need a subagent or playbook.
3. **Verify.** Run the narrowest check that can falsify the result; broaden for risk. Include a denied path for authorization changes and a baseline for performance claims. Give shell commands finite timeouts; distinguish environment failures from product failures.
4. **Review.** Check the diff before merge; use `/review` for a second opinion, `/thermos` for large or high-risk diffs. Report actionable findings.
5. **Ship.** `/ship` only when asked to commit or open a PR.
6. **Learn.** `/learn` only for durable, verified facts or preferences. Review `AGENTS.md` edits for duplicates and staleness; keep it a map, not a transcript. For cross-session handoff, record what is done, the command that proved it, and what is next in the Beads issue when enabled, otherwise in `docs/agent-progress.md`.

## Place the change

When the owning module is not already obvious, follow **principle-extend-the-existing-home**. Pick the sibling that matches the task. Extend that module. A UI file does not import the database. An API route may.

A new project, a new package, or a new top-level module has no home yet. Stop. Run `/architect` and write no module files until that skill has written its Practice section.

Pass the chosen paths to any worker. A worker whose brief points at a caller stops and reports the mismatch.

## Delegation

Keep delegation one hop deep. Inspect enough context to know the goal and verification. Use `@research` for broad read-only evidence, `@worker` for separable implementation, and `@expert` for high-risk or trace-backed reasoning. Stay in the lead session when a handoff would repeat work. Parallelize independent, disjoint write paths only; caps of two research and three workers are ceilings, not quotas. Synthesize and verify in the lead session.

## Design

Sketch in the lead session and implement. Most changes need no `how` / `architect` / `arena` fan-out. Run that ceremony only for a one-way-door whose shape is still unknown and has two or more structurally distinct designs. The no-home case in Place the change is the `/architect` gate. If surrounding code already shows the pattern, write a short type or signature sketch and start coding.

## Model routing

- This plugin does not select a provider or model. Configure your available models with `/setup-pstack` after installation.
- Assign a low-cost model to bounded research and swarm roles.
- Assign the best price-performance coding model to normal implementation, tests, and focused review.
- Reserve the highest-reasoning model for trace-backed performance, difficult diagnosis, one-way-door design, and security, concurrency, or data-loss risk.

Compare routing and review on representative tasks: accepted outcome, elapsed time, model cost, rework, and verification failures. Prefer a cheaper path only when quality holds; a subagent or cheaper model does not automatically reduce total cost.

## Guardrails

- Do not commit, push, or open a PR unless the user asked.
- Do not deploy, run a production migration, delete persistent or external data, send customer-facing messages, or perform another irreversible external write unless the user explicitly asked for that action.
- Do not force-push to a shared branch.
- Tool approval is not authorization: require the user's explicit request for irreversible external writes even if a tool permits them.
- When a task is finished or context becomes noisy, start a fresh session; carry forward a short outcome and verification summary rather than a full transcript.
- Keep the diff scoped. No drive-by refactors.
- Prefer deleting pass-throughs and unused code. Keep a layer that already owns the behavior.
- After a timeout or hang, inspect the evidence, continue remaining ready work, and report the unverified command. One identical retry only for a concrete transient hypothesis. Do not raise the same command's timeout and wait.
