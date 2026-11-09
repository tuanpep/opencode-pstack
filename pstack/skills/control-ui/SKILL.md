---
name: control-ui
description: "Explicit advanced UI verification guidance for Electron/CDP attachment, ambiguous app windows, performance traces, or memory investigations. Routine web verification should use existing tests and available browser tools directly."
disable-model-invocation: true
---

# Advanced UI verification

Use this reference when ordinary repository tests and host browser tools cannot inspect the required behavior. It remains explicitly loadable for existing playbooks. It is not a prerequisite for frontend work.

## Choose the existing tool

1. Identify the user journey, expected result, and evidence needed. Reproduce a bug before changing code when feasible.
2. Reuse repository Playwright, Cypress, Storybook, or Electron tests. For host browser tools, load the host's `browser` skill when available and follow its targeting and safety rules. Do not duplicate its API instructions.
3. Only if existing tools are insufficient, use a small temporary probe with already-installed tooling. Do not add dependencies without permission. Discover local commands, ports, and app markers rather than copying another project's setup.
4. Start required dev servers in the background, not in a blocking foreground command. Report startup failures separately from product failures.

## Electron and CDP

- Prefer the repository's Electron test launcher. If remote debugging is necessary, bind it to loopback, use a disposable profile, and never attach to an unrelated personal browser session.
- Select the exact app window using a stable root marker and its URL or title. Do not choose by tab order. If no window matches, report available targets instead of guessing.
- Use roles, accessible names, and stable selectors. Refresh references after navigation or structural changes. Use coordinates only with a fresh screenshot and no suitable semantic target.

## Performance and memory

- State a measurable claim and repeat the same workload before and after the change under comparable conditions.
- Capture only the artifact needed: a CPU trace for slow interactions, network evidence for request behavior, or heap snapshots for suspected retention. Do not collect every profile by default.
- Distinguish observed timing, retained objects, and inferred causes. Forced garbage collection is a diagnostic aid, not proof of normal production memory behavior.

## Evidence and cleanup

Observe the state after the action and relevant console or network failures. A screenshot alone does not prove persistence or request success. Keep fixture data disposable and avoid external writes without authorization.

Use the environment's approved temporary directory rather than assuming `/tmp`. Screenshots, traces, network logs, and heap snapshots may contain credentials or private content. Minimize capture, redact before sharing, and obtain consent before saving sensitive artifacts.

Close only processes, debug sessions, contexts, and profiles created for this task. Disconnect from shared sessions without terminating the user's browser. Report the evidence, verification limits, and any cleanup still needed.
