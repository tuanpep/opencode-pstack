---
description: Configure pstack roles and installed OpenCode V2 subagent models.
agent: code
---

Load the `setup-pstack` skill in full and follow it. Detect available models, confirm role and installed subagent mappings, write `~/.pstack/models.conf`, and configure installed subagents under OpenCode V2 `agents.<id>.model` while preserving unrelated config. Remove an agent's `model` for inherit-parent/auto. Validate real slugs and verify effective agents via `opencode api get /api/agent` after reload. Do not pin primary or session models.

$ARGUMENTS
