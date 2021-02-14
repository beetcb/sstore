### what the hack is `tcb-conf`?

**tcb-conf is how you store conf at cloudbase function runtime**，inspired by [conf](https://github.com/sindresorhus/conf) from [@sindresorhus](https://github.com/sindresorhus)

**You can also use it as a cloudbase function runtime's environment variables setter**(beacause we store thing to there)

### when to use it?

When you have a tiny piese of data(a `secret-key`, for example), `tcb-conf` stores it for you. **Don't Worry: it will still be there next time you invoke that function**

Inaccurately, tcb-conf cloud be alternative to a database (for storing tiny data)

Note: Only using it inside Client NodeJS, it's convenient!

### how to use it?

```js
const conf = require('@beetcb/tcb-conf')

// Make sure to use the async function, otherwise it will block the code execution
exports.main = async () => {
  // Init conf entity
  await conf.load()
  console.log(conf.get('secret') || conf.set('secret', 'xxx 🕊'))
}
```

**conf.\<`method`\>**:

- get(`key`): get conf `key`'s value
- set(`key`, `value`): set conf `key` using `value`
- getGlEnv(`key`): get global environment variable `key`'s value
- setGlEnv(`key`, `value`): set global environment variable `key` using `value`

### how it works?

Under the hood, when the function is about to reach the timeout(about 10ms brfore timeout), `tcb-conf` starts to update the function's environment variables for next time invoking
