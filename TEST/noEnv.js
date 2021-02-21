const sstore = require('../src/index')
;(async () => {
  await sstore.load()
  console.log(sstore.get('key') || sstore.set('key', 'value'))
  // sstore.del('key')
})()
