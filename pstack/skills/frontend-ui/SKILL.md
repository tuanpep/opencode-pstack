---
name: frontend-ui
description: "Apply when editing a web UI file (.tsx, .jsx, .vue, .svelte, or .css). Cover loading, empty, and error states, keyboard focus, and the client/server split. Do not use for backend-only changes."
---

# Frontend UI

Extend the existing screen, component, or style module. Run `find-home.mjs` from **principle-extend-the-existing-home** before adding a component folder.

**States.** A screen that loads remote data has a loading state, an empty state, and an error state. Each state is reachable in the running app.

**Focus.** A control is reachable from the keyboard. Focus stays visible. The accessible name is the same name `control-ui` will click.

**Client and server.** A server component or route handler may read the request and call the application layer. A client component renders and sends the action. It does not import the database client. `check-layers.mjs` beside the extend-the-existing-home skill is the check.

**Proof.** Verify in the running app with `control-ui`: do the action, then read the resulting state. A screenshot of the happy path is not the proof.
