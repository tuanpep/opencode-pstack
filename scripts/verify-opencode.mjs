import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)))

const expectedAgents = {
  pstack: ['playbook', 'research', 'worker', 'expert', 'comments', 'ci-watcher'],
  thermos: ['thermos-quality', 'thermos-review'],
  'opencode-workflow': [
    'fox',
    'hawk',
    'wolf',
    'compat-scan',
    'compat-startup',
    'compat-verify',
    'compat-docs',
    'learn',
  ],
}

const deletedAssets = [
  '.claude-plugin/marketplace.json',
  'cursor-team-kit/.claude-plugin/plugin.json',
  'cursor-team-kit/README.md',
  'cursor-team-kit/LICENSE',
  'opencode-workflow/.claude-plugin/plugin.json',
  'pstack/.claude-plugin/plugin.json',
  'thermos/.claude-plugin/plugin.json',
  'scripts/install-claude.ps1',
  'scripts/install-claude.sh',
  'scripts/install-opencode.ps1',
  'scripts/install-opencode.sh',
  'scripts/merge-opencode-json.py',
  'scripts/check-opencode-install-parity.ps1',
  'scripts/verify-claude.ps1',
  'scripts/verify-claude.sh',
  'cursor-team-kit/agents/ci-watcher.md',
  'pstack/agents/coding-agent.md',
  'pstack/agents/review-agent.md',
  'pstack/agents/poteto-mode.md',
  'pstack/agents/poteto-agent.md',
  'pstack/agents/comment-sicko.md',
  'thermos/agents/thermo-nuclear-code-quality-review-subagent.md',
  'thermos/agents/thermo-nuclear-review-subagent.md',
]

const legacyHostPatterns = [
  /\bClaude Code\b/i,
  /\bclaude\s+mcp\s+list\b/i,
  /(?:~|\$HOME)?\/\.claude(?:\/|\\)/i,
  /\b(?:install|verify)-claude\b/i,
  /\bquick-install-all-plugins\b/i,
]

const errors = []

function walkFiles(root, suffix = '') {
  if (!existsSync(root)) {
    return []
  }
  const files = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(path, suffix))
    } else if (entry.isFile() && (!suffix || entry.name.endsWith(suffix))) {
      files.push(path)
    }
  }
  return files
}

function posixPath(path) {
  return relative(repositoryRoot, path).split('\\').join('/')
}

function getFrontmatter(path) {
  const lines = readFileSync(path, 'utf8').split(/\r?\n/)
  if (lines.length < 3 || lines[0] !== '---') {
    errors.push(`${path} is missing opening OpenCode frontmatter`)
    return {}
  }
  const end = lines.indexOf('---', 1)
  if (end < 0) {
    errors.push(`${path} is missing closing OpenCode frontmatter`)
    return {}
  }
  const values = {}
  for (const line of lines.slice(1, end)) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.+)$/)
    if (match) {
      values[match[1]] = match[2].trim()
    }
  }
  return values
}

for (const [plugin, requiredAgents] of Object.entries(expectedAgents)) {
  const pluginRoot = join(repositoryRoot, plugin)
  const skillsRoot = join(pluginRoot, 'skills')
  const agentsRoot = join(pluginRoot, 'opencode', 'agent')

  if (!existsSync(skillsRoot) || !statSync(skillsRoot).isDirectory()) {
    errors.push(`${plugin} is missing skills/`)
    continue
  }

  for (const skillFile of walkFiles(skillsRoot).filter((path) => path.endsWith('SKILL.md'))) {
    const frontmatter = getFrontmatter(skillFile)
    const name = frontmatter.name
    const description = frontmatter.description
    const directoryName = skillFile.split(/[/\\]/).at(-2)
    if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
      errors.push(`${skillFile} has an invalid OpenCode skill name`)
    }
    if (name !== directoryName) {
      errors.push(`${skillFile} has a name that does not match its directory`)
    }
    if (!description) {
      errors.push(`${skillFile} has no description`)
    }
  }

  if (existsSync(agentsRoot) && statSync(agentsRoot).isDirectory()) {
    const agentFiles = readdirSync(agentsRoot).filter((name) => name.endsWith('.md'))
    const agentNames = agentFiles.map((name) => name.replace(/\.md$/i, ''))
    for (const requiredAgent of requiredAgents) {
      if (!agentNames.includes(requiredAgent)) {
        errors.push(`${plugin} is missing OpenCode agent ${requiredAgent}`)
      }
    }
    for (const agentFile of agentFiles) {
      const path = join(agentsRoot, agentFile)
      const frontmatter = getFrontmatter(path)
      if (!frontmatter.description) {
        errors.push(`${path} has no OpenCode agent description`)
      }
      if (!['subagent', 'primary', 'all'].includes(frontmatter.mode)) {
        errors.push(`${path} has no OpenCode agent mode`)
      }
    }
  } else if (requiredAgents.length > 0) {
    errors.push(`${plugin} is missing opencode/agent/`)
  }

  const commandsRoot = join(pluginRoot, 'opencode', 'command')
  if (existsSync(commandsRoot) && statSync(commandsRoot).isDirectory()) {
    for (const commandFile of readdirSync(commandsRoot).filter((name) => name.endsWith('.md'))) {
      const path = join(commandsRoot, commandFile)
      const frontmatter = getFrontmatter(path)
      if (!frontmatter.description) {
        errors.push(`${path} has no OpenCode command description`)
      }
    }
  }
}

const workflowRoot = join(repositoryRoot, 'opencode-workflow')
if (!existsSync(join(workflowRoot, 'WORKFLOW.md'))) {
  errors.push('opencode-workflow is missing WORKFLOW.md')
}
const templatePath = join(workflowRoot, 'opencode.json.template')
if (!existsSync(templatePath)) {
  errors.push('opencode-workflow is missing opencode.json.template')
} else {
  try {
    JSON.parse(readFileSync(templatePath, 'utf8'))
  } catch (error) {
    errors.push(`opencode-workflow opencode.json.template is not valid JSON: ${error}`)
  }
}

for (const relativePath of deletedAssets) {
  if (existsSync(join(repositoryRoot, relativePath))) {
    errors.push(`Deleted Claude support asset is present: ${relativePath}`)
  }
}

const supportedFiles = [
  'README.md',
  'opencode-workflow/README.md',
  'pstack/README.md',
  'thermos/README.md',
  ...walkFiles(join(repositoryRoot, 'pstack', 'docs'), '.md').map(posixPath),
  ...['opencode-workflow', 'pstack', 'thermos'].flatMap((plugin) =>
    ['skills', 'opencode'].flatMap((folder) => walkFiles(join(repositoryRoot, plugin, folder), '.md').map(posixPath)),
  ),
]

for (const relativePath of new Set(supportedFiles)) {
  const path = join(repositoryRoot, relativePath)
  if (!existsSync(path)) {
    continue
  }
  const content = readFileSync(path, 'utf8')
  for (const pattern of legacyHostPatterns) {
    if (pattern.test(content)) {
      errors.push(`Actionable legacy-host reference in ${relativePath} matches '${pattern}'.`)
    }
  }
}

const testFile = join(repositoryRoot, 'scripts', 'install.test.mjs')
const test = spawnSync(process.execPath, ['--test', testFile], {
  cwd: repositoryRoot,
  stdio: 'inherit',
})
if (test.status !== 0) {
  errors.push('OpenCode plugin install tests failed')
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error)
  }
  process.exit(1)
}

console.log(`Validated OpenCode skill and agent assets for ${Object.keys(expectedAgents).join(', ')}.`)
