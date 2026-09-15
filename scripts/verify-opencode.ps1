[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$verify = Join-Path $PSScriptRoot 'verify-opencode.mjs'
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    throw 'Node.js is required to verify OpenCode plugins.'
}

& $node.Source $verify @args
exit $LASTEXITCODE
