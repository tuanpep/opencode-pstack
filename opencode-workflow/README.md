# OpenCode workflow

OpenCode workflow agents (`code`, `deep`, `review`), slash commands, `WORKFLOW.md`, `/compat`, and `/learn`.

Skills are portable. Agents, commands, and `opencode.json.template` are OpenCode-specific.

## What it installs

| Path | Role |
|------|------|
| `WORKFLOW.md` | Copied if missing. The package plugin injects its bundled text into agent-loop model requests using a V2 context hook; the copied file alone is not loaded as instructions. `AGENTS.md` remains untouched |
| `opencode.json.template` | Used by the manual `installPlugins` API, not merged by the package plugin. It supplies `default_agent` when absent and V2 `agents` leaf `subagent: deny` rules. Existing user settings take precedence except these leaf restrictions. No blanket allow, provider, API key, or model |
| `opencode-model-routing.example.jsonc` | Copyable V2 subagent routing example with placeholders. It is documentation and is not installed |
| `opencode/agent/*.md` | Primaries `code` / `deep` / `review` plus `/compat` and `/learn` subagents |
| `opencode/command/*.md` | Slash commands (`/review`, `/deep`, `/compat`, `/learn`, …) |
| `skills/` | `check-agent-compatibility`, `continual-learning` |
| `models.conf.example` | A commented role-map placeholder copied to `~/.pstack/models.conf` only if that file is missing |

Pstack ships Task targets in [pstack](../pstack/): `research` for bounded evidence, `worker` for normal changes, and `expert` for high-risk reasoning. Those three are leaves and cannot spawn further agents. `@mention` them, or let `deep` Task them. The plugin does not pin these to a vendor or model. Run `/setup-pstack` after install to configure installed subagents. `poteto-mode` and `playbook` remain hidden compatibility targets. `comments` and `ci-watcher` ship in pstack. Thermo subagents ship in [thermos](../thermos/).

## Configure models

Configure your provider and session model through OpenCode's normal setup. Run `/setup-pstack` to validate slugs, write `~/.pstack/models.conf`, and update `agents.<id>.model` for installed V2 subagents while preserving unrelated config. It removes an agent's model property when you choose inherit-parent/auto, reloads config, and checks `opencode api get /api/agent` (the agents are in its `data` array). `opencode-model-routing.example.jsonc` shows the V2 shape, but its placeholders are not installed. The role map can select models per Task only on hosts that support per-Task model selection: on OpenCode V2, panel calls using the same wrapper share one configured model, so panel diversity is not guaranteed. This setup does not pin Tab primaries or change a session's selected model.

## After install

Restart OpenCode and select `code`, `deep`, or `review`. Set `default_agent` yourself if you want a different startup selection. The plugin does not change config or overwrite global `AGENTS.md`. OpenCode V2 accepts `instructions` in config but does not load those files.
