process.env.SCF_METADATA_TCB_FD = ''
const sstore = require('../src/index')

;(async () => {
  sstore.clear()
  sstore.set('a', 'b')
  sstore.close()
})()
