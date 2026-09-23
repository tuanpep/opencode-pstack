import { globalConfigDir, installPlugins } from './install.js'

export default {
  id: 'opencode-pstack',
  setup(ctx) {
    installPlugins({
      destination: globalConfigDir(),
      plugins: ctx.options.plugins,
      configure: false,
      cleanup: false,
    })
  },
}
