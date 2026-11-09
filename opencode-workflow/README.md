# OpenCode workflow

OpenCode workflow agents (`code`, `pure`, `deep`, `review`), slash commands, `WORKFLOW.md`, `/compat`, and `/learn`.

Skills are portable. Agents, commands, and `opencode.json.template` are OpenCode-specific.

For primary documentation and the evidence behind the routing, context, permission, and evaluation choices, see [research sources](RESEARCH-SOURCES.md). This reference is for maintainers; it is not injected into agent sessions.

## What it installs

| Path | Role |
|------|------|
| `WORKFLOW.md` | Copied if missing. The package plugin injects its bundled text into `code`, `deep`, and `review` agent-loop requests using a V2 context hook; the copied file alone is not loaded as instructions. An older installed copy may remain; `AGENTS.md` is untouched |
| `opencode.json.template` | Used by the manual `installPlugins` API, not merged by the package plugin. It supplies `default_agent` and blanket `allow` permissions when absent, plus V2 `agents` leaf `subagent: deny` rules. Existing user settings take precedence except these leaf restrictions. No provider, API key, or model |
| `opencode-model-routing.example.jsonc` | Copyable V2 subagent routing example with placeholders. It is documentation and is not installed |
| `opencode/agent/*.md` | Primaries `code` / `pure` / `deep` / `review` plus `/compat` and `/learn` subagents. `pure` denies skills |
| `opencode/command/*.md` | Slash commands (`/review`, `/deep`, `/compat`, `/learn`, …) |
| `skills/` | `check-agent-compatibility`, `continual-learning` |
| `models.conf.example` | A commented role-map placeholder copied to `~/.pstack/models.conf` only if that file is missing |

Pstack ships Task targets in [pstack](../pstack/): `research` for bounded evidence, `worker` for normal changes, and `expert` for high-risk reasoning. Those three are leaves and cannot spawn further agents. `@mention` them, or let `deep` Task them. The plugin does not pin these to a vendor or model. Run `/setup-pstack` after install to configure installed subagents. `poteto-mode` and `playbook` remain hidden compatibility targets. `comments` and `ci-watcher` ship in pstack. Thermo subagents ship in [thermos](../thermos/).

Coding agents allow shell commands without prompting; read-only agents keep narrow inspection allowances. Shell access carries the host user's filesystem and network authority; this plugin does not supply a sandbox. Keep irreversible external writes subject to explicit user authorization. Prefer one agent for cohesive tasks; the worker cap is not a quota.

To measure routing changes, replay representative past tasks with `pure` (single agent) and the routed workflow. Track accepted outcomes, wall time, model cost, rework, and verification failures. No performance or cost gain is claimed without a comparison.

## Evaluate skill and routing changes

Before merging or removing a skill, compare the existing configuration with the proposed one on the same tasks. This is a manual replay recipe, not a claim that these evaluations have already run.

1. Choose a baseline revision and a treatment revision or patch. For an uncommitted change, save the patch separately and apply it only to the treatment environment. Record the revision, patch, OpenCode version, model, permissions, and enabled plugins for each run.
2. Create separate disposable copies of the same fixture for each run. Reset the fixture between runs. Keep model, permissions, dependencies, and user prompt the same; change only the skill or routing configuration under study. Compare `pure` with the routed workflow separately from a baseline-versus-treatment skill comparison, since those change different variables.
3. Run each prompt in a fresh session without telling the agent it is being evaluated. Do not expose the scoring notes to it. Repeat runs where practical and retain failures, not just the best result.
4. Capture the output, diff, verification results, elapsed time, and available token or cost telemetry. Where the host exposes skill/tool traces, record actual activations and unexpected activations. If traces or telemetry are unavailable, mark those measurements unknown rather than inferring them from the answer.
5. Review anonymized outputs against the same criteria. Record accepted outcome, defects, human rework, and safety violations. Report differences alongside the number of runs and missing evidence; small samples are directional, not proof of general improvement.

Use real, sanitized past tasks when available. The following prompts are starting points; prepare the described fixture and its expected result before running either variant.

| Fixture and user prompt | What to check |
|---|---|
| Small project with a reproducible bug and a focused test command: "Fix the incorrect total when the cart is empty." | Correct behavior, regression test, focused verification, and unnecessary tool or skill use. |
| Multi-module project with a documented ownership boundary: "Add cancellation to this operation without changing the public response format." | Correct module ownership, behavior and tests, and whether investigation adds value. |
| Local CI log fixture with one seeded failure: "Find and fix the failing check shown in the logs." | Identifies the real failure, verifies the fix, and does not push. This is not an ongoing monitoring request. |
| Local CI state sequence with pending, failed, and green states: "Watch the checks and keep fixing them until they're green." | Distinguishes monitoring from a one-shot fix, reports status, and does not push without separate authorization. |
| Diff containing a seeded behavioral defect: "Review this change for bugs." | Finds the defect with actionable evidence, avoids false positives, and makes no edits for a read-only request. |
| Runnable UI with a seeded interaction regression: "The save button no longer updates the page. Fix it." | Reproduces and checks the interaction, rather than relying only on compilation. |
| Short technical explanation and a separate prose-editing request: "Explain how this setting works." / "Make this paragraph clearer." | Accuracy and appropriate tone; check traces for unnecessary style-skill activation on the explanation and appropriate activation for requested editing. |

Use local fixtures or mocked services for CI and external systems. Do not push, create a PR, send messages, or change persistent external data during a replay without separate explicit authorization. For a skill deletion, also check references, installation, explicit invocation, and documented compatibility before removing the name. The repository checks in the root README validate assets but do not replace a live-host or behavioral replay.

## Configure models

Configure your provider and session model through OpenCode's normal setup. Run `/setup-pstack` to validate slugs, write `~/.pstack/models.conf`, and update `agents.<id>.model` for installed V2 subagents while preserving unrelated config. It removes an agent's model property when you choose inherit-parent/auto, reloads config, and checks `opencode api get /api/agent` (the agents are in its `data` array). `opencode-model-routing.example.jsonc` shows the V2 shape, but its placeholders are not installed. The role map can select models per Task only on hosts that support per-Task model selection: on OpenCode V2, panel calls using the same wrapper share one configured model, so panel diversity is not guaranteed. This setup does not pin Tab primaries or change a session's selected model.

## After install

Restart OpenCode and select `code`, `pure`, `deep`, or `review`. Set `default_agent` yourself if you want a different startup selection. The plugin does not change config or overwrite global `AGENTS.md`. OpenCode V2 accepts `instructions` in config but does not load those files. Run `node scripts/check-host.mjs` from a clone to flag version/config drift before trusting the V2 hook.
