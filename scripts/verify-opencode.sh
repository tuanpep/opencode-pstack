#!/usr/bin/env bash
# Validates OpenCode skill, agent, and plugin-install assets. Requires Node.js.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v node >/dev/null 2>&1; then
  exec node "${script_dir}/verify-opencode.mjs" "$@"
fi

echo "Node.js is required to verify OpenCode plugins." >&2
exit 1
