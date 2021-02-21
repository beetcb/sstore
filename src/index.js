const isHaveEnvSetter = process.env.SCF_METADATA_TCB_FD
module.exports = isHaveEnvSetter
  ? require('./haveEnvSetter')
  : require('./noEnvSetter')
