const CloudBase = require('@cloudbase/manager-node')
const { SCF_FUNCTIONNAME, SCF_NAMESPACE } = process.env

let tcb, timeUpdater, hotConf
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
    const { Environment } = await tcb.functions.getFunctionDetail(
      SCF_FUNCTIONNAME
    )
    Environment.Variables.forEach(e => {
      envVariables[e.Key] = e.Value
    })
  }

  get(key) {
    return hotConf[key]
  }

  set(key, value) {
    if (key && value) {
      hotConf[key] = value
      envVariables.conf = stringify(hotConf)
    }
    // Store conf as env, this shall not block function runtime
    this.buffer(() => {
      console.log('Successfully stored env variables')
      tcb.functions.updateFunctionConfig({
        name: SCF_FUNCTIONNAME,
        envVariables,
      })
    })
    return value
  }

  del(key) {
    delete hotConf[key]
    this.set()
  }

  clear() {
    envVariables.conf = {}
    this.set()
  }

  // Get global env variables
  getGlEnv(key) {
    return envVariables[key]
  }

  // Set global env variables
  setGlEnv(key, value) {
    if (key && value) {
      envVariables[key] = stringify(value)
    }
    this.buffer(() => {
      console.log('Successfully stored env variables')
      tcb.functions.updateFunctionConfig({
        name: SCF_FUNCTIONNAME,
        envVariables,
      })
    })
    return value
  }

  delGlEnv(key) {
    delete envVariables[key]
    this.setGlEnv()
  }

  // Buffer to avoid multiple request
  buffer(cb) {
    timeUpdater ? clearTimeout(timeUpdater) : null
    timeUpdater = setTimeout(cb, 0)
  }
}

function stringify(data) {
  if (!data) return
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

module.exports = new Conf()
