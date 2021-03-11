const isHaveEnvSetter = process.env.SCF_FUNCTIONNAME !== undefined

module.exports = isHaveEnvSetter
  ? require('./haveEnvSetter')
  : require('./noEnvSetter')
