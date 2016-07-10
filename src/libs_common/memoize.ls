{yfy, cfy} = require 'cfy'

debounce = require('promise-debounce')

export memoizeSingleAsync = (func) ->
  debounced_func = debounce yfy func
  cached_val = null
  return cfy ->*
    if cached_val?
      return cached_val
    result = yield debounced_func()
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
