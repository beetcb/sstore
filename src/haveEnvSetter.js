const stringify = require('./util/stringify')

let hotConf
const envVariables = {}

// Make full use of functions `hot context`
// https://docs.cloudbase.net/cloud-function/deep-principle.html#shi-li-fu-yong
class Conf {
  constructor(curPlatform) {
    const data = process.env.conf
    hotConf = data ? JSON.parse(data) : {}
    const { getEnv, storeEnv } = foolBundler(curPlatform)
    this.curPlatform = curPlatform
    this.getCustomEnv = getEnv
    this.storeEnv = storeEnv
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

  // Get global env variables
  getGlEnv(key) {
    return process.env[key]
  }

  // Set global env variables
  setGlEnv(key, value) {
    if (key && value !== undefined) {
      process.env[key] = envVariables[key] = stringify(value)
    }
    return value
  }

  delGlEnv(key) {
    delete envVariables[key]
    process.env[key] = undefined
    this.setGlEnv()
  }

  // A buffer to avoid multiple network request
  async close() {
    // Grab original env variables, tcb specific
    if (this.curPlatform === 'tcb') {
      await this.getCustomEnv(envVariables)
    }
    // Create or update conf
    envVariables.conf = stringify(hotConf)
    // Store conf as env, this shall not block function runtime
    await this.storeEnv(envVariables)
  }
}

function getCurPlatform() {
  const platforms = {
    tcb: process.env.SCF_FUNCTIONNAME,
  }

  return Object.keys(platforms).reduce(
    (string, e) => (platforms[e] ? string + e : string),
    ''
  )
}

function foolBundler(curPlatform) {
  switch (curPlatform) {
    case 'tcb': {
      return require('./platforms/tcb')
    }
  }
}

module.exports = new Conf(getCurPlatform())
