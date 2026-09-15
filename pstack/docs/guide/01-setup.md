# Set up pstack

In this page you install the plugin, pick which models pstack uses, and run your first task. Setup is one command plus a short conversation.

## Install the plugin

```bash
opencode plugin github:tuanpep/opencode-pstack -g
```

That command is the same on Windows, macOS, and Linux. See the [repository install section](../../../README.md#install-opencode-plugins) to install only pstack or to install into a project `.opencode/` directory.

Restart OpenCode after installing.

## Configure models

The install command does not pick a provider or model. After restart:

1. Connect a provider in OpenCode if you have not already (`/connect`).
2. Run `/setup-pstack`. It lists models available in the session, asks which to use per pstack role, and writes `~/.pstack/models.conf`.
3. Optional: copy matching entries from [`opencode-model-routing.example.jsonc`](../../../opencode-workflow/opencode-model-routing.example.jsonc) into `opencode.json` if you want Tab agents to use specific slugs.

Re-run `/setup-pstack` whenever your entitled models change. Skills read the file on each run, so no new session is required after it writes.

See also the [pstack README](../../README.md) and the full [pstack guide](./README.md).

## First task

Once models are mapped, start a real piece of work:

```text
/poteto-mode <what is broken or missing>. repro first, then fix and verify.
```

`/poteto-mode` picks a playbook. You do not need to name one.
