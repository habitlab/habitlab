export as_array = (data) ->
  if Array.isArray(data)
    return data
  return [k for k,v of data when v == true]

export as_dictset = (data) ->
  if Array.isArray(data)
    return {[k, true] for k in data}
  return data
