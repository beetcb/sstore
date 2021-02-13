### what the hack is `tcb-conf`?

**tcb-conf is how you store conf at cloudbase function runtime**，inspired by [conf](https://github.com/sindresorhus/conf) from [@sindresorhus](https://github.com/sindresorhus)

### when to use it?

When you have a tiny piese of data(a `secret-key`, for example), `tcb-conf` stores it for you. **Don't Worry: it will still be there next time you invoke that function**

Inaccurately, tcb-conf cloud be alternative to a database (for storing tiny data)

Note: Only using it inside Client NodeJS, it's convenient!

### how to use it?

```js
const Conf = require('@beetcb/tcb-conf')

/**
 * Conf instructor takes in 1 or 0 param to create a entity
 * - `timeout` your function timeout, you can ignore it when the default timeout is used
 */
const conf = new Conf(10)

// Make sure to use the async function, otherwise it will block the code execution
exports.main = async () => {
  console.log(conf.get('secret') || conf.set('secret', 'xxx 🕊'))
}
```
