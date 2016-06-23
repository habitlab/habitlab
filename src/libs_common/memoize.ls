export memoizeSingleAsync = (func) ->
  cached_val = null
  return (callback) ->
    if cached_val?
      callback(cached_val)
      return
    func (result) ->
      cached_val := result
      callback result

export memoize = (func) ->
  memo = {}
  slice = Array.prototype.slice
  return ->
    args = slice.call arguments
    if memo[args]?
      return memo[args]
    else
      return (memo[args] = func.apply(this, args))
