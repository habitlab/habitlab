css_element_queries = require('css-element-queries')

export on_resize = (selector, callback) ->
  self = this
  once_available.call(self, selector).then (elem) ->
    css_element_queries.ResizeSensor(elem, callback)

export on_resize_elem = (elem, callback) ->
  css_element_queries.ResizeSensor(elem, callback)
