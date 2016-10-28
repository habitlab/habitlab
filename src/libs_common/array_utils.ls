export unique = (arr) ->
  output = []
  seen = {}
  for x in arr
    if seen[x]?
      continue
    seen[x] = true
    output.push x
  return output

export unique_concat = (...array_list) ->
  output = []
  seen = {}
  for arr in array_list
    for x in arr
      if seen[x]?
        continue
      seen[x] = true
      output.push x
  return output
