#!/usr/bin/env node

const program = require('commander')

function parseServices(options) {
  let { services } = options ?? {}
  if (services.length <= 0) {
    services = process.env?.MANAGER_SERVICES
      ?.split(',')
      .map(service => service.trim())
      .filter(service => service) ?? []
  }

  return services
}

function parseMigrateAndSeedOptions(options) {
  const { migrate = false, seed = false } = options ?? {}

  return {
    withMigration: migrate,
    withSeed: seed
  }
}

(async function() {
  program.version('1.0.0')

  program
    .command('start')
    .description('start a new docker service using docker-compose')
    .argument('<service>', 'service name')
    .option('--migrate', 'should run migration', false)
    .option('--seed', 'should run seed', false)
    .action(async(service, options) => {
      await require('../.').start(service, parseMigrateAndSeedOptions(options))
    })

  program.command('start:all')
    .description('Start all services inside project direcotory')
    .option('--services <services...>', 'comma separated services to start', [])
    .option('--rollback-on-error', 'rollback services when an error occurred', false)
    .option('--migrate', 'should run migration', false)
    .option('--seed', 'should run seed', false)
    .action(async(options) => {
      const services = parseServices(options)

      options = parseMigrateAndSeedOptions(options)

      await require('..').startAll(services, options)
    })

  program.command('stop')
    .description('stop docker service using docker-compose')
    .argument('<service>', 'service name')
    .option('-v, --volumes', 'destroy volumes', false)
    .action(async(service, options) => {
      await require('..').stop(service, options)
    })

  program.command('stop:all')
    .description('stop all docker service using docker-compose')
    .option('--services <services...>', 'comma separated services to start')
    .option('-v, --volumes', 'destroy volumes', false)
    .action(async(options) => {
      const services = parseServices(options)

      await require('..').stopAll(services, options)
    })

  program.parse(process.argv)
})()
