process.env.SCF_METADATA_TCB_FD = ''
const sstore = require('../src/index')

;(async () => {
  console.log(sstore.get('a'))
  sstore.set('a', 'b')
  sstore.close()
})()
