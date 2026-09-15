# thermos for OpenCode

`thermos` runs deep branch reviews for correctness, security, and maintainability through parallel OpenCode subagents.

## Install

```bash
opencode plugin github:tuanpep/opencode-pstack -g
```

That command is the same on Windows, macOS, and Linux. See the [repository install section](../README.md#install-opencode-plugins) to install only thermos or to install into a project `.opencode/` directory.

Restart OpenCode after installation.

## Skills

| Skill | Description |
|:------|:------------|
| `thermo-nuclear-review` | Audit a branch for bugs, breaking changes, security issues, developer-experience regressions, and feature-gate leaks |
| `thermo-nuclear-code-quality-review` | Audit maintainability, file size, boundaries, and condition complexity |
| `thermos` | Run both review subagents in parallel and combine their findings |

## Agents

Mention either agent after gathering the diff and full contents of changed files:

| Agent | Description |
|:------|:------------|
| `@thermos-review` | Diff-scoped correctness and security review |
| `@thermos-quality` | Diff-scoped maintainability review |

For a full thermos pass, invoke both agents in parallel. Use the `thermos` skill when you want it to coordinate the two reviews and combine their findings.

## License and provenance

MIT. Derived from [cursor/plugins](https://github.com/cursor/plugins). Copyright (c) 2026 Cursor.
