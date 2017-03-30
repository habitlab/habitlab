{yfy} = require 'cfy'

debounce = require('promise-debounce')

export memoizeSingleAsync = (func) ->
  debounced_func = debounce func
  cached_val = null
  return ->>
    if cached_val?
      return cached_val
    result = await debounced_func()
    cached_val := result
    return result

export memoize = (func) ->
  memo = {}
  slice = Array.prototype.slice
  return ->
    args = slice.call arguments
    if memo[args]?
      return memo[args]
    else
      return (memo[args] = func.apply(this, args))
