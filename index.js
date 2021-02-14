const CloudBase = require('@cloudbase/manager-node')
const funcName = process.env.SCF_FUNCTIONNAME

let tcb, timeout, timeUpdater, conf
const envVariables = {}

// Make full use of functions `hot context`
// https://docs.cloudbase.net/cloud-function/deep-principle.html#shi-li-fu-yong
class Conf {
  constructor() {
    const data = process.env.conf
    conf = data ? JSON.parse(data) : {}
    tcb = new CloudBase({})
  }

  async load() {
    const { Environment, Timeout } = await tcb.functions.getFunctionDetail(
      funcName
    )
    Environment.Variables.forEach(e => {
      envVariables[e.Key] = e.Value
    })
    timeout = Timeout
  }

  get(key) {
    return conf[key]
  }

  set(key, value) {
    conf[key] = value
    // Store conf as env, this shall not block function runtime
    buffer(() => {
      envVariables.conf = stringify(conf)
      tcb.functions.updateFunctionConfig({
        name: funcName,
        envVariables,
      })
    })
    return value
  }

  // Get global env variables
  getGlEnv(key) {
    return envVariables[key]
  }

  // Set global env variables
  setGlEnv(key, value) {
    buffer(() => {
      envVariables[key] = stringify(value)
      tcb.functions.updateFunctionConfig({
        name: funcName,
        envVariables,
      })
    })
    return value
  }
}

function stringify(data) {
  if (!data) return
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

// Buffer to avoid multiple request
function buffer(cb) {
  timeUpdater ? clearTimeout(timeUpdater) : null
  timeUpdater = setTimeout(cb, timeout - 10)
}

module.exports = new Conf()
