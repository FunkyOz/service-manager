const path = require('path')

exports = module.exports = {
  getProjectDir() {
    return path.resolve(__dirname, '../../')
  },
  getManagerDir() {
    return path.resolve(__dirname, '../')
  }
}
