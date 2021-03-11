const fetch = require('node-fetch')

exports.storeEnv = async envVariables => {
  const { access_token } = process.env
  if (access_token) {
    await Promise.all(
      Object.keys(envVariables).map(e =>
        fetch('https://api.vercel.com', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: e,
            value: envVariables[e],
          }),
        })
      )
    )
  }
}
