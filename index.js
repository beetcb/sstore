const haveEnvSetter = require('./haveEnvSetter')
const noEnvSetter = require('./noEnvSetter')
const isHaveEnvSetter = process.env.SCF_METADATA_TCB_FD !== undefined

module.exports = isHaveEnvSetter ? haveEnvSetter : noEnvSetter
