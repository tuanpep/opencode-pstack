---
name: deslop
description: Clean up unnecessary complexity in a code diff when requested or before a scoped review. Do not use for prose editing; use unslop for writing.
---

# Remove AI code slop

Check the diff against main and remove AI-generated slop introduced in the branch.

## Focus Areas

- Extra comments that are unnecessary or inconsistent with local style
- Defensive checks or try/catch blocks that are abnormal for trusted code paths
- Casts to `any` used only to bypass type issues
- Deeply nested code that should be simplified with early returns
- Other patterns inconsistent with the file and surrounding codebase

## Guardrails

- Keep behavior unchanged unless fixing a clear bug.
- Preserve comments that explain non-obvious constraints, safety, compatibility, or intent unless the underlying reason is demonstrably obsolete. When uncertain, keep them.
- Do not remove validation, error handling, or type checks merely because they look defensive; establish the trust boundary and callers first.
- Prefer minimal, focused edits over broad rewrites.
- Keep the final summary concise (1-3 sentences).
