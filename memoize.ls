export memoizeSingleAsync = (func) ->
  cached_val = null
  return (callback) ->
    if cached_val?
      callback(cached_val)
      return
    func (result) ->
      cached_val := result
      callback result