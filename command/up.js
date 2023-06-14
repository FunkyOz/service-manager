const { passthru, buildDockerCompose } = require('./utils')

exports = module.exports = async function(service) {
  const [command, ...args] = buildDockerCompose(service)
  await passthru(command, [
    ...args,
    'up',
    '-d'
  ])
}
