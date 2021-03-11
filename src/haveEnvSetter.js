const stringify = require('./util/stringify')

const platform = {
  vercel: process.env.VERCEL,
  tcb: process.env.SCF_FUNCTIONNAME,
}

const { getEnv, storeEnv } = require(`./platforms/
  ${Object.keys(platform).reduce(
    (string, e) => (platform[e] ? string + e : string),
    ''
  )}`)

let hotConf
const envVariables = {}

// Make full use of functions `hot context`
// https://docs.cloudbase.net/cloud-function/deep-principle.html#shi-li-fu-yong
class Conf {
  constructor() {
    const data = process.env.conf
    hotConf = data ? JSON.parse(data) : {}
    getEnv && getEnv()
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

  // Buffer to avoid multiple request
  close() {
    envVariables.conf = stringify(hotConf)
    // Store conf as env, this shall not block function runtime
    storeEnv()
  }
}

module.exports = new Conf()
