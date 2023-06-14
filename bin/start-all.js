#!/usr/bin/env node
const program = require('commander');

(async function() {
  program.version('1.0.0')
    .option('--services <services...>', 'comma separated services to start')
    .option('--rollback-on-error', 'rollback services when an error occurred')
    .parse(process.argv)

  let { services = [], rollbackOnError = false } = program.opts()

  if (services.length <= 0) {
    services = process.env?.MANAGER_SERVICES
      ?.split(',')
      .map(service => service.trim())
      .filter(service => service) ?? []
  }

  await require('..').startAll(services, { rollbackOnError })
})()
