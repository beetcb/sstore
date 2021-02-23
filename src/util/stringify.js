module.exports = function stringify(data) {
  if (typeof data === 'undefined') return
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}
