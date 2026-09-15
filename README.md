# OpenCode agent plugins

An OpenCode plugin collection for CI workflows, code review, rigorous engineering skills, and branch audits.

## Plugins

| Name | Folder | What it adds |
|------|--------|--------------|
| `pstack` | [pstack/](pstack/) | Poteto Mode, engineering principles, shipping/CI/verification skills, and multi-agent workflows |
| `thermos` | [thermos/](thermos/) | Deep branch review for correctness, security, and maintainability |
| `opencode-workflow` | [opencode-workflow/](opencode-workflow/) | Primary agents, slash commands, `WORKFLOW.md`, `/compat`, and `/learn` |

## Prerequisites

- [OpenCode](https://opencode.ai)

## Install OpenCode plugins

One command on Windows, macOS, and Linux:

```bash
opencode plugin github:tuanpep/opencode-pstack -g
```

That registers the plugin in OpenCode and copies skills, agents, commands, and `WORKFLOW.md` into OpenCode's user config directory:

- Linux and macOS: `~/.config/opencode` (or `$XDG_CONFIG_HOME/opencode`)
- Windows: `%USERPROFILE%\.config\opencode` (or `%APPDATA%\opencode` if that directory already exists)
- Override: `OPENCODE_CONFIG_DIR`

Omit `-g` to add the plugin to the current project's `opencode.json` and install into `.opencode/`.

Restart OpenCode after it finishes.

## After install

The plugin does not configure a provider, API key, or model.

1. Restart OpenCode.
2. Connect a provider if needed (`/connect`).
3. Run `/setup-pstack`. It detects models in the session and writes `~/.pstack/models.conf` for pstack roles (`research`, `worker`, `expert`, and the skill panels). Re-run it when your model list changes.
4. Optional: copy applicable entries from `opencode-workflow/opencode-model-routing.example.jsonc` into `opencode.json` if you want Tab agents pinned to specific slugs.

Then use Tab for `fox` / `hawk` / `wolf`, or `/poteto-mode` for playbook-driven work.

To limit which bundles are copied, set plugin options in `opencode.json`:

```json
{
  "plugin": [
    ["github:tuanpep/opencode-pstack", { "plugins": ["pstack"] }]
  ]
}
```

Valid `plugins` values are `pstack`, `thermos`, and `opencode-workflow`. The default is all three.

From a local clone:

```bash
opencode plugin file:. -g
```

## Use the installed agents

Use Tab to select the `fox`, `hawk`, or `wolf` primary agent. `fox` is the default. Use `@` mentions for installed subagents, including `@ci-watcher`, `@worker`, and the thermos review agents.

Pstack supplies hidden Task targets: `research` for bounded evidence gathering, `worker` for implementation and focused review, and `expert` for trace-backed performance work and high-risk reasoning. Those three are leaves and cannot spawn further agents. `wolf` works directly by default and delegates at most one hop. Run `/setup-pstack` after installation to configure their models.

Available workflow commands include `/setup-pstack`, `/review`, `/deep`, `/compat`, `/learn`, `/ship`, `/verify`, `/how`, and `/why`. See [pstack/docs/guide/](pstack/docs/guide/README.md) for a pstack walkthrough.

## Verify repository changes

Run this from the repository root after editing OpenCode skills, agents, or commands. Node.js is required on every OS.

```bash
node scripts/verify-opencode.mjs
```

## Update

Reinstall and restart OpenCode:

```bash
opencode plugin github:tuanpep/opencode-pstack -g --force
```

## Copyright and provenance

`thermos` is derived from [Cursor plugins](https://github.com/cursor/plugins). `pstack` is derived from work by Lauren Tan, with shipping and verification skills derived from Cursor plugins. See each plugin's `LICENSE` file.

The OpenCode adaptations, plugin loader, and `opencode-workflow` are MIT licensed by tuanpep. See [LICENSE](LICENSE).
