#!/usr/bin/env node
const program = require('commander');

(async function() {
  program.version('1.0.0')
    .parse(process.argv)

  await require('..').stopAll()
})()
