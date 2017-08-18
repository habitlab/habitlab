async function promise_all_object(object) {
  let keys = Object.keys(object)
  let value_promises = []
  for (let key of keys) {
    value_promises.push(object[key])
  }
  let values = await Promise.all(value_promises)
  let output = {}
  for (let i = 0; i < keys.length; ++i) {
    let key = keys[i]
    let value = values[i]
    output[key] = value
  }
  return output
}

module.exports = {
  promise_all_object
}
