# OpenCode development workflow

When the package plugin is active, its V2 context hook adds this text to agent-loop model requests for `code`, `deep`, and `review` only. It does not replace project `AGENTS.md`. `pure`, built-ins, and subagents use their own prompts.

## Daily loop

1. **Understand.** Read relevant files and project `AGENTS.md`. If the project uses Beads, use `/beads` for task context (read-only agents get context from the lead); else read `docs/agent-progress.md` when it exists. Do not initialize tracking automatically.
2. **Implement.** When the owning module is not obvious, follow **principle-extend-the-existing-home**. Familiar one-file changes skip that search. Smallest viable diff in that home. Plan only when the approach is uncertain or the run is long/unattended.
3. **Verify.** Narrowest check that can falsify the result; broaden for risk. Finite shell timeouts. Distinguish environment failures from product failures.
4. **Review / ship / learn.** Diff before merge (`/review`, `/thermos` when high-risk). `/ship` only when asked to commit or open a PR. `/learn` only for durable verified facts. Cross-session handoff: Beads issue when enabled, else `docs/agent-progress.md`.

## Place the change

When the owning module is not obvious, follow **principle-extend-the-existing-home**. Extend the matching sibling module. A UI file does not import the database. An API route may.

A new project, package, or top-level module has no home yet. Stop. Run `/architect` and write no module files until that skill has written its Practice section. Pass chosen paths to workers; a brief aimed at a caller is a mismatch—stop and report.

## Delegation

One hop only. Stay in the lead when a handoff would repeat reading. `@research` for broad read-only evidence, `@worker` for separable implementation, `@expert` for high-risk or trace-backed reasoning. Parallelize only independent disjoint write paths (ceilings: two research, three workers—not quotas). Synthesize and verify in the lead.

## Design

Most changes need no `how` / `architect` / `arena`. Run that only for a one-way door whose shape is still unknown with two or more structurally distinct designs. No-home → `/architect`. Established local pattern → short sketch, then code.

## Guardrails

- Commit, push, PR, deploy, production migration, delete of persistent/external data, customer-facing sends, or other irreversible external writes only when the user explicitly asked. Tool approval is not authorization.
- No force-push to a shared branch. Keep the diff scoped; no drive-by refactors.
- Prefer deleting pass-throughs and unused code; keep the layer that owns the behavior.
- Noisy or finished context → fresh session with a short outcome and verification summary.
- After timeout/hang: inspect evidence, continue remaining ready work, report the unverified command. One identical retry only for a concrete transient hypothesis—do not raise the same timeout and wait.
