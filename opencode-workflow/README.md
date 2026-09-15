# OpenCode workflow

Host-level OpenCode config for this marketplace: three Tab primaries (`fox`, `hawk`, `wolf`), slash commands, `WORKFLOW.md`, `/compat`, and `/learn`.

Skills are portable. Agents, commands, and `opencode.json.template` are OpenCode-specific.

## What it installs

| Path | Role |
|------|------|
| `WORKFLOW.md` | Global session instructions (does not replace project `AGENTS.md`) |
| `opencode.json.template` | Merged into `opencode.json`. It configures the workflow defaults, tool-output limits, compaction, and leaf `task: deny` so research/worker/expert cannot nest. It does not select a provider, API key, or model |
| `opencode-model-routing.example.jsonc` | Copyable per-agent routing example with placeholders. It is documentation and is not installed |
| `opencode/agent/*.md` | Primaries `fox` / `hawk` / `wolf` plus `/compat` and `/learn` subagents |
| `opencode/command/*.md` | Slash commands (`/review`, `/deep`, `/compat`, `/learn`, …) |
| `skills/` | `check-agent-compatibility`, `continual-learning` |
| `models.conf.example` | A commented role-map placeholder copied to `~/.pstack/models.conf` only if that file is missing |

Pstack ships hidden tiered Task targets in [pstack](../pstack/): `research` for bounded evidence, `worker` for normal changes, and `expert` for high-risk reasoning. Those three are leaves and cannot spawn further agents. The plugin does not pin these to a vendor or model. Run `/setup-pstack` after install to map roles to models available to you. `poteto-mode` and `playbook` remain compatibility targets. `comments` and `ci-watcher` ship in pstack. Thermo subagents ship in [thermos](../thermos/).

## Configure models

Configure your OpenCode provider and default model using OpenCode's normal provider setup. Then use `opencode-model-routing.example.jsonc` to add model entries for the tiered OpenCode agents in `opencode.json`. Replace every placeholder with a slug OpenCode lists for you. Run `/setup-pstack` as well. It detects models available in the active session and writes a valid `~/.pstack/models.conf` routing map for routed skills. The bundled example is comments only, so it cannot select an unavailable model.

## After install

Restart OpenCode. Tab cycles `fox` → `hawk` → `wolf`.
