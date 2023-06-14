const { passthru, buildDockerCompose } = require('./utils')

exports = module.exports = async function(service) {
  const [command, ...args] = buildDockerCompose(service)
  await passthru(command, [
    ...args,
    'exec',
    '-T',
    'db',
    'mysql', '-h', '127.0.0.1', '-uroot', '-proot',
    '-e', 'create database if not exists app'
  ])
}
