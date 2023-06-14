const { readdir } = require('fs/promises')
const { up, down, createDatabase, migrate, seed } = require('./command')
const { getProjectDir, getManagerDir } = require('./config')
const { getLogger } = require('./command/utils')
const path = require('path')

async function decoratePromiseWithService(promise, service, options) {
  return new Promise((resolve, reject) => {
    return promise(service, options)
      .then(() => resolve(service))
      .catch(err => reject(new Error({ err, service })))
  })
}

async function getServiceDirectories(services = []) {
  const includes = services.filter(service => !service.startsWith('!'))
  const excludes = services.filter(service => service.startsWith('!'))
    .map(service => service.substring(1))

  const projectDir = getProjectDir()
  const managerDir = path.basename(getManagerDir())

  return (await readdir(projectDir, { withFileTypes: true }))
    .filter(dir =>
      dir.name !== managerDir && // if is not manager dir
      !dir.name.startsWith('.') && dir.isDirectory() && // if is a valid directory (not hidden)
      (includes.length <= 0 || includes.includes(dir.name)) && // if include services is not empty and directory is included
      (excludes.length <= 0 || !excludes.includes(dir.name)) // if exclude services is not empty and directory is excluded
    )
    .map(dir => dir.name)
}

async function start(service) {
  await up(service)
  await createDatabase(service)
  await migrate(service)
  await seed(service)
}

async function stop(service, options = {}) {
  await down(service, options)
}

async function startAll(services = [], options = {}) {
  const logger = getLogger()
  services = (await getServiceDirectories(services))

  logger.info(`start services \n\t ${services.join('\n\t ')}`)
  const processes = services
    .map(dir => decoratePromiseWithService(start, dir))

  const fulfilleds = []

  const results = (await Promise.allSettled(processes))
  for (let i = 0; i < results.length; i++) {
    const { status, reason, value } = results[i]
    if (status === 'rejected') {
      logger.error(`[${reason.service}] - ${reason.err}`)
      break
    }
    fulfilleds.push(value)
  }

  if (options?.rollbackOnError && fulfilleds.length !== processes.length) {
    logger.info('start rollback')
    await stopAll(fulfilleds)
  }
}

async function stopAll(services = []) {
  const logger = getLogger()
  services = (await getServiceDirectories(services))
  logger.info(`stop services \n\t ${services.join('\n\t ')}`)
  const processes = services.map(dir => decoratePromiseWithService(stop, dir))

  try {
    await Promise.all(processes)
  } catch (err) {
    logger.error(`[${err.service}] - ${err.err}`)
  }
}

exports = module.exports = {
  start,
  stop,
  startAll,
  stopAll
}
