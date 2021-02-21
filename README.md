### what the hack is `sstore`?

**s**erverless-**store** is how you store things at serverless function runtime，inspired by [conf](https://github.com/sindresorhus/conf)

You can also use it as a function runtime's environment variables setter(beacause we store thing to there, but only [CloudBase](https://github.com/TencentCloudBase) is supported)

### when to use it?

When you have a tiny piese of data(an expiring `access-token`, for example), `sstore` stores it for you.

Inaccurately, sstore cloud be alternative to a database (for storing tiny data)

### how to use it?

```js
const sstore = require('@beetcb/sstore')

exports.main = async () => {
  // Init conf entity, pass in function timeout, cloud be ignored under Cloudbase
  await sstore.load(20)
  console.log(sstore.get('secret') || sstore.set('secret', 'xxx 🕊'))
}
```

**sstore.\<`method`\>**:

- get(`key`): get `key`'s value
- set(`key`, `value`): set `key` using `value`
- del(`key`): delete `key`'s value
- clear(): delete all the key value pairs
- getGlEnv(`key`)[CloudBase]: get global environment variable `key`'s value
- setGlEnv(`key`, `value`)[CloudBase]: set global environment variable `key`'s `value`
- delGlEnv(`key`)[CloudBase]: delete global environment variable `key`'s value

### how it works?

Under the hood, when the function is about to end:

- On platforms that do not support setting environment variables via api(e.g. Vercel): `sstore` stores data to `/tmp/conf/conf.json`, please do not rely on it, it's non-persistent

- On platforms that do support setting environment variables via api(e.g. CloudBase): `sstore` starts to update the function's environment variables for next time invoking, stored data will still be there next time you invoke that function
