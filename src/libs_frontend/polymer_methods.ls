$ = require 'jquery'
require! 'js-yaml'

export S = (pattern) ->
  $(this.$$(pattern))

export SM = (pattern) ->
  $(this.querySelectorAll(pattern))

export iterate_object_items = (obj) ->
  [{key: k, value: obj[k]} for k in Object.keys(obj)]

export iterate_object_keys = (obj) ->
  Object.keys(obj)

export iterate_object_values: (obj) ->
  [obj[k] for k in Object.keys(obj)]

export json_stringify = (obj) ->
  JSON.stringify(obj, null, 2)

export yaml_stringify = (obj) ->
  js-yaml.dump JSON.parse JSON.stringify obj

export once_available = (selector, callback) ->
  self = this
  current_result = self.querySelectorAll(selector)
  if current_result.length > 0
    callback current_result
  else
    setTimeout ->
      self.once_available selector, callback
    , 100
