const fs = require('fs')
const { createHash } = require('crypto')
const stringify = require('./util/stringify')
const confPath = `/tmp/conf/${createHash('md5')
  .update('conf.json', 'utf8')
  .digest('hex')}`

let hotConf = {}

class Conf {
  constructor() {
    if (!fs.existsSync('/tmp')) {
      fs.mkdirSync('/tmp')
    } else {
      if (!fs.existsSync('/tmp/conf')) {
        fs.mkdirSync('/tmp/conf')
      }
    }

    if (!fs.existsSync(confPath)) {
      fs.writeFileSync(confPath, '{}')
    }

    hotConf = JSON.parse(fs.readFileSync(confPath).toString() || '{}')
  }

  get(key) {
    return hotConf[key]
  }

  set(key, value) {
    if (key && value !== undefined) {
      hotConf[key] = value
    }
    return value
  }

  del(key) {
    delete hotConf[key]
  }

  clear() {
    hotConf = {}
  }

  // Buffer to avoid multiple request
  close() {
    // Store conf to file, this shall not block function runtime
    fs.promises.writeFile(confPath, stringify(hotConf))
  }
}

module.exports = new Conf()
