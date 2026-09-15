import { applyConfig, installPlugins, loadWorkflowTemplate } from './install.js'

let installedDestination

export async function plugin(_input, options = {}) {
  const result = installPlugins({
    directory: _input?.directory,
    plugins: options.plugins,
    scope: options.scope,
    destination: options.destination,
  })
  installedDestination = result.destination
  const template = loadWorkflowTemplate()

  return {
    config: async (config) => {
      applyConfig(config, template)
    },
  }
}

export default plugin
export { installedDestination }
