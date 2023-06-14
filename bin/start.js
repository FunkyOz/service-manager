#!/usr/bin/env node
const program = require('commander');

(async function() {
  program.version('1.0.0')
    .argument('<service>', 'service name')

  program.parse(process.argv)

  const [service] = program.args
  try {
    await require('..').start(service)
  } catch (err) {
    console.error(err)
  }
})()
