const CloudBase = require('@cloudbase/manager-node')
const { SCF_FUNCTIONNAME, SCF_NAMESPACE } = process.env

let tcb, timeout, timeUpdater, hotConf
const envVariables = {}

// Make full use of functions `hot context`
// https://docs.cloudbase.net/cloud-function/deep-principle.html#shi-li-fu-yong
class Conf {
  constructor() {
    const data = process.env.conf
    hotConf = data ? JSON.parse(data) : {}
    tcb = new CloudBase({ envId: SCF_NAMESPACE })
  }

  async load() {
    const { Environment, Timeout } = await tcb.functions.getFunctionDetail(
      SCF_FUNCTIONNAME
    )
    Environment.Variables.forEach(e => {
      envVariables[e.Key] = e.Value
    })
    this.timeTracker = process.hrtime()

    timeout = Timeout
  }

  get(key) {
    return hotConf[key]
  }

  set(key, value) {
    hotConf[key] = value
    envVariables.conf = stringify(hotConf)
    // Store conf as env, this shall not block function runtime
    this.buffer(() =>
      tcb.functions.updateFunctionConfig({
        name: SCF_FUNCTIONNAME,
        envVariables,
      })
    )
    return value
  }

  // Get global env variables
  getGlEnv(key) {
    return envVariables[key]
  }

  // Set global env variables
  setGlEnv(key, value) {
    envVariables[key] = stringify(value)
    this.buffer(() =>
      tcb.functions.updateFunctionConfig({
        name: funcName,
        envVariables,
      })
    )
    return value
  }

  // Buffer to avoid multiple request
  buffer(cb) {
    const last = timeout - hrtimeToSeconds(this.timeTracker)
    console.log(
      `Will update env after ${last} seconds (the prev update had been canceled!)`
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
