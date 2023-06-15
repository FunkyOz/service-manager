const { spawn } = require('child_process')
const { existsSync } = require('fs')
const { getProjectDir } = require('../../config')
const winston = require('winston')

const logger = winston.createLogger({
  format: winston.format.cli(),
  transports: [
    new winston.transports.Console()
  ]
})

exports = module.exports = {
  buildDockerCompose(service) {
    const serviceDir = `${getProjectDir()}/${service}`
    if (!existsSync(serviceDir)) {
      throw new Error(`${serviceDir} does not exists.`)
    }

    const dockerComposeFile = [
      `${serviceDir}/docker-compose.dev.yml`,
      `${serviceDir}/docker-compose.yml`
    ].find(file => existsSync(file))

    if (!dockerComposeFile) {
      throw new Error('Docker compose file does not exists.')
    }

    return [
      'docker-compose',
      '--project-directory', serviceDir,
      '-f', dockerComposeFile
    ]
  },
  passthru(command, args = [], options) {
    return new Promise((resolve, reject) => {
      try {
        spawn(command, args, { ...options, stdio: 'inherit' })
          .on('close', (code) => {
            if (code !== 0) {
              return reject(new Error(`Command  ${command} ${args.join(' ')} exit with code ${code}`))
            }
            return resolve()
          })
          .on('error', reject)
      } catch (err) {
        return reject(err)
      }
    })
  },
  getLogger() {
    return logger
  }
}
