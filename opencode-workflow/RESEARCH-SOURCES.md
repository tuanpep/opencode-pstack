# Agent harness research sources

Reviewed 2026-10-02. This is a reference for maintainers of `opencode-workflow`, not an instruction file or a claim that the linked systems' results transfer to this plugin. Recheck upstream docs and host versions before changing routing, permissions, or installation guidance.

## Host contract (read these before changing code)

| Source | What it establishes | Local implementation / follow-up |
|---|---|---|
| [OpenCode V2 plugins](https://opencode.ai/v2/docs/plugins/) and [plugin-building API](https://opencode.ai/v2/docs/build/plugins/) | Package registration and `setup` lifecycle; the `context` hook changes model-request context. | `../index.js` injects only for `code`, `deep`, and `review`. `../scripts/install.test.mjs` mocks that hook; a live V2 integration test is still needed. |
| [OpenCode V2 agents](https://opencode.ai/v2/docs/agents/) and [permissions](https://opencode.ai/v2/docs/permissions/) | V2 `agents` and ordered `permissions` rules (`shell`, `subagent`, `skill`); V1 names differ. Shell access is not a sandbox. | `opencode/agent/*.md`, `opencode.json.template`, and `../scripts/check-host.mjs`. Check effective permission behavior on V2, not just YAML text. |
| [OpenCode V2 plugin management](https://opencode.ai/v2/docs/plugins/#manage) | V2 `plugin add`, `plugin update`, and package registration. | `../README.md` assumes V2. A local `opencode --version` of 1.x must not be treated as verification of V2 hooks. |

## Design evidence and limits

| Source | Relevant lesson | How it applies here |
|---|---|---|
| [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents) (2024) | Prefer simple, composable patterns; add orchestration when it improves results, because it costs latency and tokens. | `WORKFLOW.md` and `opencode/agent/deep.md` use selective delegation rather than compulsory fan-out. |
| [Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (2025) and [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/) (2026) | Keep always-loaded instructions small; retrieve task-specific material when needed. | `WORKFLOW.md` is bundled and injected on agent-loop requests; keep it short, and store situational guidance in skills/docs. |
| [Cursor: Best practices for coding with agents](https://cursor.com/blog/agent-best-practices) (2026) and [Cursor subagents](https://cursor.com/docs/agent/subagents) | Plan uncertain work; separate context-heavy investigations, but skip ceremony and subagents on small tasks. | `deep` may implement cohesive tasks locally; delegate only when isolation, independent work, or expertise pays off. |
| [Cursor: Scaling long-running autonomous coding](https://cursor.com/blog/scaling-agents) (2026) | Planner/worker coordination helped unusually large experiments; flat shared-state coordination suffered contention. | One-hop leaves and disjoint write ownership are sensible guardrails, not a reason to spawn workers for every task. |
| [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (2025) | Long tasks need resumable progress and verified completion beyond context compaction alone. | For genuinely multi-session tasks, keep a task-local plan/checklist and last verified state; do not add a progress file to every routine edit. |
| [Cursor: Agent sandboxing](https://cursor.com/blog/agent-sandboxing) (2026) | Approve-every-command causes interruptions and approval fatigue; sandboxing reduces prompts in Cursor's environment. | This plugin asks before coding-agent shell commands but does **not** provide a sandbox. Cursor's reported gains are not measurements of OpenCode or this repository. |
| [OpenAI: Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals) and [LangSmith: Evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts) | Inspect traces for routing mistakes, then compare changes against curated tasks and outcomes. | `scripts/install.test.mjs` tests wiring, not quality/cost. Before claiming savings, compare `pure` and routed runs on the same representative tasks, recording accepted outcome, time, cost, rework, and test results. |

## Evidence status

- **Verified locally:** Node installation tests and `scripts/verify-opencode.mjs` check package assets and a mocked hook; `scripts/check-host.mjs` reports host/config drift without changing user files.
- **Not yet verified:** A live OpenCode V2 host loading this package, enforcing V2 permissions, and excluding the bundled workflow in a real `pure` session. No controlled task replay or measured cost reduction exists here yet.
- **Do not generalize vendor metrics:** Cursor's sandbox, swarm and Anthropic's multi-agent results come from their own environments, models and workloads. Use them to formulate tests, not to predict percentage savings for this plugin.
