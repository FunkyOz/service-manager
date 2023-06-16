const { passthru, buildDockerCompose } = require('./utils')

exports = module.exports = async function(service) {
  const [command, ...args] = buildDockerCompose(service)
  await passthru(command, [
    ...args,
    'exec',
    '-e', 'NODE_ENV=development',
    '-T',
    'web',
    'npm', 'run', 'migrate:dev'
  ])
}
