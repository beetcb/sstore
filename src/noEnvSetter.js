const fs = require('fs')
const confPath = `/tmp/conf/conf.json`

let hotConf, timeout, timeUpdater

class Conf {
  // We need to manually pass in the timeout cause we simply don't
  async load(to) {
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
    this.timeTracker = process.hrtime()
    // Get function timeout from user
    timeout = to || 10
    hotConf = JSON.parse(await fs.promises.readFile(confPath))
  }

  get(key) {
    return hotConf[key]
  }

  set(key, value) {
    hotConf[key] = value
    this.buffer(() => {
      fs.promises.writeFile(confPath, stringify(hotConf))
    })
    return value
  }

  // Buffer to avoid multiple request
  buffer(cb) {
    const last = timeout - hrtimeToSeconds(this.timeTracker)
    console.log(
      `Will update env after ${last} seconds (the prev update was been canceled!)`
    )
    timeUpdater ? clearTimeout(timeUpdater) : null
    timeUpdater = setTimeout(cb, (last - 0.1) * 1000)
  }
}

function stringify(data) {
  if (!data) return
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

function hrtimeToSeconds(timeTracker) {
  const hrtime = process.hrtime(timeTracker)
  return (hrtime[0] * 1e9 + hrtime[1]) / 1e9
}

module.exports = new Conf()
