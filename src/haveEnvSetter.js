const CloudBase = require('@cloudbase/manager-node')
const { SCF_FUNCTIONNAME, SCF_NAMESPACE } = process.env

let tcb, hotConf
const envVariables = {}

// Make full use of functions `hot context`
// https://docs.cloudbase.net/cloud-function/deep-principle.html#shi-li-fu-yong
class Conf {
  constructor() {
    const data = process.env.conf
    hotConf = data ? JSON.parse(data) : {}
    tcb = new CloudBase({ envId: SCF_NAMESPACE })
    tcb.functions
      .getFunctionDetail(SCF_FUNCTIONNAME)
      .then(({ Environment }) => {
        Environment.Variables.forEach(e => {
          envVariables[e.Key] = e.Value
        })
      })
  }

  get(key) {
    return hotConf[key]
  }

  set(key, value) {
    if (key && value !== undefined) {
      hotConf[key] = value
      envVariables.conf = stringify(hotConf)
    }
    return value
  }

  del(key) {
    delete hotConf[key]
    this.set()
  }

  clear() {
    hotConf = {}
    envVariables.conf = {}
    this.set()
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
    // Store conf as env, this shall not block function runtime
    tcb.functions.updateFunctionConfig({
      name: SCF_FUNCTIONNAME,
      envVariables,
    })
  }
}

function stringify(data) {
  if (!data) return
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

module.exports = new Conf()
