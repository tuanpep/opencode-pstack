import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PLUGIN_PACKAGE_NAME = 'opencode-pstack'
export const PLUGIN_SPECIFIERS = [
  PLUGIN_PACKAGE_NAME,
  'github:tuanpep/opencode-pstack',
  'tuanpep-opencode-plugins',
  'github:tuanpep/plugins',
]
export const DEFAULT_PLUGINS = ['pstack', 'thermos', 'opencode-workflow']
export const ALL_PLUGINS = [...DEFAULT_PLUGINS]

const STALE_AGENTS = ['coding-agent.md', 'review-agent.md', 'rigor.md', 'dev.md', 'audit.md', 'pip.md', 'owl.md', 'bear.md', 'fox.md', 'hawk.md', 'wolf.md']
const STALE_SKILL_DIRS = [
  'check-compiler-errors',
  'fix-merge-conflicts',
  'get-pr-comments',
  'make-pr-easy-to-review',
  'new-branch-and-pr',
  'pr-review-canvas',
  'run-smoke-tests',
  'weekly-review',
  'what-did-i-get-done',
  'workflow-from-chats',
]

export function packageRoot() {
  return dirname(fileURLToPath(import.meta.url))
}

export function samePath(left, right) {
  const normalizePath = (value) => {
    const resolved = resolve(value)
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved
  }
  return normalizePath(left) === normalizePath(right)
}

export function xdgConfigHome() {
  const fromEnv = process.env.XDG_CONFIG_HOME?.trim()
  if (fromEnv) {
    return fromEnv
  }
  return join(homedir(), '.config')
}

export function globalConfigDir() {
  const fromEnv = process.env.OPENCODE_CONFIG_DIR?.trim()
  if (fromEnv) {
    return resolve(fromEnv)
  }

  if (process.env.XDG_CONFIG_HOME?.trim()) {
    return join(process.env.XDG_CONFIG_HOME.trim(), 'opencode')
  }

  const defaults = [join(homedir(), '.config', 'opencode')]
  if (process.platform === 'win32' && process.env.APPDATA) {
    defaults.push(join(process.env.APPDATA, 'opencode'))
  }
  if (process.platform === 'darwin') {
    defaults.push(join(homedir(), 'Library', 'Application Support', 'opencode'))
  }

  const existing = defaults.find((dir) =>
    ['opencode.json', 'opencode.jsonc', 'agents', 'skills', 'commands'].some((name) => existsSync(join(dir, name))),
  )
  return existing ?? defaults[0]
}

export function isPlaceholderKey(value) {
  if (typeof value !== 'string') {
    return true
  }
  const stripped = value.trim()
  return stripped === '' || stripped.startsWith('{env:')
}

export function mergeProvider(dest, template) {
  const merged = { ...dest }
  for (const [providerId, templateProvider] of Object.entries(template)) {
    if (!templateProvider || typeof templateProvider !== 'object' || Array.isArray(templateProvider)) {
      merged[providerId] = templateProvider
      continue
    }
    const destProvider = dest[providerId]
    if (!destProvider || typeof destProvider !== 'object' || Array.isArray(destProvider)) {
      merged[providerId] = templateProvider
      continue
    }
    const destOptions = destProvider.options && typeof destProvider.options === 'object' ? destProvider.options : {}
    const templateOptions = templateProvider.options && typeof templateProvider.options === 'object' ? templateProvider.options : {}
    const options = { ...templateOptions }
    if (destOptions.apiKey && !isPlaceholderKey(destOptions.apiKey)) {
      options.apiKey = destOptions.apiKey
    }
    if (destOptions.baseURL && !templateOptions.baseURL) {
      options.baseURL = destOptions.baseURL
    }
    const destModels = destProvider.models && typeof destProvider.models === 'object' ? destProvider.models : {}
    const templateModels = templateProvider.models && typeof templateProvider.models === 'object' ? templateProvider.models : {}
    const models = { ...destModels, ...templateModels }
    const out = { ...templateProvider, options }
    if (Object.keys(models).length > 0) {
      out.models = models
    }
    merged[providerId] = out
  }
  return merged
}

export function mergeConfig(dest, template) {
  const out = { ...dest }
  for (const [key, value] of Object.entries(template)) {
    if (key === 'provider') {
      out.provider = mergeProvider(
        dest.provider && typeof dest.provider === 'object' ? dest.provider : {},
        value && typeof value === 'object' ? value : {},
      )
      continue
    }
    if (key === 'agent') {
      const agents = { ...(dest.agent && typeof dest.agent === 'object' ? dest.agent : {}) }
      if (value && typeof value === 'object') {
        for (const [agentId, templateAgent] of Object.entries(value)) {
          const existing = agents[agentId]
          if (existing && typeof existing === 'object' && templateAgent && typeof templateAgent === 'object') {
            agents[agentId] = { ...existing, ...templateAgent }
          } else {
            agents[agentId] = templateAgent
          }
        }
      }
      out.agent = agents
      continue
    }
    if (key === 'instructions') {
      const existing = Array.isArray(dest.instructions) ? dest.instructions : []
      const extra = Array.isArray(value) ? value : []
      const seen = []
      for (const item of [...extra, ...existing]) {
        if (!seen.includes(item)) {
          seen.push(item)
        }
      }
      out.instructions = seen
      continue
    }
    out[key] = value
  }
  return out
}

export function applyConfig(config, template) {
  const merged = mergeConfig(config, template)
  for (const key of Object.keys(config)) {
    delete config[key]
  }
  Object.assign(config, merged)
  return config
}

function copyDirectory(source, target) {
  if (!existsSync(source) || !statSync(source).isDirectory()) {
    return
  }
  mkdirSync(target, { recursive: true })
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.name === '.DS_Store' || entry.name === 'Thumbs.db') {
      continue
    }
    const from = join(source, entry.name)
    const to = join(target, entry.name)
    if (entry.isDirectory()) {
      copyDirectory(from, to)
    } else if (entry.isFile()) {
      if (!existsSync(to) || !readFileSync(to).equals(readFileSync(from))) {
        copyFileSync(from, to)
      }
    }
  }
}

function parseJsonLike(text) {
  try {
    return JSON.parse(text)
  } catch {
    const stripped = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/,\s*([}\]])/g, '$1')
    return JSON.parse(stripped)
  }
}

function readJson(path) {
  return parseJsonLike(readFileSync(path, 'utf8'))
}

function configFilePath(destination) {
  const json = join(destination, 'opencode.json')
  const jsonc = join(destination, 'opencode.jsonc')
  if (existsSync(json)) {
    return json
  }
  if (existsSync(jsonc)) {
    return jsonc
  }
  return json
}

function configMentionsPlugin(text) {
  return PLUGIN_SPECIFIERS.some((specifier) => text.includes(specifier))
}

function findGitRoot(directory) {
  let current = directory
  while (true) {
    if (existsSync(join(current, '.git'))) {
      return current
    }
    const parent = dirname(current)
    if (parent === current) {
      return directory
    }
    current = parent
  }
}

export function resolveDestination(directory, options = {}) {
  if (options.destination) {
    return options.destination
  }
  if (options.scope === 'project') {
    return join(directory, '.opencode')
  }
  if (options.scope === 'global') {
    return globalConfigDir()
  }

  let current = findGitRoot(directory)
  const roots = [directory]
  if (current !== directory) {
    roots.push(current)
  }
  while (true) {
    const parent = dirname(current)
    if (parent === current) {
      break
    }
    current = parent
  }

  for (const root of roots) {
    for (const name of ['opencode.json', 'opencode.jsonc', join('.opencode', 'opencode.json'), join('.opencode', 'opencode.jsonc')]) {
      const path = join(root, name)
      if (existsSync(path) && configMentionsPlugin(readFileSync(path, 'utf8'))) {
        return join(root, '.opencode')
      }
    }
  }

  return globalConfigDir()
}

function mergeJsonFile(templatePath, destPath) {
  const template = readJson(templatePath)
  mkdirSync(dirname(destPath), { recursive: true })
  let dest = {}
  if (existsSync(destPath)) {
    dest = readJson(destPath)
  }
  writeFileSync(destPath, `${JSON.stringify(mergeConfig(dest, template), null, 2)}\n`, 'utf8')
}

function removeStale(destination) {
  const agentsDir = join(destination, 'agents')
  for (const name of STALE_AGENTS) {
    const path = join(agentsDir, name)
    if (existsSync(path)) {
      rmSync(path, { force: true })
    }
  }
  const skillsDir = join(destination, 'skills')
  for (const name of STALE_SKILL_DIRS) {
    const path = join(skillsDir, name)
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true })
    }
  }
}

export function installPlugins(options = {}) {
  const root = options.root ?? packageRoot()
  const plugins = options.plugins?.length ? options.plugins : DEFAULT_PLUGINS
  const destination = options.destination ?? resolveDestination(options.directory ?? process.cwd(), options)

  for (const name of plugins) {
    if (!ALL_PLUGINS.includes(name)) {
      throw new Error(`Unknown plugin: ${name}`)
    }
    const pluginRoot = join(root, name)
    if (!existsSync(pluginRoot)) {
      throw new Error(`Unknown plugin directory: ${name}`)
    }

    copyDirectory(join(pluginRoot, 'skills'), join(destination, 'skills'))
    copyDirectory(join(pluginRoot, 'opencode', 'agent'), join(destination, 'agents'))
    copyDirectory(join(pluginRoot, 'opencode', 'command'), join(destination, 'commands'))

    const workflow = join(pluginRoot, 'WORKFLOW.md')
    if (existsSync(workflow)) {
      mkdirSync(destination, { recursive: true })
      const target = join(destination, 'WORKFLOW.md')
      if (!existsSync(target) || !readFileSync(target).equals(readFileSync(workflow))) {
        copyFileSync(workflow, target)
      }
    }

    const template = join(pluginRoot, 'opencode.json.template')
    if (options.configure !== false && existsSync(template)) {
      mergeJsonFile(template, configFilePath(destination))
    }

    const modelsExample = join(pluginRoot, 'models.conf.example')
    const modelsDest = join(homedir(), '.pstack', 'models.conf')
    if (samePath(destination, globalConfigDir()) && existsSync(modelsExample) && !existsSync(modelsDest)) {
      mkdirSync(dirname(modelsDest), { recursive: true })
      copyFileSync(modelsExample, modelsDest)
    }
  }

  if (options.cleanup !== false) removeStale(destination)
  return { destination, plugins }
}

export function loadWorkflowTemplate(root = packageRoot()) {
  return readJson(join(root, 'opencode-workflow', 'opencode.json.template'))
}
