const CloudBase = require('@cloudbase/manager-node')
const { SCF_FUNCTIONNAME: funcName, SCF_NAMESPACE } = process.env

const tcb = new CloudBase({ envId: SCF_NAMESPACE })

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
