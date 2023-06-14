#!/usr/bin/env node
const program = require('commander');

(async function() {
  program.version('1.0.0')
    .argument('<service>', 'service name')
    .option('-v, --volumes', 'destroy volumes')

  program.parse(process.argv)

  const [service] = program.args
  try {
    await require('..').stop(service, program.opts())
  } catch (err) {
    console.error(err)
  }
})()
