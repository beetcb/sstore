const platforms = {
  tcb: process.env.SCF_FUNCTIONNAME,
}

const curPlatform = Object.keys(platforms).reduce(
  (string, e) => (platforms[e] ? string + e : string),
  ''
)

module.exports = curPlatform
  ? require('./haveEnvSetter')(curPlatform)
  : require('./noEnvSetter')(curPlatform)
