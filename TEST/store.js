const sstore = require('../dist/index')
;(async () => {
  await sstore.load()
  console.log(sstore.get('key') || sstore.set('key', 'value'))
})()
