const { passthru, buildDockerCompose } = require('./utils')

exports = module.exports = async function(service, options = {}) {
  const [command, ...args] = buildDockerCompose(service)
  const opts = []
  if (options?.volumes === true) {
    opts.push('--volumes')
  }
  await passthru(command, [
    ...args,
    'down',
    ...opts
  ])
}
