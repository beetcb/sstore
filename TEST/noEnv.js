const sstore = require('../src/index')
;(async () => {
  console.log(sstore.get('key') || sstore.set('key', 'value'))
  sstore.close()
})()
