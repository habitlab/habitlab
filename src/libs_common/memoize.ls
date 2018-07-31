export memoizeSingleAsync = (func) ->
  cached_promise = null
  return ->
    if cached_promise?
      return cached_promise
    result = func()
    cached_promise := result
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
