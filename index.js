import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { globalConfigDir, installPlugins, packageRoot } from './install.js'

export default {
  id: 'opencode-pstack',
  async setup(ctx) {
    const plugins = ctx.options?.plugins?.length ? ctx.options.plugins : undefined
    installPlugins({
      destination: globalConfigDir(),
      plugins,
      configure: false,
      cleanup: false,
    })
    if (!plugins || plugins.includes('opencode-workflow')) {
      const workflow = readFileSync(join(packageRoot(), 'opencode-workflow', 'WORKFLOW.md'), 'utf8')
      await ctx.session.hook('context', (event) => {
        event.system.push({ type: 'text', text: workflow })
      })
    }
  },
}
