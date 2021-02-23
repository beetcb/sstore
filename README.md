### What the hack is `sstore`?

**s**erverless-**store** is how you store tiny things at serverless function runtime，inspired by [conf](https://github.com/sindresorhus/conf).

### When to use it?

When you have a tiny piese of data(an expiring `access-token`, for example), `sstore` stores it for you.

Inaccurately, sstore cloud be alternative to a database (for storing tiny data).

Better yet, sstore **won't block any code execution** and **there are no network requests** until you use the `sstore.close` method.

> You can also use it as a function runtime's environment variables setter(beacause we store thing to there, but only [CloudBase](https://github.com/TencentCloudBase) is supported) right now!

### How to use it?

```js
const sstore = require('@beetcb/sstore')

exports.main = () => {
  // If `secret` if undefind, set it
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
- getGlEnv(`key`)[CloudBase]: get global environment variable `key`'s value
- setGlEnv(`key`, `value`)[CloudBase]: set global environment variable `key`'s `value`
- delGlEnv(`key`)[CloudBase]: delete global environment variable `key`'s value
- **`close()`**: This is where the sstore really starts to store, you **must** call it after all of your code logic is done, which will avoid blocking code execution

### How it works?

Under the hood, when a serverless function is about to end, you need to call `sstore.close` manually which does these things:

- On platforms that do not support(or hard to implement) setting environment variables via api(e.g. Vercel): `sstore` stores data to `/tmp/conf/conf.json`, **please do not rely on it, it's non-persistent**

- On platforms that do support setting environment variables via api(e.g. CloudBase): `sstore` starts to update the function's environment variables for next time invoking, **you can rely on it, it will be there next time you invoke that function**
