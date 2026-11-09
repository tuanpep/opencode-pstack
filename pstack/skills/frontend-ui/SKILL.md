---
name: frontend-ui
description: "Use when implementing or changing web UI behavior, components, or layout. Check relevant interaction states, accessibility, responsive behavior, and client/server boundaries. Not for backend-only changes, non-UI TypeScript, or read-only explanations."
---

# Frontend UI

Extend the existing screen, component, or style module. Reuse design tokens and established interaction patterns. Follow **principle-extend-the-existing-home** when ownership is unclear; do not introduce a design system for a local change.

## Implementation checks

- Define the changed user action and expected result. Check only states relevant to that change: loading, empty, error, success, disabled, or validation feedback. Do not add artificial states to static content.
- Use semantic controls with accessible names. Check keyboard operation, visible focus, and focus restoration for overlays when relevant.
- Check layout at the affected viewport sizes, including long content and overflow. Preserve existing spacing, typography, and responsive conventions.
- Respect the framework's client/server model. Client code must not import database clients or server secrets. Server components and API routes may call the application layer.

## Verification

Use the repository's existing focused tests first. For interaction or visual changes, exercise the affected journey in the running app using available browser tooling. If using the host's browser tools, load its `browser` skill when available. No separate control skill or new automation framework is required for routine verification.

Observe the resulting state, not just a screenshot of the happy path. Check failure recovery and keyboard behavior when changed. A copy-only edit may need only the existing text test; match verification effort to risk. Report what was tested and what remains unverified. Use `control-ui` explicitly only when advanced Electron/CDP or profiling guidance is needed.
