const fs = require('fs')
const confPath = `/tmp/conf/conf.json`

let hotConf, timeUpdater

class Conf {
  // We need to manually pass in the timeout cause we simply don't
  async load() {
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
    hotConf = JSON.parse(await fs.promises.readFile(confPath))
  }

  get(key) {
    return hotConf[key]
  }

  set(key, value) {
    if (key && value) {
      hotConf[key] = value
    }
    this.buffer(() => {
      console.log('Successfully stored data to /tmp/conf/conf.json')
      fs.promises.writeFile(confPath, stringify(hotConf))
    })
    return value
  }

  del(key) {
    delete hotConf[key]
    this.set()
  }

  clear() {
    hotConf = {}
    this.set()
  }

  // Buffer to avoid multiple request
  buffer(cb) {
    timeUpdater ? clearTimeout(timeUpdater) : null
    timeUpdater = setTimeout(cb)
  }
}

function stringify(data) {
  if (!data) return
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

module.exports = new Conf()
