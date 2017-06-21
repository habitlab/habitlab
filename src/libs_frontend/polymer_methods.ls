$ = require 'jquery'

{yfy} = require 'cfy'

export {msg} = require 'libs_common/localization_utils'

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

export once_available = yfy (selector, callback) ->
  self = this
  current_result = self.$$(selector)
  if current_result != null
    callback current_result
  else
    setTimeout ->
      self.once_available selector, callback
    , 100

export once_available_multiselect = yfy (selector, callback) ->
  self = this
  current_result = Polymer.dom(self.root).querySelectorAll(selector)
  if current_result.length > 0
    callback current_result
  else
    setTimeout ->
      self.once_available_multiselect selector, callback
    , 100

css_element_queries_cached = null
get_css_element_queries = ->>
  if css_element_queries_cached?
    return css_element_queries_cached
  css_element_queries_cached := await SystemJS.import('css-element-queries')
  return css_element_queries_cached

export on_resize = (selector, callback) ->
  self = this
  get_css_element_queries().then (css_element_queries) ->
    once_available.call(self, selector).then (elem) ->
      css_element_queries.ResizeSensor(elem, callback)

export on_resize_elem = (elem, callback) ->
  self = this
  get_css_element_queries().then (css_element_queries) ->
    css_element_queries.ResizeSensor(elem, callback)
