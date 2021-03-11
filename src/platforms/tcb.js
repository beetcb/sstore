const CloudBase = require('@cloudbase/manager-node')
const funcName = process.env.SCF_FUNCTIONNAME

tcb = new CloudBase({ envId: SCF_NAMESPACE })

exports.getEnv = envVariables =>
  tcb.functions.getFunctionDetail(funcName).then(({ Environment }) => {
    Environment.Variables.forEach(e => {
      envVariables[e.Key] = e.Value
    })
  })

exports.storeEnv = envVariables =>
  tcb.functions.updateFunctionConfig({
    name: funcName,
    envVariables,
  })
