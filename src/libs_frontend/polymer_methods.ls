$ = require 'jquery'

sleep = (time) ->>
  return new Promise ->
    setTimeout(it, time)

export S = (pattern) ->
  $(this.$$(pattern))

export SM = (pattern) ->
  $(Polymer.dom(this.root).querySelectorAll(pattern))

export $$$ = (pattern) ->
  Polymer.dom(this.root).querySelectorAll(pattern)

export is_not = (cond) ->
  return !cond

export is_not_equal = (cond, val) ->
  return cond != val

export is_not_equal_to_any = (cond, ...val_list) ->
  for val in val_list
    if cond == val
      return false
  return true

export is_equal = (cond, val) ->
  return cond == val

export is_greater_than = (cond, val) ->
  return cond > val

export is_less_than = (cond, val) ->
  return cond < val

export is_greater_than_or_equal_to = (cond, val) ->
  return cond >= val

export is_less_than_or_equal_to = (cond, val) ->
  return cond <= val

export text_if = (cond, text) ->
  if cond
    return text
  return ''

export text_if_not = (cond, text) ->
  if not cond
    return text
  return ''

export text_if_equal = (val1, val2, text) ->
  if val1 == val2
    return text
  return ''

export text_if_elem_in_array = (elem, array, text) ->
  if array.includes(elem)
    return text
  return ''

export text_if_elem_not_in_array = (elem, array, text) ->
  if not array.includes(elem)
    return text
  return ''

export first_elem = (list) ->
  if list? and list.length > 0
    return list[0]
  return

export get_key = (obj, key) ->
  if obj?
    return obj[key]
  return

export get_key_for_first_elem = (list, key) ->
  if list? and list[0]?
    return list[0][key]
  return

export at_index = (list, index) ->
  return list[index]

export xrange = (start, end) ->
  if not end?
    end = start
    start = 0
  return [start til end]

export iterate_object_items = (obj) ->
  [{key: k, value: obj[k]} for k in Object.keys(obj)]

export iterate_object_keys = (obj) ->
  Object.keys(obj)

export iterate_object_values: (obj) ->
  [obj[k] for k in Object.keys(obj)]

export json_stringify = (obj) ->
  JSON.stringify(obj, null, 2)

export once_available = (selector, callback) ->>
  self = this
  current_result = self.$$(selector)
  while not current_result?
    current_result = self.$$(selector)
    await sleep(100)
  if callback?
    callback(current_result)
  return current_result

export once_available_multiselect = (selector, callback) ->>
  self = this
  current_result = Polymer.dom(self.root).querySelectorAll(selector)
  while not current_result?
    current_result = Polymer.dom(self.root).querySelectorAll(selector)
    await sleep(100)
  if callback?
    callback(current_result)
  return current_result
