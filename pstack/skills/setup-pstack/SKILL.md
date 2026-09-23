---
name: setup-pstack
description: Configure pstack's role map and installed OpenCode V2 subagent models. Use for /setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack

Configure both `~/.pstack/models.conf` (the portable per-Task role map) and, on OpenCode V2, `agents.<id>.model` for installed subagents in OpenCode configuration. V2 subagents without a model inherit the parent session model; writing only `models.conf` does not route them.

## Steps

### 1. Detect available models

Enumerate the model slugs available in this session. On OpenCode V2, use the models API or model catalog for the active connection; on other hosts, use the slugs available to Task. If you cannot detect any, ask the user to paste the slugs they have access to. Never write a real slug you have not confirmed is available. The aliases `inherit-parent` and `auto` are role-map choices, not OpenCode model slugs.

### 2. Load current state

Read existing `~/.pstack/models.conf` if present. On OpenCode V2, also read the existing global `opencode.json(c)` (respect `OPENCODE_CONFIG_DIR` / XDG config location) and effective installed agent models. Treat these as current choices; do not overwrite unrelated OpenCode settings, agent fields, or JSONC comments. Derive candidate choices from detected models; never use a bundled provider-specific fallback.

### 3. Map and confirm

Show every role with its current model, marking any real slug not in the detected set as needing a choice. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` and `auto` (both mean inherit the parent model) as options. Prefer AskQuestion over free text. For panel roles (how critics, arena runners, architect runners, interrogate reviewers) the value is a list; on hosts with per-Task model selection one subagent runs per entry, alias entries included. `arena cross-judge pool` is a list from which Arena can select a different model family when the host supports it. `swarm workers` is the default unless a race assigns a model per arm. On OpenCode V2, these role-level and per-arm choices cannot force different models when calls share one named subagent wrapper: its single configured model wins. Explain this before confirmation and ask for one model per installed wrapper where roles conflict; panel diversity is not guaranteed.

Map roles to installed OpenCode V2 subagents, if present: `research` ← how explorer, why investigators, reflect tooling, swarm workers; `worker` ← feature/refactoring, bug-fix, hillclimb, everyday implementation; `expert` ← hardest tasks, perf-issue. `ci-watcher` and `comments` are separate wrappers for CI monitoring and comment review; `compat-scan`, `compat-startup`, `compat-verify`, `compat-docs` are separate compatibility reviewers; `thermos-review` and `thermos-quality` are separate audit wrappers; `learn` is a separate memory-update wrapper. Ask for choices for these agents too, using the nearest role as a suggestion, not a mandatory pin. Only configure IDs that are actually installed. Do not silently map a panel list to one slug or promise distinct panel models on V2.

### 4. Validate

Every real slug written to either destination must be in the detected set; `inherit-parent` and `auto` pass only as aliases in `models.conf`. If a chosen real slug is not available, stop and ask again. A config pointing at a model the user cannot use breaks delegation.

### 5. Write the role map

Write `~/.pstack/models.conf` with one line per role, using the same labels poteto-mode uses. Overwrite the whole file so re-runs stay idempotent. Replace each placeholder below with a confirmed slug or `inherit-parent` / `auto`. This is a shape example, not a file to write literally:

```
# pstack model configuration. One line per role.
# `inherit-parent` or `auto`: omit Task `model` on hosts with per-Task selection.
feature, refactoring: <best-price-performance-coding-model>
bug-fix: <best-price-performance-coding-model>
perf-issue: <strongest-reasoning-model>
hillclimb: <best-price-performance-coding-model>
judgment and prose: <best-price-performance-coding-model>
hardest tasks: <strongest-reasoning-model>
how explorer: <low-cost-research-model>
how explainer: <best-price-performance-coding-model>
how critics: <model-a>, <model-b>
why investigators: <low-cost-research-model>
why synthesizer: <best-price-performance-coding-model>
reflect tooling: <low-cost-research-model>
reflect judgment, divergent, synthesizer: <best-price-performance-coding-model>
arena runners: <model-a>, <model-b>, <model-c>
arena cross-judge pool: <model-a>, <model-b>
swarm workers: <low-cost-research-model>
architect runners: <model-a>, <model-b>
interrogate reviewers: <model-a>, <model-b>
```

### 6. Configure OpenCode V2 subagents

When running on OpenCode V2, edit the existing global `opencode.json(c)` under `agents` (plural) for the installed subagent IDs confirmed above. Create only missing `agents` entries; preserve all unrelated keys, existing agent options, and JSONC formatting/comments. For a real slug set `agents.<id>.model` to that validated `provider/model` slug (optional confirmed `#variant`). For `inherit-parent` or `auto`, remove that agent's `model` property instead of writing the alias or `null`; leave its other properties intact. If a higher-priority project config or a Markdown agent definition still pins the agent, do not claim inheritance: identify the conflicting source and ask before changing it. Do not change root `model`, `default_agent`, or primary agents (`code`, `deep`, `review`); selecting a primary does not change an existing session's model.

Reload the configuration (`opencode api post /api/location/reload`, or restart the service if reload is unavailable), then run `opencode api get /api/agent` in the relevant location. Its response is an object with a `data` array: find each installed ID in `data`, check the reported model against the selected slug, and for inherit-parent check that no model is pinned. If the effective model disagrees, inspect config precedence rather than reporting success. Do not confuse the response envelope with a bare array.

### 7. Confirm

Tell the user what was written and which V2 agents were verified, or report any unverified conflict. The role map is read when skills run on hosts that support per-Task model selection; OpenCode V2 agent routing takes effect after reload. Re-running this skill updates both destinations.

### 8. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill` (resolves wherever pstack is installed — workspace, user, or plugin). On no, move on without pushing.
