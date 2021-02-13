const CloudBase = require('@cloudbase/manager-node')

let tcb, timeout, conf
// Make full use of functions `hot context`
// https://docs.cloudbase.net/cloud-function/deep-principle.html#shi-li-fu-yong
module.exports = class {
  constructor(t) {
    const data = process.env.conf
    conf = data ? JSON.parse(data) : {}
    tcb = new CloudBase({})
    timeout = t || 20000
  }

  get(key) {
    return conf[key]
  }

  set(key, value) {
    conf[key] = value
    let timeUpdater
    // Store conf as env, this shall not block function runtime
    timeUpdater ? clearTimeout(timeUpdater) : null
    timeUpdater = setTimeout(
      () =>
        tcb.functions.updateFunctionConfig({
          name: process.env.SCF_FUNCTIONNAME,
          envVariables: { conf: JSON.stringify(conf) },
        }),
      timeout - 1000
    )
  }
}
