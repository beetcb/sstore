[![npm](https://img.shields.io/npm/v/@beetcb/sstore?style=social)](https://www.npmjs.com/package/@beetcb/sstore)

### What the hack is `sstore`?

**s**erverless-**store** is how you store tiny things at serverless function runtime **temporarily**，inspired by [conf](https://github.com/sindresorhus/conf).

### When to use it?

When you have a tiny piese of data(an expiring `access-token`, for example), `sstore` stores it for you to path `/temp/conf/${md5('conf.json')`.

Better yet, sstore **won't block any code execution** during runtime.

### How to use it?

```js
const sstore = require('@beetcb/sstore')

exports.main = () => {
  // If `secret` is undefind, set it
  console.log(sstore.get('secret') || sstore.set('secret', 'xxx 🕊'))
  // Code logic is done, starts storing,
  sstore.close()
}
```

**sstore.\<`method`\>**:

- get(`key`): get `key`'s value
- set(`key`, `value`): set `key` using `value`
- del(`key`): delete `key`'s value
- clear(): delete all the key value pairs
- **`close()`**: This is where the sstore really starts to store
