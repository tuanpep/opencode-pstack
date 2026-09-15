param(
    [string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$verify = Join-Path $PSScriptRoot 'verify-opencode.mjs'
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    throw 'Node.js is required to verify OpenCode plugins.'
}

& $node.Source $verify
if (-not $?) {
    exit 1
}
